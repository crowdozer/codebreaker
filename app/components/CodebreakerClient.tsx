"use client";

import dynamic from "next/dynamic";

const Codebreaker = dynamic(() => import("./codebreaker"), {
  ssr: false,
  loading: () => (
    <div className="px-1 py-32 text-center text-sm uppercase tracking-[0.12em] text-yellow-300 xl:px-0">
      <p>
        Establishing connection
        <span className="cb-cursor cb-cursor-blink" aria-hidden="true">
          █
        </span>
      </p>
    </div>
  ),
});

export default function CodebreakerClient() {
  return <Codebreaker />;
}
