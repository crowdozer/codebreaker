"use client";

import { cn } from "@/app/components/ui";

import { useCodebreaker, GameContext } from "./useCodebreaker";
import type { GameStatus } from "./types";
import Sequences from "./components/Sequences";
import Status from "./components/Status";
import Buffer from "./components/Buffer";
import FAQ from "./components/FAQ";
import GameBoard from "./components/GameBoard";
import Timer from "./components/Timer";
import BackgroundTerminals from "./fx/BackgroundTerminals";
import DataStream from "./fx/DataStream";
import DecodeText from "./fx/DecodeText";
import { HoverProvider } from "./fx/hover";
import Panel from "./fx/Panel";
import SysLog from "./fx/SysLog";
import TypeText from "./fx/TypeText";

// Title-bar readout for each game status
const STATUS_LABELS: Record<GameStatus, string> = {
  idle: "STANDBY",
  working: "BREACH IN PROGRESS",
  victory: "ACCESS GRANTED",
  defeat: "TRACE DETECTED",
};

export default function Codebreaker() {
  const api = useCodebreaker();
  const { status } = api;

  return (
    <GameContext.Provider value={api}>
      {/* data-status drives --accent for every cb-* fx class below */}
      <div data-status={status} className="flex grow flex-col">
        <BackgroundTerminals key={api.generation} />

        <div className="mx-auto w-full px-1 py-1 xl:w-[80%] xl:px-0 xl:py-8">
          {/* OS WINDOW */}
          <div
            className={cn(
              "cb-frame border border-neutral-600",
              status === "defeat" && "cb-shake",
            )}
          >
            {/* status strip */}
            <div className="cb-accent-bg h-1" />

            {/* TITLE BAR */}
            <header className="flex flex-wrap items-center justify-between gap-x-6 gap-y-1 border-b border-neutral-600 px-4 py-3">
              <h1 className="text-xl md:text-4xl">
                <TypeText text="CODEBREAKER" msPerChar={70} delay={150} />
              </h1>
              <p className="text-xs uppercase tracking-[0.12em] text-neutral-500 lg:text-sm">
                {"sys // "}
                <DecodeText
                  text={STATUS_LABELS[status]}
                  className="cb-accent-text"
                />
              </p>
            </header>

            <HoverProvider>
              <div className="grid grid-cols-1 gap-3 p-3 xl:grid-cols-[2fr_3fr] xl:gap-4 xl:p-4">
                {/* TIMER */}
                <Panel index="01" label="BREACH TIME" order={0}>
                  <Timer />
                </Panel>

                {/* DETECTION */}
                <Panel index="02" label="BUFFER" order={1}>
                  <Buffer />
                </Panel>

                {/* CODE MATRIX */}
                <Panel index="03" label="CODE MATRIX" variant="filled" order={2}>
                  <GameBoard />
                </Panel>

                {/* OBJECTIVES + LOG */}
                <div className="grid grid-cols-1 gap-3 xl:grid-cols-[auto_1fr] xl:gap-4">
                  <Panel
                    index="04"
                    label="INJECTION VECTORS"
                    order={3}
                    className="self-start"
                    bodyClassName="p-3"
                  >
                    <Sequences />
                  </Panel>

                  {/* absolute on xl so the log fills the row without growing it */}
                  <div
                    className="cb-boot relative hidden h-48 lg:block xl:h-auto"
                    style={{ animationDelay: "360ms" }}
                  >
                    <SysLog className="absolute inset-0" />
                  </div>
                </div>
              </div>
            </HoverProvider>

            {/* GAME STATUS */}
            <div className="px-3 pb-3 xl:px-4 xl:pb-4">
              <Panel index="05" label="STATUS" variant="filled" order={5}>
                <Status />
              </Panel>
            </div>

            {/* DATA STREAM */}
            <footer className="flex items-center gap-4 border-t border-neutral-600 px-4 py-2 text-xs uppercase tracking-[0.12em] text-neutral-500">
              <span className="shrink-0">data //</span>
              <DataStream className="min-w-0 grow overflow-hidden text-neutral-600" />
            </footer>
          </div>

          <div className="mx-auto my-2 max-w-4xl xl:my-8">
            <FAQ solution={api.solution} />
          </div>
        </div>
      </div>
    </GameContext.Provider>
  );
}
