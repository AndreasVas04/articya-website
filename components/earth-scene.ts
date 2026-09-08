import {
  BackSide,
  Group,
  LinearMipmapLinearFilter,
  Mesh,
  NormalBlending,
  PerspectiveCamera,
  Quaternion,
  Scene,
  ShaderMaterial,
  SphereGeometry,
  SRGBColorSpace,
  Texture,
  Vector3,
  WebGLRenderer,
} from "three";

// The Earth beside "What we do": the planet itself, lit once from the upper
// left, turning slowly. Its skin is NASA's Blue Marble graded toward the
// section (scripts/globe-texture.mjs); a second map carries the night lights,
// the clouds and the water. The night side glows with its cities in the
// site's own amber, the sun glints on the sea, a thin weather layer turns a
// little faster than the ground, and the atmosphere is a soft blue limb.
// Everything here is loaded on demand a viewport ahead of the section and
// thrown away with it; earth-globe.tsx owns that lifecycle.

// Cyprus: the point the Earth faces the reader from when the section enters.
const HOME: [number, number] = [35.13, 33.43];

const DEG = Math.PI / 180;
// One revolution in 90 s; the weather drifts a fifth faster.
const SPIN_RATE = (2 * Math.PI) / 90;
const CLOUD_DRIFT = 0.2;
const AXIS_TILT = 23.4 * DEG;
// The camera looks a little down onto the sphere, so the northern countries
// sit inside the disc rather than foreshortened against its top edge.
const CAMERA_ELEVATION = 18 * DEG;
// The disc's diameter as a share of the canvas; the rest is the atmosphere's.
const DISC = 0.9;
const FOV = 26;
// Key light: upper left, 35° above the view axis, 45° to the left of it.
const LIGHT_ELEVATION = 35 * DEG;
const LIGHT_AZIMUTH = 45 * DEG;
// The terminator's softness, and how dark the night side's ground goes.
const TERMINATOR_WRAP = 0.18;
const NIGHT = 0.045;
// The atmosphere: sky blue on the limb, warmer where the sun catches it.
const ATMOSPHERE = "#8fbce6";
const ATMOSPHERE_SUN = "#f2d7a8";
const HALO_THICKNESS = 0.045;
// Drag: inertia damped 0.92 per 60 Hz frame, the spin back 4 s after the hand.
const DRAG_DAMPING = 0.92;
const IDLE_BEFORE_SPIN = 4000;
const SPIN_RETURN = 600;

// Latitude and longitude onto the unit sphere in the geometry's own frame:
// three's sphere puts texture u = 0 at (-1, 0, 0), which is the equirect's
// left edge at 180° W, so longitude runs the other way round z.
function toSphere(lat: number, lon: number, out = new Vector3()) {
  const la = lat * DEG;
  const lo = lon * DEG;
  return out.set(Math.cos(la) * Math.cos(lo), Math.sin(la), -Math.cos(la) * Math.sin(lo));
}

function hexToLinear(hex: string): Vector3 {
  const n = parseInt(hex.replace("#", ""), 16);
  const lin = (c: number) => {
    const s = c / 255;
    return s <= 0.04045 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  return new Vector3(lin((n >> 16) & 255), lin((n >> 8) & 255), lin(n & 255));
}

const GLOBE_VERTEX = /* glsl */ `
  varying vec2 vUv;
  varying vec3 vWorldNormal;
  varying vec3 vWorldPosition;
  void main() {
    vUv = uv;
    vWorldNormal = normalize(mat3(modelMatrix) * normal);
    vec4 wp = modelMatrix * vec4(position, 1.0);
    vWorldPosition = wp.xyz;
    gl_Position = projectionMatrix * viewMatrix * wp;
  }
`;
const GLOBE_FRAGMENT = /* glsl */ `
  uniform sampler2D map;
  uniform sampler2D pack;
  uniform vec3 lightDir;
  uniform vec3 cameraPos;
  uniform vec3 lightsColor;
  uniform vec3 atmosphere;
  uniform vec3 atmosphereSun;
  uniform float wrap;
  uniform float night;
  varying vec2 vUv;
  varying vec3 vWorldNormal;
  varying vec3 vWorldPosition;
  void main() {
    vec3 n = normalize(vWorldNormal);
    vec3 v = normalize(cameraPos - vWorldPosition);
    vec3 day = texture2D(map, vUv).rgb;
    vec3 aux = texture2D(pack, vUv).rgb;
    float ndl = dot(n, lightDir);
    float lit = clamp((ndl + wrap) / (1.0 + wrap), 0.0, 1.0);
    lit = lit * lit * (3.0 - 2.0 * lit);
    // Sun on the water: a tight glint that only the sea returns.
    vec3 h = normalize(lightDir + v);
    float glint = pow(max(dot(n, h), 0.0), 110.0) * aux.b * lit * 0.22;
    // The cities come up as the day goes; the ground under them stays.
    float dark = 1.0 - smoothstep(0.0, 0.35, lit);
    vec3 color = day * (night + (1.0 - night) * lit) + lightsColor * aux.r * dark * 1.35 + vec3(glint);
    // The limb: sky blue, warmed where the light reaches it.
    float f = pow(1.0 - max(dot(n, v), 0.0), 3.0);
    vec3 limb = mix(atmosphere, atmosphereSun, clamp(ndl * 0.5 + 0.5, 0.0, 1.0));
    color += limb * f * (0.12 + 0.5 * lit);
    gl_FragColor = vec4(color, 1.0);
    #include <colorspace_fragment>
  }
`;
const CLOUD_FRAGMENT = /* glsl */ `
  uniform sampler2D pack;
  uniform vec3 lightDir;
  uniform float wrap;
  uniform float opacity;
  varying vec2 vUv;
  varying vec3 vWorldNormal;
  varying vec3 vWorldPosition;
  void main() {
    vec3 n = normalize(vWorldNormal);
    float cover = texture2D(pack, vUv).g;
    float ndl = dot(n, lightDir);
    float lit = clamp((ndl + wrap) / (1.0 + wrap), 0.0, 1.0);
    lit = lit * lit * (3.0 - 2.0 * lit);
    // Weather reads only in the light; at night it is a faint veil at most.
    vec3 color = vec3(0.92, 0.94, 0.97) * (0.06 + 0.94 * lit);
    gl_FragColor = vec4(color, cover * opacity * (0.15 + 0.85 * lit));
    #include <colorspace_fragment>
  }
`;
const HALO_VERTEX = /* glsl */ `
  varying vec3 vNormal;
  varying vec3 vView;
  varying vec3 vWorldNormal;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vNormal = normalize(normalMatrix * normal);
    vWorldNormal = normalize(mat3(modelMatrix) * normal);
    vView = normalize(-mv.xyz);
    gl_Position = projectionMatrix * mv;
  }
`;
const HALO_FRAGMENT = /* glsl */ `
  uniform vec3 atmosphere;
  uniform vec3 atmosphereSun;
  uniform vec3 lightDir;
  varying vec3 vNormal;
  varying vec3 vView;
  varying vec3 vWorldNormal;
  void main() {
    // Back faces of a shell just outside the globe: the ring between the
    // two limbs, strongest against the planet and gone at the shell's edge.
    float d = dot(normalize(vNormal), normalize(vView));
    float ring = smoothstep(0.0, -0.28, d);
    float ndl = dot(normalize(vWorldNormal), lightDir);
    float sun = clamp(ndl * 0.5 + 0.5, 0.0, 1.0);
    vec3 color = mix(atmosphere, atmosphereSun, sun * 0.5);
    gl_FragColor = vec4(color, ring * ring * (0.1 + 0.45 * sun));
    #include <colorspace_fragment>
  }
`;


export interface EarthOptions {
  /** The day map, by rung: `[phone, desktop]`. */
  day: [string, string];
  /** The packed lights / clouds / water map. */
  pack: string;
  /** `--color-resin`, as hex: the cities' light. */
  resin: string;
  reducedMotion: boolean;
  /** Resolves once the section's entrance has fired (or at once, when there
   *  is no entrance to wait for). Cyprus faces the reader from that moment. */
  entered: Promise<void>;
}

export interface EarthHandle {
  dispose: () => void;
}

export function mountEarth(host: HTMLElement, canvas: HTMLCanvasElement, opts: EarthOptions): EarthHandle {
  const renderer = new WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
    powerPreference: "low-power",
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setClearColor(0x000000, 0);

  const scene = new Scene();
  const camera = new PerspectiveCamera(FOV, 1, 0.1, 20);
  // The sphere's silhouette fills DISC of the frame: its angular radius is
  // asin(1 / d), and the frame's half-height subtends FOV / 2.
  const distance = 1 / Math.sin(Math.atan(DISC * Math.tan((FOV / 2) * DEG)));
  camera.position.set(0, distance * Math.sin(CAMERA_ELEVATION), distance * Math.cos(CAMERA_ELEVATION));
  camera.lookAt(0, 0, 0);
  camera.updateMatrixWorld();

  const lightDir = new Vector3(
    -Math.sin(LIGHT_AZIMUTH) * Math.cos(LIGHT_ELEVATION),
    Math.sin(LIGHT_ELEVATION),
    Math.cos(LIGHT_AZIMUTH) * Math.cos(LIGHT_ELEVATION)
  ).applyQuaternion(camera.quaternion).normalize();

  const resin = hexToLinear(opts.resin);
  const atmosphere = hexToLinear(ATMOSPHERE);
  const atmosphereSun = hexToLinear(ATMOSPHERE_SUN);

  const tilt = new Group();
  tilt.rotation.z = AXIS_TILT;
  const spin = new Group();
  const weather = new Group();
  tilt.add(spin);
  tilt.add(weather);
  scene.add(tilt);

  const makeTexture = () => {
    const t = new Texture();
    t.colorSpace = SRGBColorSpace;
    t.minFilter = LinearMipmapLinearFilter;
    t.anisotropy = Math.min(8, renderer.capabilities.getMaxAnisotropy());
    t.flipY = false;
    return t;
  };
  const dayTexture = makeTexture();
  const packTexture = makeTexture();

  const globeGeometry = new SphereGeometry(1, 128, 96);
  const globeMaterial = new ShaderMaterial({
    uniforms: {
      map: { value: dayTexture },
      pack: { value: packTexture },
      lightDir: { value: lightDir },
      cameraPos: { value: camera.position },
      lightsColor: { value: resin },
      atmosphere: { value: atmosphere },
      atmosphereSun: { value: atmosphereSun },
      wrap: { value: TERMINATOR_WRAP },
      night: { value: NIGHT },
    },
    vertexShader: GLOBE_VERTEX,
    fragmentShader: GLOBE_FRAGMENT,
  });
  const globe = new Mesh(globeGeometry, globeMaterial);
  globe.visible = false;
  spin.add(globe);

  const cloudGeometry = new SphereGeometry(1.006, 96, 64);
  const cloudMaterial = new ShaderMaterial({
    uniforms: {
      pack: { value: packTexture },
      lightDir: { value: lightDir },
      wrap: { value: TERMINATOR_WRAP },
      opacity: { value: 0.55 },
    },
    vertexShader: GLOBE_VERTEX,
    fragmentShader: CLOUD_FRAGMENT,
    transparent: true,
    depthWrite: false,
  });
  const clouds = new Mesh(cloudGeometry, cloudMaterial);
  clouds.visible = false;
  clouds.renderOrder = 1;
  weather.add(clouds);

  const haloGeometry = new SphereGeometry(1 + HALO_THICKNESS, 96, 64);
  const haloMaterial = new ShaderMaterial({
    uniforms: {
      atmosphere: { value: atmosphere },
      atmosphereSun: { value: atmosphereSun },
      lightDir: { value: lightDir },
    },
    vertexShader: HALO_VERTEX,
    fragmentShader: HALO_FRAGMENT,
    transparent: true,
    depthWrite: false,
    side: BackSide,
    blending: NormalBlending,
  });
  const halo = new Mesh(haloGeometry, haloMaterial);
  halo.visible = false;
  halo.renderOrder = 2;
  scene.add(halo);

  const home = toSphere(HOME[0], HOME[1]);

  // The spin that puts Cyprus under the camera: the angle that turns its
  // surface normal, through the tilt, closest to the camera's direction.
  const cameraDir = camera.position.clone().normalize();
  const homeFacing = (() => {
    const q = new Quaternion();
    const tiltQ = new Quaternion().setFromAxisAngle(new Vector3(0, 0, 1), AXIS_TILT);
    const yAxis = new Vector3(0, 1, 0);
    const n = new Vector3();
    let best = 0;
    let bestDot = -Infinity;
    for (let step = 0; step < 720; step += 1) {
      const angle = (step / 720) * 2 * Math.PI;
      q.setFromAxisAngle(yAxis, angle);
      n.copy(home).applyQuaternion(q).applyQuaternion(tiltQ);
      const d = n.dot(cameraDir);
      if (d > bestDot) {
        bestDot = d;
        best = angle;
      }
    }
    return best;
  })();

  let angle = homeFacing;
  let cloudAngle = 0;
  let dragVelocity = 0;
  let dragging = false;
  let lastPointerAt = -Infinity;
  let ready = false;
  let visible = false;
  let raf = 0;
  let lastFrame = 0;
  let discPx = 1;
  let disposed = false;

  const render = (now: number) => {
    spin.rotation.y = angle;
    weather.rotation.y = angle + cloudAngle;
    renderer.render(scene, camera);
  };

  const frame = (now: number) => {
    raf = 0;
    if (disposed || !ready) return;
    const dt = lastFrame ? Math.min(now - lastFrame, 100) : 16.67;
    lastFrame = now;

    if (!opts.reducedMotion) {
      // The auto-spin holds off while the hand is on the globe and for four
      // seconds after it, then comes back over 600 ms rather than in a step.
      const sinceHand = now - lastPointerAt;
      const auto = dragging ? 0 : Math.min(1, Math.max(0, (sinceHand - IDLE_BEFORE_SPIN) / SPIN_RETURN));
      angle += SPIN_RATE * (dt / 1000) * auto;
      cloudAngle += SPIN_RATE * CLOUD_DRIFT * (dt / 1000);
      if (!dragging && Math.abs(dragVelocity) > 1e-5) {
        angle += dragVelocity * (dt / 16.67);
        dragVelocity *= Math.pow(DRAG_DAMPING, dt / 16.67);
      } else if (!dragging) {
        dragVelocity = 0;
      }
    }
    render(now);

    const still = opts.reducedMotion && !dragging && Math.abs(dragVelocity) < 1e-5;
    if (visible && !still) raf = requestAnimationFrame(frame);
  };
  const wake = () => {
    if (!raf && ready && visible && !disposed) {
      lastFrame = 0;
      raf = requestAnimationFrame(frame);
    }
  };

  const resize = () => {
    const size = host.clientWidth;
    if (!size) return;
    renderer.setSize(size, size, false);
    discPx = size * DISC;
    if (ready) render(performance.now());
  };
  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(host);

  // Rendering runs only while the globe is on screen.
  const intersection = new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible) wake();
  });
  intersection.observe(host);

  // Drag turns the globe about its own axis, with the page keeping the
  // vertical: the canvas carries `touch-action: pan-y`, and a touch is only
  // claimed once it has declared itself horizontal. A mouse locks on press.
  let pointerId: number | null = null;
  let lastX = 0;
  let startX = 0;
  let startY = 0;
  let axis: "none" | "drag" | "scroll" = "none";
  const onPointerDown = (event: PointerEvent) => {
    if (!event.isPrimary || pointerId !== null) return;
    pointerId = event.pointerId;
    startX = lastX = event.clientX;
    startY = event.clientY;
    lastPointerAt = performance.now();
    if (event.pointerType === "mouse") {
      axis = "drag";
      dragging = true;
      dragVelocity = 0;
      canvas.setPointerCapture(pointerId);
    } else {
      axis = "none";
    }
  };
  const onPointerMove = (event: PointerEvent) => {
    if (event.pointerId !== pointerId) return;
    if (axis === "none") {
      const dx = event.clientX - startX;
      const dy = event.clientY - startY;
      if (Math.abs(dx) < 6 && Math.abs(dy) < 6) return;
      if (Math.abs(dx) > Math.abs(dy)) {
        axis = "drag";
        dragging = true;
        dragVelocity = 0;
        canvas.setPointerCapture(pointerId);
        lastX = event.clientX;
      } else {
        axis = "scroll";
        pointerId = null;
        return;
      }
    }
    if (axis !== "drag") return;
    const step = ((event.clientX - lastX) * Math.PI) / discPx;
    lastX = event.clientX;
    angle += step;
    dragVelocity = step;
    lastPointerAt = performance.now();
    if (opts.reducedMotion) render(performance.now());
    else wake();
  };
  const onPointerUp = (event: PointerEvent) => {
    if (event.pointerId !== pointerId) return;
    if (axis === "drag" && canvas.hasPointerCapture(event.pointerId)) {
      canvas.releasePointerCapture(event.pointerId);
    }
    pointerId = null;
    dragging = false;
    axis = "none";
    lastPointerAt = performance.now();
    if (opts.reducedMotion) dragVelocity = 0;
    wake();
  };
  canvas.addEventListener("pointerdown", onPointerDown);
  canvas.addEventListener("pointermove", onPointerMove);
  canvas.addEventListener("pointerup", onPointerUp);
  canvas.addEventListener("pointercancel", onPointerUp);

  // Decode off the main thread where the browser allows it.
  const load = async (texture: Texture, src: string) => {
    const response = await fetch(src);
    const blob = await response.blob();
    if (typeof createImageBitmap === "function") {
      texture.image = await createImageBitmap(blob, {
        imageOrientation: "flipY",
        premultiplyAlpha: "none",
        colorSpaceConversion: "none",
      });
    } else {
      const url = URL.createObjectURL(blob);
      const image = new Image();
      await new Promise<void>((resolve, reject) => {
        image.onload = () => resolve();
        image.onerror = () => reject(new Error("earth texture"));
        image.src = url;
      });
      URL.revokeObjectURL(url);
      texture.image = image;
      texture.flipY = true;
    }
    texture.needsUpdate = true;
  };

  // The day map's rung follows the disc's backing size: a phone's 600px
  // canvas sees one hemisphere across ~1000 texels of the 2k map.
  const backing = host.clientWidth * renderer.getPixelRatio();
  const dayRung = backing > 800 ? opts.day[1] : opts.day[0];

  Promise.all([load(dayTexture, dayRung), load(packTexture, opts.pack)])
    .then(() => {
      if (disposed) return;
      globe.visible = true;
      clouds.visible = true;
      halo.visible = true;
      // Shaders compile and the textures upload here, a viewport ahead of
      // the section, so the entrance's first frame costs a draw and nothing else.
      renderer.compile(scene, camera);
      ready = true;
      resize();
      if (opts.reducedMotion) {
        // The Cyprus-facing frame, still.
        render(performance.now());
      } else {
        render(performance.now());
        wake();
      }
      return opts.entered;
    })
    .then(() => {
      if (disposed || opts.reducedMotion) return;
      angle = homeFacing;
      wake();
    })
    .catch(() => {
      // A failed texture leaves the canvas clear: the section as it was.
    });

  return {
    dispose: () => {
      disposed = true;
      if (raf) cancelAnimationFrame(raf);
      resizeObserver.disconnect();
      intersection.disconnect();
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerup", onPointerUp);
      canvas.removeEventListener("pointercancel", onPointerUp);
      globeGeometry.dispose();
      cloudGeometry.dispose();
      haloGeometry.dispose();
      globeMaterial.dispose();
      cloudMaterial.dispose();
      haloMaterial.dispose();
      dayTexture.dispose();
      packTexture.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
    },
  };
}
