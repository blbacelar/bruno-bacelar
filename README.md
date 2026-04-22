# Bruno Bacelar — Portfolio

Personal portfolio site built with Three.js, deployed as a static site on Vercel.

**Live:** https://portifolio-five-kappa-45.vercel.app

## Structure

```
Bruno Bacelar Portfolio _standalone_.html   ← source file
profile.jpg                                 ← portrait image
deploy/
  index.html        ← served by Vercel (copy of standalone)
  profile.jpg
  vercel.json       ← static site config
```

## Deploying

```bash
cd deploy
vercel --prod
```

## Tech

- [Three.js](https://threejs.org/) — animated background
- [Vercel](https://vercel.com/) — hosting
