import {Project } from "ts-morph";
import * as fs from "fs";

function getComponentName(filePath: string){
    // creating a new ts-morph project robot
    const project = new Project();
    // give the robot the file to work on
    const sourceFile = project.addSourceFileAtPath(filePath);
    // try to find the first exported function in the file
    const firstFunction = sourceFile.getFunctions().find(f=>f.isExported());
    // if we found it, return its name!
    if (firstFunction){
        const componentData = {
            name : firstFunction.getName(),
            props : [] as any[]};
        
        console.log("--- Component Found ---");
        console.log("Name", firstFunction.getName());

        // get the first parameter (the "props" object)
        const firstParam = firstFunction.getParameters()[0];
        if(firstParam){
            console.log("\n--- Props Found ---");
            // get the "Type" of that parameter 
            const type = firstParam.getType();
            // get all individual properties (label, disabled, count)
            const properties = type.getProperties();

            properties.forEach(prop => {
                componentData.props.push({
                    name : prop.getName(),
                    type : prop.getTypeAtLocation(firstParam).getText(),
                    isOptional : prop.isOptional()
                });
            });
        }
    
//--- New : save the data to a JSON file ---
    fs.writeFileSync("metadata.json", JSON.stringify(componentData, null,2));
    console.log("sucesss! Created metadata.json");
    }
}

//Run it ! (replace 'Button.tsx' with your actual file path)
    getComponentName("./src/TestButton.tsx");