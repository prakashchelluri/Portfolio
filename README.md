# Portfolio: Satya Prakash Chelluri

Personal site of a Site Reliability Engineer, built with React, TypeScript, Vite and Tailwind CSS and deployed on Vercel.

The centrepiece is an incident demo (`src/sections/IncidentDemo.tsx`): visitors pick a real-world problem (buggy update, server crash, traffic rush, leaked password, mystery slowdown) and watch it hit the same store with and without SRE safeguards, in plain English with an optional engineer view. It runs entirely in the browser.

```sh
npm ci
npm run dev     # http://localhost:5173
npm run build   # outputs to dist/
```
