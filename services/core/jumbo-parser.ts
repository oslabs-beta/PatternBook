import {Project} from "ts-morph";
import * as fs from "fs";

function scanProject(directoryPath: string){
    const project = new Project();

    //robot scans all tsx files in the directory 
    project.addSourceFilesAtPaths(`${directoryPath}/**/*.tsx`);

    const allMetadata: any [] = [];

    //loop through all files found by the robot
    const sourceFiles = project.getSourceFiles();
    sourceFiles.forEach((sourceFile) =>{
        const firstFunction = sourceFile.getFunctions().find(f => f.isExported());

        if (firstFunction){
            const componentData = {
                name: firstFunction.getName(),
                path: sourceFile.getFilePath().split('PatternBook/')[1],
                props: [] as any []
            };
            const firstParam = firstFunction.getParameters()[0];
            if (firstParam){
                const type = firstParam.getType();
                const properties = type.getProperties();

                properties.forEach(prop => {
                    componentData.props.push({
                        name: prop.getName(),
                        type: prop.getTypeAtLocation(firstParam).getText(),
                        isOptional: prop.isOptional()
                    });
                });
            }
            allMetadata.push(componentData);
        }
    });

    //save all metadata to a JSON file 
    fs.writeFileSync("library-metadata.json",JSON.stringify(allMetadata,null,2));
    console.log(`sucess! Scanned ${allMetadata.length} components into library-metadata.json`);
}
//start scanning your src folder !
scanProject("./src");
                   