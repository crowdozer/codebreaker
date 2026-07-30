# Codebreaker

https://codebreaker-app.vercel.app/

A hacking puzzle game inspired by the Cyberpunk 2077 hacking sequence.

You need to solve for the injection vectors by clicking memory addresses in the correct order. You can complete them in any order you like.

When you complete a vector, it is locked into a success state. If you make an incorrect guess, any partially solved vectors are reset.

The game alternates between moving laterally and moving vertically. Your first move can be anywhere on the top row, the second one must be in the same column, then the same row, then column, and so forth.

If you run out of moves, you're detected and it's game over.

![image](https://github.com/crowdozer/codebreaker/assets/32648607/3f4a7138-90f0-4042-b34d-d4326aad18f9)

Built with [Next.js](https://nextjs.org) (App Router). Local webfonts live under `public/fonts/`.

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Edit `app/page.tsx` and game code under `app/components/codebreaker/` — the page hot-reloads as you save.

## Scripts

```bash
npm run dev    # development server
npm run build  # production build
npm run start  # serve production build
npm run lint   # ESLint
```

## Deploy

Deploy on [Vercel](https://vercel.com) or any Node host that supports Next.js.
