"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { heroTrace } from "@/lib/hero-trace";

const LOG_LINES = 200;
const RECENT = 5;
const POLL_MS = 100;

interface TouchLine {
  type: string;
  n: number;
  dy: number | null;
  cancelable: boolean;
  under: string;
}

const describe = (el: Element | null) =>
  el ? `${el.tagName.toLowerCase()}${el.className && typeof el.className === "string" ? "." + el.className.trim().split(/\s+/).slice(0, 3).join(".") : ""}` : "-";

const box: CSSProperties = {
  position: "fixed",
  left: 0,
  bottom: 0,
  zIndex: 2147483647,
  maxWidth: "100vw",
  padding: "6px 8px",
  font: "12px/1.35 ui-monospace, Menlo, monospace",
  color: "#fff",
  background: "rgba(0,0,0,0.72)",
  whiteSpace: "pre-wrap",
  wordBreak: "break-all",
  pointerEvents: "none",
};

export default function HeroDebugPanel() {
  const [, tick] = useState(0);
  const status = useRef<Record<string, unknown> | null>(null);
  const live = useRef({ y: 0, scale: 1, touches: 0 });
  const recent = useRef<TouchLine[]>([]);
  const log = useRef<string[]>([]);
  const last = useRef("");
  const lastY = useRef<number | null>(null);
  const lastUnder = useRef("-");
  const [copied, setCopied] = useState("");

  useEffect(() => {
    const push = (line: string) => {
      const stamped = `${(performance.now() / 1000).toFixed(2)} ${line}`;
      log.current.push(stamped);
      if (log.current.length > LOG_LINES) log.current.splice(0, log.current.length - LOG_LINES);
    };
    const offTrace = heroTrace.listen((line) => {
      last.current = line;
      push(line);
    });
    const onTouch = (e: TouchEvent) => {
      const t = e.touches[0] ?? e.changedTouches[0];
      const y = t ? t.clientY : null;
      const dy = e.type === "touchmove" && y !== null && lastY.current !== null ? y - lastY.current : null;
      lastY.current = e.touches.length ? y : null;
      const under =
        e.type === "touchstart" && t ? describe(document.elementFromPoint(t.clientX, t.clientY)) : "";
      if (under) lastUnder.current = under;
      const row: TouchLine = { type: e.type.slice(5), n: e.touches.length, dy, cancelable: e.cancelable, under };
      recent.current = [...recent.current.slice(1 - RECENT), row];
      live.current.touches = e.touches.length;
      push(
        `${row.type} n=${row.n}${dy !== null ? ` dy=${dy > 0 ? "+" : ""}${dy.toFixed(1)}` : ""} c=${row.cancelable ? 1 : 0} y=${Math.round(window.scrollY)}${under ? ` under=${under}` : ""}`
      );
    };
    const opts = { capture: true, passive: true } as const;
    for (const type of ["touchstart", "touchmove", "touchend", "touchcancel"] as const) {
      window.addEventListener(type, onTouch, opts);
    }
    const id = window.setInterval(() => {
      live.current.y = window.scrollY;
      live.current.scale = window.visualViewport?.scale ?? 1;
      status.current = heroTrace.status();
      tick((n) => n + 1);
    }, POLL_MS);
    return () => {
      offTrace();
      for (const type of ["touchstart", "touchmove", "touchend", "touchcancel"] as const) {
        window.removeEventListener(type, onTouch, opts);
      }
      window.clearInterval(id);
    };
  }, []);

  const copy = async () => {
    const text = log.current.join("\n");
    try {
      await navigator.clipboard.writeText(text);
      setCopied("copied");
    } catch {
      const area = document.createElement("textarea");
      area.value = text;
      document.body.appendChild(area);
      area.select();
      const ok = document.execCommand("copy");
      area.remove();
      setCopied(ok ? "copied" : "copy failed");
    }
    window.setTimeout(() => setCopied(""), 1200);
  };

  const s = status.current;
  const num = (v: unknown) => (typeof v === "number" ? v.toFixed(3) : String(v));
  const lines = [
    `y ${live.current.y.toFixed(2)}  scale ${live.current.scale.toPrecision(9)}  touches ${live.current.touches}  p ${s ? num(s.p) : "-"}  capture ${s ? (s.capture ? "on" : "off") : "-"}`,
    `close: armed ${s ? (s.armed ? "yes" : "no") : "-"}  running ${s ? s.closing : "-"}  reentry ${s ? (s.reentry ? "yes" : "no") : "-"}  pinch ${s ? (s.pinch ? "yes" : "no") : "-"}  up ${s ? num(s.upward) : "-"}`,
    `pull-to-refresh guard: ${s ? (s.guard ? "on" : "off") : "-"}  preventDefault calls: ${s ? String(s.prevented) : "-"}`,
    `scrub ${s ? (s.scrub ? "RUNNING" : "no") : "-"}  stuck-watchdog fired: ${s ? String(s.stuck) : "-"}`,
    `last: ${last.current || "-"}`,
    `touches: ${recent.current
      .map((r) => `${r.type} n${r.n}${r.dy !== null ? ` ${r.dy > 0 ? "+" : ""}${r.dy.toFixed(0)}` : ""} c${r.cancelable ? 1 : 0}`)
      .join(" | ") || "-"}`,
    `under: ${lastUnder.current}`,
  ];

  return (
    <div style={box} aria-hidden="true">
      {lines.join("\n")}
      {"\n"}
      <button
        type="button"
        onClick={copy}
        style={{
          pointerEvents: "auto",
          marginTop: 4,
          padding: "6px 10px",
          font: "inherit",
          color: "#000",
          background: "#fff",
          border: 0,
          borderRadius: 3,
        }}
      >
        {copied || "copy log"}
      </button>
    </div>
  );
}
