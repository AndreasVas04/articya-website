import {
  BackSide,
  BufferGeometry,
  Float32BufferAttribute,
  Group,
  LinearMipmapLinearFilter,
  Mesh,
  NormalBlending,
  PerspectiveCamera,
  Points,
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
// little faster than the ground, and the atmosphere is a soft blue limb. The
// marks are points of amber light on the countries the projects reach.
//
// Nothing in this file touches the document. It is the scene and nothing
// else - the sphere, the shaders, the loop, the orientation the hand leaves
// behind - and it runs in a Web Worker on every engine that will carry one,
// which is where the cost that made this file worth splitting belongs:
// three.js evaluated, the four programs linked, and the two skins uploaded.
// `earth-scene.ts` is the half that keeps the hand, the box and the page,
// and it drives this one through a command surface narrow enough to cross a
// postMessage. The two halves are the same code either way: the fallback
// runs this file on the main thread and calls the very same methods.

// Cyprus, and the countries the marks stand on, in the order they light.
const HOME: [number, number] = [35.13, 33.43];
const PLACES: [number, number][] = [
  [38.7223, -9.1393], // Portugal
  [40.4168, -3.7038], // Spain
  [41.9028, 12.4964], // Italy
  [37.9838, 23.7275], // Greece
  [52.52, 13.405], // Germany
  [52.2297, 21.0122], // Poland
  [44.4268, 26.1025], // Romania
  [42.6977, 23.3219], // Bulgaria
  [47.4979, 19.0402], // Hungary
  [50.0755, 14.4378], // Czechia
  [48.1486, 17.1077], // Slovakia
  [46.0569, 14.5058], // Slovenia
  [45.815, 15.9819], // Croatia
  [48.2082, 16.3738], // Austria
  [52.3676, 4.9041], // Netherlands
  [50.8503, 4.3517], // Belgium
  [48.8566, 2.3522], // France
  [54.6872, 25.2797], // Lithuania
  [56.9496, 24.1052], // Latvia
  [59.437, 24.7536], // Estonia
];

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
const LIGHT_ELEVATION = 24 * DEG;
const LIGHT_AZIMUTH = 58 * DEG;
// The terminator's softness, and how dark the night side's ground goes.
const TERMINATOR_WRAP = 0.18;
const NIGHT = 0.06;
// The day side, brought down toward the ground the section stands on.
const EXPOSURE = 0.7;
// A little of the sky in the day side: the far things in the photograph
// behind it are cooler and softer than the near ones.
const HAZE = 0.08;
// The atmosphere: sky blue on the limb, warmer where the sun catches it.
const ATMOSPHERE = "#8fbce6";
const ATMOSPHERE_SUN = "#f2d7a8";
const HALO_THICKNESS = 0.1;
// Marks: an amber point with a soft halo, the home point larger and breathing.
const MARK_PX = 15;
const HOME_MARK_PX = 22;
const MARK_STAGGER = 70;
const MARK_FADE = 260;
const MARK_LEAD = 300;
// Drag: inertia damped 0.92 per 60 Hz frame, the spin back 4 s after the hand.
const DRAG_DAMPING = 0.92;
// The globe turns in any direction the hand takes it, but it is a planet and
// not a trackball: the two axes are its own poles and the screen's horizontal,
// so a drag never rolls it. The pitch is clamped short of the pole - past this
// the far pole comes over the top and the axis reads as broken.
const MAX_PITCH = 75 * DEG;
const IDLE_BEFORE_SPIN = 4000;
// How long a page scale has to hold before the drawing buffer is re-cut for it.
const SCALE_SETTLE_MS = 250;
// How long a turning globe may go without a frame before the loop is taken
// to have been lost rather than paused: ten frames at 60Hz, and more than any
// single frame on this page costs.
const STALL_MS = 600;
const SPIN_RETURN = 600;
// The loop's heartbeat, well inside STALL_MS so a running loop is never
// mistaken for a lost one.
const BEAT_MS = 250;

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
  uniform float exposure;
  uniform float haze;
  varying vec2 vUv;
  varying vec3 vWorldNormal;
  varying vec3 vWorldPosition;
  void main() {
    vec3 n = normalize(vWorldNormal);
    vec3 v = normalize(cameraPos - vWorldPosition);
    vec3 day = mix(texture2D(map, vUv).rgb, atmosphere * 0.6, haze) * exposure;
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
    float ring = smoothstep(0.0, -0.42, d);
    float ndl = dot(normalize(vWorldNormal), lightDir);
    float sun = clamp(ndl * 0.5 + 0.5, 0.0, 1.0);
    vec3 color = mix(atmosphere, atmosphereSun, sun * 0.5);
    gl_FragColor = vec4(color, ring * ring * ring * (0.08 + 0.34 * sun));
    #include <colorspace_fragment>
  }
`;
const MARK_VERTEX = /* glsl */ `
  attribute float aSize;
  attribute float aOn;
  uniform float pixelRatio;
  uniform float breath;
  varying float vAlpha;
  varying float vHome;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    vec3 n = normalize(normalMatrix * normal);
    vec3 v = normalize(-mv.xyz);
    // The far side goes out as it turns away: nothing pops at the limb.
    vAlpha = smoothstep(0.0, 0.3, dot(n, v)) * aOn;
    vHome = step(20.0, aSize);
    gl_PointSize = aSize * pixelRatio * (1.0 + vHome * breath);
    gl_Position = projectionMatrix * mv;
  }
`;
const MARK_FRAGMENT = /* glsl */ `
  uniform vec3 color;
  varying float vAlpha;
  varying float vHome;
  void main() {
    float d = length(gl_PointCoord - 0.5) * 2.0;
    // A bright core inside a soft halo.
    float core = 1.0 - smoothstep(0.22, 0.34, d);
    float halo = (1.0 - smoothstep(0.2, 1.0, d)) * 0.5;
    float a = max(core, halo) * vAlpha;
    vec3 c = mix(color, vec3(1.0, 0.93, 0.8), core * 0.45);
    gl_FragColor = vec4(c, a);
    #include <colorspace_fragment>
  }
`;

export interface EarthCoreOptions {
  /** The day map, by rung: `[phone, desktop]`. */
  day: [string, string];
  /** The packed lights / clouds / water map. */
  pack: string;
  /** `--color-resin`, as hex: the marks, and the cities' light. */
  resin: string;
  reducedMotion: boolean;
  /** The box's laid-out width in CSS px, and the ratio to back it at. Both
   *  are the page's to read, so both arrive from the shell. */
  size: number;
  ratio: number;
}

/** What the shell may ask of the scene. Every one of these is a message on
 *  the worker path, so none of them returns anything. */
export interface EarthCore {
  resize: (size: number, ratio: number) => void;
  visible: (on: boolean) => void;
  zoom: (held: boolean) => void;
  /** The section's entrance has fired: Cyprus faces the reader from here and
   *  the marks light from it. */
  enter: () => void;
  dragStart: () => void;
  /** A step of the hand, in CSS px since the last one. */
  drag: (dx: number, dy: number) => void;
  dragEnd: () => void;
  wake: () => void;
  dispose: () => void;
}

type Canvas = HTMLCanvasElement | OffscreenCanvas;

/** `alive` is the loop's heartbeat, at most one a half-second: it is what
 *  lets the watchdog on the other side of the message port tell a loop that
 *  is paused from one that has been lost. */
export function createEarth(canvas: Canvas, opts: EarthCoreOptions, alive?: () => void): EarthCore {
  const renderer = new WebGLRenderer({
    canvas: canvas as HTMLCanvasElement,
    antialias: true,
    alpha: true,
    powerPreference: "low-power",
  });
  renderer.setPixelRatio(opts.ratio);
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
      exposure: { value: EXPOSURE },
      haze: { value: HAZE },
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
      opacity: { value: 0.45 },
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

  // The marks.
  const markCount = PLACES.length + 1;
  const positions = new Float32Array(markCount * 3);
  const normals = new Float32Array(markCount * 3);
  const sizes = new Float32Array(markCount);
  // The attribute owns its array (three copies what it is given), so the
  // per-mark switch is written straight into it.
  const onAttribute = new Float32BufferAttribute(new Float32Array(markCount), 1);
  const on = onAttribute.array as Float32Array;
  const place = (i: number, lat: number, lon: number, px: number) => {
    const p = toSphere(lat, lon);
    normals.set([p.x, p.y, p.z], i * 3);
    p.multiplyScalar(1.008);
    positions.set([p.x, p.y, p.z], i * 3);
    sizes[i] = px;
  };
  place(0, HOME[0], HOME[1], HOME_MARK_PX);
  PLACES.forEach(([lat, lon], i) => place(i + 1, lat, lon, MARK_PX));
  const markGeometry = new BufferGeometry();
  markGeometry.setAttribute("position", new Float32BufferAttribute(positions, 3));
  markGeometry.setAttribute("normal", new Float32BufferAttribute(normals, 3));
  markGeometry.setAttribute("aSize", new Float32BufferAttribute(sizes, 1));
  markGeometry.setAttribute("aOn", onAttribute);
  const markMaterial = new ShaderMaterial({
    uniforms: {
      color: { value: resin },
      pixelRatio: { value: renderer.getPixelRatio() },
      breath: { value: 0 },
    },
    vertexShader: MARK_VERTEX,
    fragmentShader: MARK_FRAGMENT,
    transparent: true,
    depthTest: false,
    depthWrite: false,
  });
  const marks = new Points(markGeometry, markMaterial);
  marks.renderOrder = 3;
  marks.visible = false;
  spin.add(marks);

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

  // The globe's orientation, as two angles rather than a free quaternion. Yaw
  // is about its own polar axis and is unbounded - it is the spin, and the
  // auto-spin adds to it, so the turn always resumes about whatever up-axis the
  // reader has left the planet on rather than snapping back to one. Pitch is
  // about the screen's horizontal, expressed in the tilt group's frame, and is
  // clamped. They compose pitch-after-yaw, so yaw stays the globe's own.
  let angle = homeFacing;
  let pitch = 0;
  let cloudAngle = 0;
  let dragVelocity = 0;
  let pitchVelocity = 0;
  let dragging = false;
  const pitchAxis = new Vector3(1, 0, 0).applyQuaternion(
    new Quaternion().setFromAxisAngle(new Vector3(0, 0, 1), AXIS_TILT).invert()
  );
  const yAxis = new Vector3(0, 1, 0);
  const qYaw = new Quaternion();
  const qPitch = new Quaternion();
  const orient = (target: Group, yaw: number) => {
    qYaw.setFromAxisAngle(yAxis, yaw);
    qPitch.setFromAxisAngle(pitchAxis, pitch);
    target.quaternion.copy(qPitch).multiply(qYaw);
  };

  let lastPointerAt = -Infinity;
  let enteredAt: number | null = null;
  let ready = false;
  let onScreen = false;
  let raf = 0;
  let lastFrame = 0;
  // When a frame last actually landed, for the heartbeat alone. `lastFrame`
  // cannot answer it: it is the frame clock, zeroed on every wake so the first
  // step after a pause is not given the whole pause as its `dt`.
  let aliveAt = performance.now();
  let beatAt = 0;
  let discPx = 1;
  let disposed = false;
  // Set by the shell's page-scale watch: true while the reader holds a pinch.
  let zoomed = false;
  let size = opts.size;
  let ratio = opts.ratio;

  const lightMarks = (now: number) => {
    if (enteredAt === null) return;
    const t = now - enteredAt - MARK_LEAD;
    let changed = false;
    for (let i = 0; i < markCount; i += 1) {
      const local = (t - i * MARK_STAGGER) / MARK_FADE;
      const v = local <= 0 ? 0 : local >= 1 ? 1 : local * local * (3 - 2 * local);
      if (on[i] !== v) {
        on[i] = v;
        changed = true;
      }
    }
    if (changed) onAttribute.needsUpdate = true;
  };
  const marksDone = () =>
    enteredAt !== null && performance.now() - enteredAt > MARK_LEAD + MARK_STAGGER * (markCount - 1) + MARK_FADE;

  const render = (now: number) => {
    orient(spin, angle);
    orient(weather, angle + cloudAngle);
    markMaterial.uniforms.breath.value = opts.reducedMotion ? 0 : 0.12 * (0.5 + 0.5 * Math.sin(now / 900));
    renderer.render(scene, camera);
  };

  const frame = (now: number) => {
    raf = 0;
    if (disposed || !ready || zoomed) return;
    const dt = lastFrame ? Math.min(now - lastFrame, 100) : 16.67;
    lastFrame = now;
    aliveAt = now;
    // The heartbeat. A frame is not worth a message, so it is sent twice a
    // second: often enough for a one-second watchdog, rare enough that the
    // per-frame path stays silent.
    if (alive && now - beatAt > BEAT_MS) {
      beatAt = now;
      alive();
    }

    if (!opts.reducedMotion) {
      // The auto-spin holds off while the hand is on the globe and for four
      // seconds after it, then comes back over 600 ms rather than in a step.
      const sinceHand = now - lastPointerAt;
      const auto = dragging ? 0 : Math.min(1, Math.max(0, (sinceHand - IDLE_BEFORE_SPIN) / SPIN_RETURN));
      angle += SPIN_RATE * (dt / 1000) * auto;
      cloudAngle += SPIN_RATE * CLOUD_DRIFT * (dt / 1000);
      if (!dragging && (Math.abs(dragVelocity) > 1e-5 || Math.abs(pitchVelocity) > 1e-5)) {
        const decay = Math.pow(DRAG_DAMPING, dt / 16.67);
        angle += dragVelocity * (dt / 16.67);
        pitch = Math.min(MAX_PITCH, Math.max(-MAX_PITCH, pitch + pitchVelocity * (dt / 16.67)));
        dragVelocity *= decay;
        pitchVelocity *= decay;
      } else if (!dragging) {
        dragVelocity = 0;
        pitchVelocity = 0;
      }
    }
    lightMarks(now);
    render(now);

    const still = opts.reducedMotion && marksDone() && !dragging && Math.abs(dragVelocity) < 1e-5;
    if (onScreen && !still) raf = requestAnimationFrame(frame);
  };
  const wake = () => {
    if (!raf && ready && onScreen && !disposed && !zoomed) {
      lastFrame = 0;
      aliveAt = performance.now();
      raf = requestAnimationFrame(frame);
    }
  };

  // The box's size is the page's to measure, so it arrives rather than being
  // read. What this must not do is act on a size it already has: `setSize`
  // reallocates the drawing buffer, and a reallocation is the one operation on
  // this canvas that can cost the context. A lost context is a black disc for
  // the rest of the page's life, so the cheapest guard is not to ask.
  //
  // The key is the size and the ratio together, because the ratio moves too:
  // the shell halves it for the length of a pinch.
  let sized = "";
  const resize = (next: number, nextRatio: number) => {
    size = next || size;
    ratio = nextRatio || ratio;
    const key = `${size}@${ratio}`;
    if (!size || key === sized) return;
    sized = key;
    renderer.setPixelRatio(ratio);
    renderer.setSize(size, size, false);
    markMaterial.uniforms.pixelRatio.value = renderer.getPixelRatio();
    discPx = size * DISC;
    if (ready) render(performance.now());
  };

  // And if the context is lost anyway - a background tab reclaimed, memory
  // pressure on a phone - the default is that the canvas stays black forever.
  // Swallowing the loss event is what lets the browser restore it; the restore
  // then re-uploads what the GPU dropped and the disc comes back on its own.
  const onContextLost = (event: Event) => {
    event.preventDefault();
    ready = false;
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
  };
  const onContextRestored = () => {
    sized = "";
    resize(size, ratio);
    dayTexture.needsUpdate = true;
    packTexture.needsUpdate = true;
    renderer.compile(scene, camera);
    ready = true;
    render(performance.now());
    if (!opts.reducedMotion) wake();
  };
  canvas.addEventListener("webglcontextlost", onContextLost);
  canvas.addEventListener("webglcontextrestored", onContextRestored);

  // A pixel of hand is the same angle on both axes: the disc's own radius
  // subtends a quarter turn, so the surface follows it. The shell sends the
  // step rather than the position, because the position is the page's.
  const turn = (dx: number, dy: number) => {
    const stepX = (dx * Math.PI) / discPx;
    const stepY = (dy * Math.PI) / discPx;
    angle += stepX;
    const held = Math.min(MAX_PITCH, Math.max(-MAX_PITCH, pitch + stepY));
    // At the clamp the hand stops carrying pitch, and it must not leave a
    // velocity behind either, or the release would push into the stop.
    pitchVelocity = held - pitch;
    pitch = held;
    dragVelocity = stepX;
    lastPointerAt = performance.now();
    if (opts.reducedMotion) render(performance.now());
    else wake();
  };

  // Decode off the main thread where the browser allows it - and in the
  // worker, off it altogether.
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

  // The section's entrance, whenever it comes: it can arrive before the skins
  // have landed or long after, so it is held rather than awaited in place.
  let fireEntered: () => void = () => {};
  const entered = new Promise<void>((resolve) => {
    fireEntered = resolve;
  });

  // The day map's rung follows the disc's backing size: a phone's 600px
  // canvas sees one hemisphere across ~1000 texels of the 2k map.
  const dayRung = size * ratio > 800 ? opts.day[1] : opts.day[0];

  Promise.all([load(dayTexture, dayRung), load(packTexture, opts.pack)])
    .then(() => {
      if (disposed) return;
      globe.visible = true;
      clouds.visible = true;
      halo.visible = true;
      marks.visible = true;
      // Shaders compile and the textures upload here, which on the worker path
      // is a thread the reader is not using.
      renderer.compile(scene, camera);
      ready = true;
      resize(size, ratio);
      if (opts.reducedMotion) {
        // The Cyprus-facing frame with every mark lit.
        enteredAt = -Infinity;
        on.fill(1);
        onAttribute.needsUpdate = true;
        render(performance.now());
      } else {
        render(performance.now());
        wake();
      }
      return entered;
    })
    .then(() => {
      if (disposed || opts.reducedMotion) return;
      angle = homeFacing;
      enteredAt = performance.now();
      wake();
    })
    .catch(() => {
      // A failed texture leaves the canvas clear: the section as it was.
    });

  return {
    resize,
    visible: (v: boolean) => {
      onScreen = v;
      if (v) wake();
    },
    zoom: (held: boolean) => {
      if (held === zoomed) return;
      zoomed = held;
      if (!zoomed) wake();
    },
    enter: fireEntered,
    dragStart: () => {
      dragging = true;
      dragVelocity = 0;
      pitchVelocity = 0;
    },
    drag: turn,
    dragEnd: () => {
      dragging = false;
      lastPointerAt = performance.now();
      if (opts.reducedMotion) {
        dragVelocity = 0;
        pitchVelocity = 0;
      }
      wake();
    },
    // The watchdog's hand, and the reason it can be trusted from the far side
    // of a message port: every reason this loop has to be stopped is held
    // here, so a loop that is stopped for none of them has been lost by
    // whatever last stood it down. A booking this old is not a frame on its
    // way either, so the id is dropped and `wake` is given something to book.
    wake: () => {
      if (disposed || !ready || !onScreen || zoomed || opts.reducedMotion) return;
      if (performance.now() - aliveAt < STALL_MS) return;
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
      wake();
    },
    dispose: () => {
      disposed = true;
      if (raf) cancelAnimationFrame(raf);
      canvas.removeEventListener("webglcontextlost", onContextLost);
      canvas.removeEventListener("webglcontextrestored", onContextRestored);
      globeGeometry.dispose();
      cloudGeometry.dispose();
      haloGeometry.dispose();
      markGeometry.dispose();
      globeMaterial.dispose();
      cloudMaterial.dispose();
      haloMaterial.dispose();
      markMaterial.dispose();
      dayTexture.dispose();
      packTexture.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
    },
  };
}
