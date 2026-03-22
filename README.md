### PatternBook

A lightweight zero-config component mapping tool.

Currently being developed...


[patternbook.dev](https://www.patternbook.dev)

#### Quick usage guide for dev env

- do "npm install"
- go to /api and setup your env vars
- start cli tool to generate manifest file
- then use these commands;

RUN services first
```bash
cd services
npm run cli:dev -- generate ./test/fixtures --output ../library-manifest.json
```
OR try
```bash
cd services
npm run cli:dev -- watch ./test/fixtures --output ../library-manifest.json
```
THEN run start api server
```bash
cd api
npm run dev
```
OR
```bash
npm run dev concurrently
```

Now you should be able to see terminal output. 