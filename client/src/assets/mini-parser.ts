import {Project } from "ts-morph";

function getComponentName(filePath: string){
    // creating a new ts-morph project robot
    const project = new Project();
    // give the robot the file to work on
    const sourceFile = project.addSourceFileAtPath(filePath);
    // try to find the first exported function in the file
    const firstFunction = sourceFile.getFunctions().find(f=>f.isExported());
    // if we found it, return its name!
    if (firstFunction){
        console.log('Found a component named:", firstFunction.getName());
        }else{
            console.log("I couldn't find a standard exported funstion in this file.");
        }
    }
    //Run it ! (replace 'Button.tsx' with your actual file path)
    getComponentName("./TestComponent.tsx");
    