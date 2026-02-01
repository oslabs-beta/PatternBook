import {Project, ImportDeclaration, SourceFile} from 'ts-morph';

export interface ComponentGraph {
    [key: string]: string[];
}

//Loop through the project
export function buildProjectGraph(directoryPath: string): ComponentGraph {
    const project: Project = new Project();
    project.addSourceFilesAtPaths(`${directoryPath}/**/*.tsx`);

    const graph: ComponentGraph = {};
    const allFiles: SourceFile[] = project.getSourceFiles();
    allFiles.forEach((file: SourceFile) => {
        const fileName: string = file.getBaseName();
        graph[fileName] = getInternalDependencies(file)
    })
    return graph;
}

export function getInternalDependencies(file: SourceFile): string[] {

    //Get imports
    const imports : ImportDeclaration[] = file.getImportDeclarations();

    //Filtering for internal components
    return imports
        .map(dec  => dec.getModuleSpecifierValue())
        .filter(path => path.startsWith('.') || path.startsWith('@/'));

}

export function getAffectedParents(targetFile: string, graph: ComponentGraph): string[] {
    return Object.keys(graph).filter(parentFile => graph[parentFile].some(childPath => childPath.includes(targetFile))
    );
}