"use client";

import { useEffect, useRef, useState } from "react";

/* A slow liquid-metal glow rendered on the GPU. Two triangles and one fragment
   shader — no three.js, no ogl, nothing added to the bundle beyond this file.

   It only ever runs when it is on screen, on a pointer device, with motion
   allowed. Everything else gets the CSS gradient that sits underneath. */

const VERT = `
attribute vec2 p;
void main() { gl_Position = vec4(p, 0.0, 1.0); }
`;

const FRAG = `
precision highp float;
uniform vec2  u_res;
uniform float u_time;
uniform vec3  u_accent;
uniform float u_dark;

// value noise + fbm, the cheapest way to get organic movement
float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

float noise(vec2 p) {
  vec2 i = floor(p), f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x), u.y);
}

float fbm(vec2 p) {
  float v = 0.0, a = 0.5;
  for (int i = 0; i < 5; i++) { v += a * noise(p); p *= 2.02; a *= 0.5; }
  return v;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_res;
  vec2 st = uv * vec2(u_res.x / u_res.y, 1.0);
  float t = u_time * 0.06;

  // domain warping: noise displaced by noise, which is what makes it read as
  // liquid rather than as scrolling clouds
  vec2 q = vec2(fbm(st + t), fbm(st + vec2(5.2, 1.3) - t));
  vec2 r = vec2(fbm(st + 4.0 * q + vec2(1.7, 9.2) + t * 0.6),
                fbm(st + 4.0 * q + vec2(8.3, 2.8) - t * 0.4));
  float f = fbm(st + 4.0 * r);

  float body = smoothstep(0.32, 0.92, f);
  vec3 warm = mix(u_accent * 0.55, u_accent, body);
  vec3 col = mix(vec3(0.0), warm, body);

  // fade to nothing at the edges so the canvas never shows a hard border
  float vign = smoothstep(1.05, 0.25, length(uv - 0.5) * 1.6);
  float alpha = body * vign * mix(0.55, 0.85, u_dark);

  gl_FragColor = vec4(col, alpha);
}
`;

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const sh = gl.createShader(type)!;
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  return gl.getShaderParameter(sh, gl.COMPILE_STATUS) ? sh : null;
}

function readAccent(): [number, number, number] {
  const raw = getComputedStyle(document.documentElement).getPropertyValue("--c-accent").trim();
  const m = raw.match(/^#?([0-9a-f]{6})$/i);
  if (!m) return [1, 0.45, 0.16];
  const int = parseInt(m[1], 16);
  return [((int >> 16) & 255) / 255, ((int >> 8) & 255) / 255, (int & 255) / 255];
}

export function ShaderGlow({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  const [live, setLive] = useState(false);

  useEffect(() => {
    const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = window.matchMedia("(pointer: fine)").matches;
    setLive(!calm && fine);
  }, []);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas || !live) return;

    const gl = canvas.getContext("webgl", { alpha: true, antialias: false, premultipliedAlpha: false });
    if (!gl) return;

    const vs = compile(gl, gl.VERTEX_SHADER, VERT);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    if (!vs || !fs) return;

    const prog = gl.createProgram()!;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    gl.useProgram(prog);

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, "p");
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

    const uRes = gl.getUniformLocation(prog, "u_res");
    const uTime = gl.getUniformLocation(prog, "u_time");
    const uAccent = gl.getUniformLocation(prog, "u_accent");
    const uDark = gl.getUniformLocation(prog, "u_dark");

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const w = Math.round(canvas.clientWidth * dpr);
      const h = Math.round(canvas.clientHeight * dpr);
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
        gl.viewport(0, 0, w, h);
      }
      gl.uniform2f(uRes, canvas.width, canvas.height);
    };

    let raf = 0;
    let visible = true;
    const start = performance.now();

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (!visible) return;
      resize();
      gl.uniform1f(uTime, (now - start) / 1000);
      gl.uniform3fv(uAccent, readAccent());
      gl.uniform1f(uDark, document.documentElement.dataset.theme === "dark" ? 1 : 0);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    };
    raf = requestAnimationFrame(frame);

    // off-screen means no GPU work at all
    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting), { threshold: 0.01 });
    io.observe(canvas);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, [live]);

  return (
    <div aria-hidden="true" className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      {/* the still fallback: what phones, crawlers and reduced-motion get */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 60% 55% at 50% 45%, color-mix(in srgb, var(--c-accent) 22%, transparent), transparent 70%)",
        }}
      />
      {live && <canvas ref={ref} className="absolute inset-0 h-full w-full" />}
    </div>
  );
}
