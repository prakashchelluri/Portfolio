# Portfolio: Satya Prakash Chelluri

Personal site of a Site Reliability Engineer, built with React, TypeScript, Vite and Tailwind CSS and deployed on Vercel.

The centrepiece is a hands-on pipeline demo (`src/sections/PipelineDemo.tsx`): visitors push a commit through security gates and a GitOps rollout, then kill pods, drain nodes and spike traffic. It runs entirely in the browser.

```sh
npm ci
npm run dev     # http://localhost:5173
npm run build   # outputs to dist/
```
