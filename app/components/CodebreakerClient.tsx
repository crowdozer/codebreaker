"use client";

import dynamic from "next/dynamic";

const Codebreaker = dynamic(() => import("./codebreaker"), {
  ssr: false,
  loading: () => (
    <div className="px-1 py-32 text-center xl:px-0" data-status="working">
      <h1
        className="cb-glitch cb-neon-text text-yellow-300"
        data-text="Establishing connection..."
      >
        Establishing connection...
      </h1>
    </div>
  ),
});

export default function CodebreakerClient() {
  return <Codebreaker />;
}
