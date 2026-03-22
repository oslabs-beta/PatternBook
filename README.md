### PatternBook

A lightweight user-friendly component mapping tool.

Currently being developed...


[patternbook.dev](https://www.patternbook.dev)

#### Quick usage guide for dev env

i) go to /api and setup your env vars
ii) start cli tool to generate manifest file

e.g
```bash
npm run cli:dev -- generate ./test/fixtures --output ../library-manifest.json
```
OR try
```bash
npm run cli:dev -- watch ./test/fixtures --output ../library-manifest.json
```
THEN

```bash
npm run dev concurrently
```

Now you should be able to see terminal output. 