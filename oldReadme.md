# <img src="www/public/logo.svg" alt="Description" width="35" /> PatternBook <img src="www/public/logo.svg" alt="Description" width="35" />

Welcome to <b> PatternBook! </b>

PatternBook is a lightweight zero-config component mapping tool designed to run in the CLI and generate documentation in less than 30 seconds.

<img src="www/public/logo.svg" alt="Description" width="35" /> [patternbook.dev](https://www.patternbook.dev) <img src="www/public/logo.svg" alt="Description" width="35" />

## Setup 
Initial install:

Running the Tool

npx patternbook-cli
npm run generate-graph


Usage guidelines

Links to other documentation that might help (react docs or stack overflow)

Pro Tip: 
 While not a requirement, another great feature is to add a link to a demo of your tool. Easiest way to do this is by publishing a demo on youtube and linking to that youtube video.



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