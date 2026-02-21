import { describe, it, expect, beforeEach } from 'vitest';
import { Project, SourceFile } from 'ts-morph';
import { getInternalDependencies } from '../scripts/dependency-mapper.ts';

describe('Dependency Mapper Logic', () => {
    let project: Project;

  beforeEach(() => {
    project = new Project();
  });



it('should extract internal imports starting with "."', () => {
    //mock file
    const file: SourceFile = project.createSourceFile('test.tsx', `
      import React from 'react';
      import { Button } from './Button';
      import { Layout } from '../containers/Layout';
    `);

    const result: string[] = getInternalDependencies(file);

    expect(result).toContain('./Button');
    expect(result).toContain('../containers/Layout');
    expect(result).not.toContain('react');
});

it('should return an empty array if no internal imports are found', () => {
    const file: SourceFile = project.createSourceFile('leaf.tsx', `
      import React from 'react';
      export const MyComponent = () => <div>Hello</div>;
    `);

    const result: string[] = getInternalDependencies(file);

    expect(result).toEqual([]);

});

    it('should handle path aliases like "@/" if configured', () => {
        const file: SourceFile = project.createSourceFile('alias-test.tsx', `
    import { Header } from '@/components/Header';
    import { Footer } from '../Footer';
  `);

        const result = getInternalDependencies(file);

        expect(result).toContain('@/components/Header');
        expect(result).toContain('../Footer');
    });

});