import { Button, cn } from '@/components/react/ui'
import { getRandomInt } from '@/lib/random-int'
import { useGame } from '../useCodebreaker'

export default function Status() {
	const { status } = useGame()

	return (
		<div className="p-4">
			{/* Defeat Msg */}
			{status === 'defeat' && (
				<div>
					<p className="mb-2 text-red-500">{getDefeatMessage()}</p>
					<RestartButton text="TRY AGAIN" />
				</div>
			)}
			{/* Victory Msg */}
			{status === 'victory' && (
				<div>
					<p className="mb-2 text-green-500">{getVictoryMessage()}</p>
					<RestartButton text="PlAY AGAIN" />
				</div>
			)}
			{/* Working Msg */}
			{status === 'working' && (
				<div>
					<p className="mb-2 text-yellow-300">HACKING...</p>
					<RestartButton text="PULL THE PLUG" />
				</div>
			)}
			{/* Idle Msg */}
			{status === 'idle' && (
				<div>
					<p>{getIdleMessage()}</p>
					{/* show an invisible button for maintaining height */}
					<div className="invisible">
						<Button>no-op</Button>
					</div>
				</div>
			)}
		</div>
	)
}

function RestartButton(props: { text?: string }) {
	const {
		restart,
		classes: { borderClasses, textClasses },
	} = useGame()

	return (
		<Button
			onClick={restart}
			classes={{ button: cn(borderClasses, textClasses) }}
		>
			{props.text || 'try again'}
		</Button>
	)
}

const victoryMessages = [
	"Firewall? More like fire-fall! We're in!",
	"I've got root access, and suddenly, I'm in the mood for a root beer!",
	"Password? You mean 'pass-sword,' because we just cut right through it!",
	'Mainframe, meet my alter ego: Mainfreak!',
	"Looks like we've just RSVP'd to the Admin Party, and we didn't even bring a gift!",
	"The only thing more secure than this system is my grandma's cookie jar—and I cracked that when I was five!",
	'Ah, the sound of bypassing security. Music to my ears!',
	"They should really update their Terms of Service to include 'No Hackers Allowed.' Too late now!",
	'System security just asked me for a dance, and I led the whole way!',
]

const defeatMessages = [
	'Oops, looks like we just got the VIP backstage pass to the Firewall Concert!',
	"Ah, we've been caught! Someone call the Internet police!",
	'Red alert! Red alert! Abandon ship! Or, you know, just close the browser.',
	"Well, well, well, if it isn't Captain Obvious saying we've been detected!",
	'Busted? Time for Operation Ghost Protocol: minimize window and act natural.',
	"Ah, they've detected us! Time to switch from hacking to snacking.",
	'Intrusion detected? More like invitation declined!',
	"We've got company, and I don't think they're here to deliver pizza.",
	"It's not a bug, it's a feature! A feature that tells them we're here, unfortunately.",
	'Whoa, we tripped the alarm! Do we get a prize?',
]

const idleMessages = [
	"Tick-tock! The keyboard's not going to type itself, you know!",
	'So... are we window shopping, or are we going to break the glass?',
	"Hey, we're not here for the screensaver! Let's get cracking!",
	"The firewall's not going to take a coffee break, but we will if you don't get moving!",
	"What are you waiting for? An invitation from the server? Let's go!",
	'If you wait any longer, even the antivirus will get bored!',
	"Don't make me put up an 'Under Construction' GIF — start the hack!",
	"You do know that 'idle hands are the devil's playground,' right? Get to work!",
	"In the time it's taking you to start, I could've solved a CAPTCHA! Twice!",
	"Do you need a 'Ready, Set, Hack!' countdown, or what?",
]

export function getVictoryMessage(): string {
	return victoryMessages[getRandomInt(0, victoryMessages.length - 1)]
}

export function getDefeatMessage(): string {
	return defeatMessages[getRandomInt(0, defeatMessages.length - 1)]
}

export function getIdleMessage(): string {
	return idleMessages[getRandomInt(0, idleMessages.length - 1)]
}
