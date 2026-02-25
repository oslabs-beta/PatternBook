import * as fs from 'node:fs';
import * as path from 'node:path';

export interface GraphData {
    name: string; // e.g., 'DEPENDENCY_GRAPH'
    title: string; // e.g., 'Dependency Graph'
    content: string; // Mermaid code
}

export class Exporter {
    static updateReadme(directory: string, graphs: GraphData[]): void {
        const readmePath = path.join(directory, 'README.md');

        if (!fs.existsSync(readmePath)) {
            console.warn(`README.md not found in ${directory}`);
            return;
        }

        let readmeContent = fs.readFileSync(readmePath, 'utf8');
        let hasUpdates = false;

        graphs.forEach(graph => {
            const startMarker = `<!-- ${graph.name}-START -->`;
            const endMarker = `<!-- ${graph.name}-END -->`;
            const mermaidBlock = `\n\`\`\`mermaid\n${graph.content.trim()}\n\`\`\`\n`;
            
            const sectionContent = `${startMarker}\n#### ${graph.title}\n${mermaidBlock}${endMarker}`;

            // Regex to find existing block
            const regex = new RegExp(`${startMarker}[\\s\\S]*?${endMarker}`, 'g');
            
            if (regex.test(readmeContent)) {
                // Replace existing block
                readmeContent = readmeContent.replace(regex, sectionContent);
                hasUpdates = true;
            } else {
                // Append to end if not found
                // Check if we can replace an old image link first (backward compatibility)
                const imageLinkRegex = new RegExp(`#### ${graph.title.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}[\\s\\S]*?!\\[.*?\]\\(.*?\\)`, 'g');
                
                if (imageLinkRegex.test(readmeContent)) {
                     readmeContent = readmeContent.replace(imageLinkRegex, sectionContent);
                     hasUpdates = true;
                } else {
                    readmeContent += `\n\n${sectionContent}`;
                    hasUpdates = true;
                }
            }
        });

        if (hasUpdates) {
            fs.writeFileSync(readmePath, readmeContent);
            console.log(`Updated README.md at ${readmePath}`);
        }
    }
}
