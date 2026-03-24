# PatternBook  
<img src="www/public/logo.svg" alt="Description" width="50" />  Welcome to PatternBook!  <img src="www/public/logo.svg" alt="Description" width="50" /> 

PatternBook is a lightweight zero-config component mapping tool you can type into your CLI and generate documentation in less than 30 seconds.

Currently there exist very few developer tools for quick and easy documentation.  Most of the options that are available take time to install and use. They are also typically more than most teams actually need.  
PatternBook is a straightforward answer to this issue, providing clear documentation in under 30 seconds with zero-config. 


<img src="www/public/logo.svg" alt="Description" width="35" /> [patternbook.dev](https://www.patternbook.dev) <img src="www/public/logo.svg" alt="Description" width="35" />

## Setup 
Initial install:

Running the Tool

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