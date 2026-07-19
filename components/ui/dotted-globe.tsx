"use client";

import { useEffect, useRef, useState } from "react";
import { geoGraticule10, geoOrthographic, geoPath } from "d3-geo";
import { timer, type Timer } from "d3-timer";
import type { Feature, FeatureCollection, MultiPolygon, Polygon } from "geojson";
import { cn, withBasePath } from "@/lib/utils";

type LandFeature = Feature<Polygon | MultiPolygon>;

interface DotData {
  lng: number;
  lat: number;
  // Precomputed unit vector, so per-frame hemisphere culling is a dot
  // product instead of spherical trig.
  x: number;
  y: number;
  z: number;
  tier: number;
}

const RAD = Math.PI / 180;
const TAU = 2 * Math.PI;

// Entry view: Europe and the Mediterranean face the visitor, not the Pacific.
const START_ROTATION: [number, number] = [-20, -30];
const ROTATION_SPEED = 4; // degrees per second
const DOT_STEP = 1.3; // degrees between halftone dots

// The warm heart of the globe — dots near Europe and the Mediterranean render
// brighter and slightly larger, tying the globe to the countries the projects
// reach. A radial falloff in tiers, not a lat-lng box: a box draws its own
// hard edges across the Sahara and the Middle East.
const WARM_CENTER: [number, number] = [22, 41];
const WARM_FULL = 20; // degrees of arc at full warmth
const WARM_FADE = 34; // fully faded out past this arc
const WARM_TIERS = 3;

function pointInRing(point: [number, number], ring: number[][]): boolean {
  const [x, y] = point;
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i];
    const [xj, yj] = ring[j];
    if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) {
      inside = !inside;
    }
  }
  return inside;
}

function pointInPolygon(point: [number, number], rings: number[][][]): boolean {
  if (!pointInRing(point, rings[0])) return false;
  for (let i = 1; i < rings.length; i++) {
    if (pointInRing(point, rings[i])) return false;
  }
  return true;
}

function pointInFeature(point: [number, number], feature: LandFeature): boolean {
  const geometry = feature.geometry;
  if (geometry.type === "Polygon") {
    return pointInPolygon(point, geometry.coordinates);
  }
  return geometry.coordinates.some((rings) => pointInPolygon(point, rings));
}

// Planar bounds straight off the coordinates — geoBounds is spherical and
// misbehaves on features that cross the antimeridian.
function featureBounds(feature: LandFeature): [number, number, number, number] {
  let minLng = 180;
  let maxLng = -180;
  let minLat = 90;
  let maxLat = -90;
  const polygons =
    feature.geometry.type === "Polygon"
      ? [feature.geometry.coordinates]
      : feature.geometry.coordinates;
  for (const rings of polygons) {
    for (const [lng, lat] of rings[0]) {
      if (lng < minLng) minLng = lng;
      if (lng > maxLng) maxLng = lng;
      if (lat < minLat) minLat = lat;
      if (lat > maxLat) maxLat = lat;
    }
  }
  return [minLng, minLat, maxLng, maxLat];
}

function toVector(lng: number, lat: number): [number, number, number] {
  return [
    Math.cos(lat * RAD) * Math.cos(lng * RAD),
    Math.cos(lat * RAD) * Math.sin(lng * RAD),
    Math.sin(lat * RAD),
  ];
}

function warmTier(x: number, y: number, z: number): number {
  const [cx, cy, cz] = toVector(...WARM_CENTER);
  const arc = Math.acos(Math.min(1, x * cx + y * cy + z * cz)) / RAD;
  if (arc >= WARM_FADE) return 0;
  if (arc <= WARM_FULL) return WARM_TIERS;
  return Math.ceil(((WARM_FADE - arc) / (WARM_FADE - WARM_FULL)) * WARM_TIERS);
}

function generateDots(land: FeatureCollection): DotData[] {
  const dots: DotData[] = [];
  for (const feature of land.features as LandFeature[]) {
    const [minLng, minLat, maxLng, maxLat] = featureBounds(feature);
    for (let lng = minLng; lng <= maxLng; lng += DOT_STEP) {
      for (let lat = minLat; lat <= maxLat; lat += DOT_STEP) {
        if (!pointInFeature([lng, lat], feature)) continue;
        const [x, y, z] = toVector(lng, lat);
        dots.push({ lng, lat, x, y, z, tier: warmTier(x, y, z) });
      }
    }
  }
  return dots;
}

interface DottedGlobeProps {
  className?: string;
}

// A wireframe globe sitting in the home page's warm ground: no ocean fill —
// the ground itself is the ocean — with the land drawn as halftone dots in
// pine, lit by the amber halo behind it. Decorative (aria-hidden): the
// meaning it illustrates is carried by the countries stat beside it.
export function DottedGlobe({ className }: DottedGlobeProps) {
  const wrapperRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [lit, setLit] = useState(false);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!wrapper || !canvas || !context) return;

    // Canvas can't use CSS variables, so the tokens are read off the root
    // once — the component never hardcodes a color.
    const styles = getComputedStyle(document.documentElement);
    const token = (name: string) => styles.getPropertyValue(name).trim();
    const pine = token("--color-pine");
    const ink = token("--color-ink");

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const projection = geoOrthographic().clipAngle(90);
    const path = geoPath(projection, context);
    const graticule = geoGraticule10();
    const sphere = { type: "Sphere" } as const;

    const rotation: [number, number] = [...START_ROTATION];
    let dots: DotData[] = [];
    let land: FeatureCollection | null = null;
    let size = 0;
    let disposed = false;

    const resize = () => {
      size = wrapper.clientWidth;
      if (size === 0) return;
      const dpr = window.devicePixelRatio || 1;
      canvas.width = size * dpr;
      canvas.height = size * dpr;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      projection.scale(size / 2 - 2).translate([size / 2, size / 2]);
    };

    const drawDots = (tier: number, radius: number) => {
      // One batched path per warmth tier: thousands of individual fill()
      // calls are what makes canvas halftones stutter.
      const [cx, cy, cz] = toVector(-rotation[0], -rotation[1]);
      context.beginPath();
      for (const dot of dots) {
        if (dot.tier !== tier) continue;
        if (dot.x * cx + dot.y * cy + dot.z * cz <= 0) continue;
        const p = projection([dot.lng, dot.lat]);
        if (!p) continue;
        context.moveTo(p[0] + radius, p[1]);
        context.arc(p[0], p[1], radius, 0, TAU);
      }
      context.fill();
    };

    const render = () => {
      if (size === 0) return;
      projection.rotate(rotation);
      context.clearRect(0, 0, size, size);

      // On the warm ground the structure lines have to stay whisper-faint:
      // at full strength a dark graticule reads as a wireframe cage rather
      // than the suggestion of a sphere.
      context.beginPath();
      path(sphere);
      context.strokeStyle = ink;
      context.lineWidth = 1;
      context.globalAlpha = 0.18;
      context.stroke();

      context.beginPath();
      path(graticule);
      context.strokeStyle = ink;
      context.lineWidth = 0.6;
      context.globalAlpha = 0.08;
      context.stroke();

      if (land) {
        context.beginPath();
        for (const feature of land.features) path(feature);
        context.strokeStyle = pine;
        context.lineWidth = 0.8;
        context.globalAlpha = 0.16;
        context.stroke();

        // One color for the land — the warmth comes from the halo behind the
        // globe, not from a second dot hue. Europe and the Mediterranean read
        // as the heart through weight alone.
        const baseRadius = Math.max(1, size * 0.0026);
        context.fillStyle = pine;
        context.globalAlpha = 0.5;
        drawDots(0, baseRadius);
        context.globalAlpha = 0.65;
        drawDots(1, baseRadius * 1.15);
        context.globalAlpha = 0.8;
        drawDots(2, baseRadius * 1.3);
        context.globalAlpha = 0.95;
        drawDots(3, baseRadius * 1.5);
      }
      context.globalAlpha = 1;
    };

    // Auto-rotation: paused while dragging, stopped entirely while the globe
    // is off-screen, never started under reduced motion.
    let rotationTimer: Timer | null = null;
    let lastElapsed = 0;
    let dragging = false;

    const startTimer = () => {
      if (rotationTimer || reducedMotion) return;
      lastElapsed = 0;
      rotationTimer = timer((elapsed) => {
        const delta = elapsed - lastElapsed;
        lastElapsed = elapsed;
        if (dragging) return;
        rotation[0] = (rotation[0] + (delta / 1000) * ROTATION_SPEED) % 360;
        render();
      });
    };
    const stopTimer = () => {
      rotationTimer?.stop();
      rotationTimer = null;
    };

    const intersection = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) startTimer();
      else stopTimer();
    });
    intersection.observe(wrapper);

    const resizeObserver = new ResizeObserver(() => {
      resize();
      render();
    });
    resizeObserver.observe(wrapper);

    // Drag-to-rotate is desktop-pointer only. Touch is left completely
    // alone so the globe never traps vertical scrolling on mobile.
    const handlePointerDown = (event: PointerEvent) => {
      if (event.pointerType !== "mouse") return;
      dragging = true;
      const startX = event.clientX;
      const startY = event.clientY;
      const startRotation: [number, number] = [...rotation];

      const handlePointerMove = (move: PointerEvent) => {
        rotation[0] = startRotation[0] + (move.clientX - startX) * 0.25;
        rotation[1] = Math.max(
          -90,
          Math.min(90, startRotation[1] - (move.clientY - startY) * 0.25)
        );
        render();
      };
      const handlePointerUp = () => {
        window.removeEventListener("pointermove", handlePointerMove);
        window.removeEventListener("pointerup", handlePointerUp);
        dragging = false;
      };
      window.addEventListener("pointermove", handlePointerMove);
      window.addEventListener("pointerup", handlePointerUp);
    };
    canvas.addEventListener("pointerdown", handlePointerDown);

    resize();
    render();

    fetch(withBasePath("/data/ne_110m_land.json"))
      .then((response) => (response.ok ? response.json() : null))
      .then((data: FeatureCollection | null) => {
        if (disposed || !data) return;
        land = data;
        dots = generateDots(data);
        render();
        setLit(true);
      })
      // A globe that fails to load leaves the ground as it was; the section
      // reads fine without it.
      .catch(() => {});

    return () => {
      disposed = true;
      stopTimer();
      intersection.disconnect();
      resizeObserver.disconnect();
      canvas.removeEventListener("pointerdown", handlePointerDown);
    };
  }, []);

  return (
    <div ref={wrapperRef} aria-hidden="true" className={cn("relative aspect-square", className)}>
      <canvas
        ref={canvasRef}
        className={cn(
          "absolute inset-0 h-full w-full transition-opacity duration-[700ms] ease-out-quart",
          lit ? "opacity-100" : "opacity-0"
        )}
      />
    </div>
  );
}
