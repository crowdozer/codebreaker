# Codebreaker

https://codebreaker-app.vercel.app/

A hacking puzzle game inspired by the Cyberpunk 2077 hacking sequence.

You need to solve for the injection vectors by clicking memory addresses in the correct order. You can complete them in any order you like.

When you complete a vector, it is locked into a success state. If you make an incorrect guess, any partially solved vectors are reset.

The game alternates between moving laterally and moving vertically. Your first move can be anywhere on the top row, the second one must be in the same column, then the same row, then column, and so forth.

If you run out of moves, you're detected and it's game over.

![image](https://github.com/crowdozer/codebreaker/assets/32648607/3f4a7138-90f0-4042-b34d-d4326aad18f9)

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
