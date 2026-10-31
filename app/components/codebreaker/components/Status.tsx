import { useMemo } from "react";
import { Button, cn } from "@/app/components/ui";
import { getRandomInt } from "../utils";
import { useGame } from "../useCodebreaker";
import type { GameStatus } from "../types";
import DecodeText from "../fx/DecodeText";
import TypeText from "../fx/TypeText";

export default function Status() {
  const { status } = useGame();

  // pick once per status change; re-rolling on every render would retype
  // the message each time anything else in the game updates
  const message = useMemo(() => getMessage(status), [status]);

  return (
    <div className="space-y-3 p-4">
      {/* Game over banner */}
      {(status === "defeat" || status === "victory") && (
        <p className="cb-display cb-accent-text text-lg lg:text-2xl">
          <DecodeText
            text={status === "defeat" ? "TRACE DETECTED" : "ACCESS GRANTED"}
          />
        </p>
      )}

      <p
        className={cn("text-sm lg:text-base", {
          "text-red-500": status === "defeat",
          "text-green-500": status === "victory",
          "text-yellow-300": status === "working",
        })}
      >
        <span className="text-neutral-500">{"> "}</span>
        <TypeText text={message} />
      </p>

      {/* Defeat Msg */}
      {status === "defeat" && <RestartButton text="TRY AGAIN" />}
      {/* Victory Msg */}
      {status === "victory" && <RestartButton text="PlAY AGAIN" />}
      {/* Working Msg */}
      {status === "working" && <RestartButton text="PULL THE PLUG" />}
      {/* Idle Msg */}
      {status === "idle" && (
        // show an invisible button for maintaining height
        <div className="invisible">
          <Button>no-op</Button>
        </div>
      )}
    </div>
  );
}

function RestartButton(props: { text?: string }) {
  const {
    restart,
    classes: { borderClasses, textClasses },
  } = useGame();

  return (
    <Button
      onClick={restart}
      classes={{
        button: cn(
          "uppercase tracking-[0.12em] hover:bg-neutral-800 active:scale-95",
          borderClasses,
          textClasses,
        ),
      }}
    >
      {props.text || "try again"}
    </Button>
  );
}

const victoryMessages = [
  "Firewall? More like fire-fall! We're in!",
  "Victory! Who's the n00b now?",
  "Pwned! What's next? Cracking the Pentagon?",
  "Mainframe, meet my alter ego: Mainfreak!",
  "Winning never gets old, but that took you long enough!",
  "Aced it! Are you sure you're not undercover NSA?",
  "They should really update their Terms of Service to include 'No Hackers Allowed.' Too late now!",
  "System security just asked me for a dance, and I led the whole way!",
  "Success! You make hacking look so easy, it's almost criminal.",
  "Looks like we've just RSVP'd to the Admin Party, and we didn't even bring a gift!",
];

const defeatMessages = [
  "Oops! Looks like you tripped the alarm. Better luck next life!",
  "Game over! Even my grandma hacks better than that, and she thinks a mouse is a pet!",
  "Failed? You sure you're not working for the antivirus?",
  "Wow, caught already? That was quicker than a Windows update!",
  "So close, yet so far. Need some cheat codes?",
  "You got caught? What's next, forgetting your own password?",
  "Is that all you've got? My toaster could hack better!",
  "Ouch! The firewall sends its regards.",
  "Defeated again? Maybe stick to Minesweeper.",
  "Aw, caught in the act? Even a 404 is less disappointing.",
];

const idleMessages = [
  "Tick-tock! The keyboard's not going to type itself, you know!",
  "So... are we window shopping, or are we going to break the glass?",
  "Hey, we're not here for the screensaver! Let's get cracking!",
  "The firewall's not going to take a coffee break, but we will if you don't get moving!",
  "What are you waiting for? An invitation from the server? Let's go!",
  "If you wait any longer, even the antivirus will get bored!",
  "Don't make me put up an 'Under Construction' GIF — start the hack!",
  "You do know that 'idle hands are the devil's playground,' right? Get to work!",
  "In the time it's taking you to start, I could've solved a CAPTCHA! Twice!",
  "Do you need a 'Ready, Set, Hack!' countdown, or what?",
];

export function getVictoryMessage(): string {
  return victoryMessages[getRandomInt(0, victoryMessages.length - 1)];
}

export function getDefeatMessage(): string {
  return defeatMessages[getRandomInt(0, defeatMessages.length - 1)];
}

export function getIdleMessage(): string {
  return idleMessages[getRandomInt(0, idleMessages.length - 1)];
}

/**
 * The status line for a game status
 */
function getMessage(status: GameStatus): string {
  switch (status) {
    case "defeat":
      return getDefeatMessage();
    case "victory":
      return getVictoryMessage();
    case "working":
      return "HACKING...";
    case "idle":
      return getIdleMessage();
  }
}
