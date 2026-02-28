import { ComponentMetadata } from '../types/parser.js';

export class TagProcessor {
  public process(metadata: ComponentMetadata): string[] {
    const tags = new Set<string>();

    // 1. Process Documentation (JSDoc)
    if (metadata.documentation) {
      const docTags = metadata.documentation.match(/@(\w+)/g);
      if (docTags) {
        docTags.forEach(tag => tags.add(tag.replace('@', '').toLowerCase()));
      }
    }

    // 2. Process Props (Behavioral)
    const propNames = (metadata.props || []).map(p => p.name.toLowerCase());
    if (propNames.some(n => ['onclick', 'onchange', 'onsubmit'].includes(n))) {
      tags.add('interactive');
    }
    if (propNames.includes('children')) {
      tags.add('container');
    }

    // 3. Process Path (Structural)
    const lowerPath = (metadata.path || '').toLowerCase();
    if (lowerPath.includes('fixtures/') || lowerPath.includes('ui/')) {
      tags.add('design-system');
    }

    // 4. Process Name (Semantic)
    const lowerName = metadata.name.toLowerCase();
    if (lowerName.includes('button')) tags.add('button');
    if (metadata.type === 'hook' || lowerName.startsWith('use')) {
      tags.add('hook');
    }

    return Array.from(tags).sort();
  }
}
