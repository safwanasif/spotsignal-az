import { useEffect, useRef } from "react";

interface CalmFluidCanvasProps {
  className?: string;
}

type Gl = WebGLRenderingContext;

const vertexShaderSource = `
attribute vec2 a_position;
varying vec2 v_uv;

void main () {
  v_uv = a_position * 0.5 + 0.5;
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

const updateShaderSource = `
precision mediump float;

varying vec2 v_uv;
uniform sampler2D u_texture;
uniform vec2 u_resolution;
uniform vec2 u_point;
uniform vec2 u_delta;
uniform float u_has_point;
uniform float u_time;

vec3 palette (float t) {
  vec3 seaGlass = vec3(0.42, 0.78, 0.72);
  vec3 blueMist = vec3(0.58, 0.78, 0.86);
  vec3 sage = vec3(0.62, 0.75, 0.58);
  vec3 softGold = vec3(0.93, 0.80, 0.52);
  vec3 milk = vec3(0.92, 0.98, 0.96);
  vec3 water = mix(seaGlass, blueMist, 0.5 + 0.5 * sin(t * 0.8));
  vec3 earth = mix(sage, softGold, 0.5 + 0.5 * cos(t * 0.7));
  return mix(mix(water, earth, 0.24), milk, 0.18);
}

void main () {
  vec2 px = 1.0 / u_resolution;
  vec2 uv = v_uv;
  vec2 center = vec2(0.5);
  vec2 idle = vec2(
    0.5 + sin(u_time * 0.37) * 0.18,
    0.52 + cos(u_time * 0.31) * 0.13
  );
  vec2 point = mix(idle, u_point, u_has_point);
  vec2 delta = mix(vec2(cos(u_time * 0.4), sin(u_time * 0.32)) * 0.012, u_delta, u_has_point);
  vec2 toPoint = uv - point;
  float dist = length(toPoint);
  float influence = exp(-dist * dist * 28.0);
  vec2 swirl = vec2(-toPoint.y, toPoint.x) * influence * 0.026;
  vec2 pull = delta * influence * 0.62;
  vec2 drift = vec2(
    sin((uv.y + u_time * 0.04) * 12.0),
    cos((uv.x - u_time * 0.035) * 10.0)
  ) * 0.0015;
  vec2 sampleUv = uv - swirl - pull + drift;

  vec4 color = texture2D(u_texture, sampleUv) * 0.986;
  vec3 splatColor = palette(u_time * 0.7 + point.x * 2.0 + point.y);
  float splat = smoothstep(0.26, 0.0, dist) * (0.18 + u_has_point * 0.34);
  color.rgb += splatColor * splat;

  vec4 blur = vec4(0.0);
  blur += texture2D(u_texture, uv + vec2(px.x, 0.0));
  blur += texture2D(u_texture, uv - vec2(px.x, 0.0));
  blur += texture2D(u_texture, uv + vec2(0.0, px.y));
  blur += texture2D(u_texture, uv - vec2(0.0, px.y));
  color.rgb = mix(color.rgb, blur.rgb * 0.25, 0.08);

  float edgeFade = smoothstep(0.0, 0.12, uv.x) *
    smoothstep(0.0, 0.12, uv.y) *
    smoothstep(0.0, 0.12, 1.0 - uv.x) *
    smoothstep(0.0, 0.12, 1.0 - uv.y);
  float centerGlow = 1.0 - smoothstep(0.2, 0.92, distance(uv, center));

  vec3 calmBase = vec3(0.90, 0.98, 0.95);
  vec3 softened = mix(calmBase, color.rgb + centerGlow * vec3(0.08, 0.12, 0.10), max(edgeFade, 0.44));
  gl_FragColor = vec4(softened, 1.0);
}
`;

const displayShaderSource = `
precision mediump float;

varying vec2 v_uv;
uniform sampler2D u_texture;

void main () {
  vec3 color = texture2D(u_texture, v_uv).rgb;
  float vignette = smoothstep(0.92, 0.18, distance(v_uv, vec2(0.5)));
  vec3 base = vec3(0.955, 0.985, 0.975);
  vec3 mixed = mix(base, color, 0.78);
  gl_FragColor = vec4(clamp(mixed * (0.94 + vignette * 0.08), 0.0, 1.0), 0.95);
}
`;

function compileShader(gl: Gl, type: number, source: string): WebGLShader {
  const shader = gl.createShader(type);
  if (!shader) throw new Error("Unable to create WebGL shader");
  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const error = gl.getShaderInfoLog(shader) ?? "Unknown shader error";
    gl.deleteShader(shader);
    throw new Error(error);
  }

  return shader;
}

function createProgram(gl: Gl, fragmentSource: string): WebGLProgram {
  const vertexShader = compileShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
  const fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, fragmentSource);
  const program = gl.createProgram();
  if (!program) throw new Error("Unable to create WebGL program");

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  gl.deleteShader(vertexShader);
  gl.deleteShader(fragmentShader);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const error = gl.getProgramInfoLog(program) ?? "Unknown WebGL program error";
    gl.deleteProgram(program);
    throw new Error(error);
  }

  return program;
}

function createTexture(gl: Gl, width: number, height: number): WebGLTexture {
  const texture = gl.createTexture();
  if (!texture) throw new Error("Unable to create WebGL texture");

  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    gl.RGBA,
    width,
    height,
    0,
    gl.RGBA,
    gl.UNSIGNED_BYTE,
    null
  );

  return texture;
}

function createFramebuffer(gl: Gl, texture: WebGLTexture): WebGLFramebuffer {
  const framebuffer = gl.createFramebuffer();
  if (!framebuffer) throw new Error("Unable to create WebGL framebuffer");

  gl.bindFramebuffer(gl.FRAMEBUFFER, framebuffer);
  gl.framebufferTexture2D(
    gl.FRAMEBUFFER,
    gl.COLOR_ATTACHMENT0,
    gl.TEXTURE_2D,
    texture,
    0
  );

  return framebuffer;
}

export function CalmFluidCanvas({ className }: CalmFluidCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const gl = canvas.getContext("webgl", {
      alpha: true,
      antialias: false,
      depth: false,
      preserveDrawingBuffer: false,
      stencil: false
    });

    if (!gl) return;

    const canvasElement = canvas;
    const webgl = gl;
    const updateProgram = createProgram(webgl, updateShaderSource);
    const displayProgram = createProgram(webgl, displayShaderSource);
    const quad = webgl.createBuffer();
    if (!quad) return;

    webgl.bindBuffer(webgl.ARRAY_BUFFER, quad);
    webgl.bufferData(
      webgl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      webgl.STATIC_DRAW
    );

    let width = 1;
    let height = 1;
    let frame = 0;
    let sourceTexture = createTexture(webgl, width, height);
    let targetTexture = createTexture(webgl, width, height);
    let sourceFramebuffer = createFramebuffer(webgl, sourceTexture);
    let targetFramebuffer = createFramebuffer(webgl, targetTexture);
    let pointerX = 0.5;
    let pointerY = 0.5;
    let deltaX = 0;
    let deltaY = 0;
    let lastX = 0;
    let lastY = 0;
    let hasPointer = false;
    let pointerFresh = 0;
    let animationFrame = 0;

    const updateLocations = {
      position: webgl.getAttribLocation(updateProgram, "a_position"),
      texture: webgl.getUniformLocation(updateProgram, "u_texture"),
      resolution: webgl.getUniformLocation(updateProgram, "u_resolution"),
      point: webgl.getUniformLocation(updateProgram, "u_point"),
      delta: webgl.getUniformLocation(updateProgram, "u_delta"),
      hasPoint: webgl.getUniformLocation(updateProgram, "u_has_point"),
      time: webgl.getUniformLocation(updateProgram, "u_time")
    };
    const displayLocations = {
      position: webgl.getAttribLocation(displayProgram, "a_position"),
      texture: webgl.getUniformLocation(displayProgram, "u_texture")
    };

    function configureProgram(program: WebGLProgram, positionLocation: number) {
      webgl.useProgram(program);
      webgl.bindBuffer(webgl.ARRAY_BUFFER, quad);
      webgl.enableVertexAttribArray(positionLocation);
      webgl.vertexAttribPointer(positionLocation, 2, webgl.FLOAT, false, 0, 0);
    }

    function resize() {
      const rect = canvasElement.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const nextWidth = Math.max(8, Math.floor(rect.width * dpr * 0.7));
      const nextHeight = Math.max(8, Math.floor(rect.height * dpr * 0.7));

      canvasElement.width = Math.max(8, Math.floor(rect.width * dpr));
      canvasElement.height = Math.max(8, Math.floor(rect.height * dpr));

      if (nextWidth === width && nextHeight === height) return;

      width = nextWidth;
      height = nextHeight;
      webgl.deleteTexture(sourceTexture);
      webgl.deleteTexture(targetTexture);
      webgl.deleteFramebuffer(sourceFramebuffer);
      webgl.deleteFramebuffer(targetFramebuffer);
      sourceTexture = createTexture(webgl, width, height);
      targetTexture = createTexture(webgl, width, height);
      sourceFramebuffer = createFramebuffer(webgl, sourceTexture);
      targetFramebuffer = createFramebuffer(webgl, targetTexture);
    }

    function draw() {
      frame += 1;
      pointerFresh = Math.max(0, pointerFresh - 0.018);
      deltaX *= 0.88;
      deltaY *= 0.88;

      webgl.viewport(0, 0, width, height);
      webgl.bindFramebuffer(webgl.FRAMEBUFFER, targetFramebuffer);
      configureProgram(updateProgram, updateLocations.position);
      webgl.activeTexture(webgl.TEXTURE0);
      webgl.bindTexture(webgl.TEXTURE_2D, sourceTexture);
      webgl.uniform1i(updateLocations.texture, 0);
      webgl.uniform2f(updateLocations.resolution, width, height);
      webgl.uniform2f(updateLocations.point, pointerX, pointerY);
      webgl.uniform2f(updateLocations.delta, deltaX, deltaY);
      webgl.uniform1f(updateLocations.hasPoint, pointerFresh);
      webgl.uniform1f(updateLocations.time, frame * 0.016);
      webgl.drawArrays(webgl.TRIANGLES, 0, 6);

      [sourceTexture, targetTexture] = [targetTexture, sourceTexture];
      [sourceFramebuffer, targetFramebuffer] = [targetFramebuffer, sourceFramebuffer];

      webgl.viewport(0, 0, canvasElement.width, canvasElement.height);
      webgl.bindFramebuffer(webgl.FRAMEBUFFER, null);
      configureProgram(displayProgram, displayLocations.position);
      webgl.activeTexture(webgl.TEXTURE0);
      webgl.bindTexture(webgl.TEXTURE_2D, sourceTexture);
      webgl.uniform1i(displayLocations.texture, 0);
      webgl.drawArrays(webgl.TRIANGLES, 0, 6);

      animationFrame = window.requestAnimationFrame(draw);
    }

    function updatePointer(event: PointerEvent) {
      const rect = canvasElement.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = 1 - (event.clientY - rect.top) / rect.height;
      deltaX = hasPointer ? x - lastX : 0;
      deltaY = hasPointer ? y - lastY : 0;
      pointerX = x;
      pointerY = y;
      lastX = x;
      lastY = y;
      hasPointer = true;
      pointerFresh = 1;
    }

    function resetPointer() {
      hasPointer = false;
      pointerFresh = 0;
    }

    resize();
    draw();

    window.addEventListener("resize", resize);
    canvasElement.addEventListener("pointermove", updatePointer);
    canvasElement.addEventListener("pointerdown", updatePointer);
    canvasElement.addEventListener("pointerleave", resetPointer);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("resize", resize);
      canvasElement.removeEventListener("pointermove", updatePointer);
      canvasElement.removeEventListener("pointerdown", updatePointer);
      canvasElement.removeEventListener("pointerleave", resetPointer);
      webgl.deleteProgram(updateProgram);
      webgl.deleteProgram(displayProgram);
      webgl.deleteBuffer(quad);
      webgl.deleteTexture(sourceTexture);
      webgl.deleteTexture(targetTexture);
      webgl.deleteFramebuffer(sourceFramebuffer);
      webgl.deleteFramebuffer(targetFramebuffer);
    };
  }, []);

  return <canvas ref={canvasRef} className={className} aria-hidden="true" />;
}
