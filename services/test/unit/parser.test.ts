import { describe, it, expect } from 'vitest';
import { CodeParser } from '../../core/parser';
import * as path from 'path';

describe('CodeParser', () => {
<<<<<<< HEAD
  const parser = new CodeParser();
  const fixturesPath = path.resolve(__dirname, '../fixtures');

  it('should extract imports', () => {
    const filePath = path.join(fixturesPath, 'UserProfile.tsx');
    const result = parser.parseFile(filePath);

    expect(result.imports).toContain('./Button');
  });

  it('should extract API calls (fetch)', () => {
    const filePath = path.join(fixturesPath, 'UserProfile.tsx');
    const result = parser.parseFile(filePath);

    expect(result.apiCalls).toHaveLength(2);

    // Check GET call
    const getCall = result.apiCalls.find(c => c.method === 'GET');
    expect(getCall).toBeDefined();
    expect(getCall?.url).toContain('/api/users/${userId}');

    // Check POST call
    const postCall = result.apiCalls.find(c => c.method === 'POST');
    expect(postCall).toBeDefined();
    expect(postCall?.url).toBe('/api/users');
  });
=======
    const parser = new CodeParser();
    const fixturesPath = path.resolve(__dirname, '../fixtures');

    it('should extract imports', () => {
        const filePath = path.join(fixturesPath, 'UserProfile.tsx');
        const result = parser.parseFile(filePath);

        expect(result.imports).toContain('./Button');
    });

    it('should extract API calls (fetch)', () => {
        const filePath = path.join(fixturesPath, 'UserProfile.tsx');
        const result = parser.parseFile(filePath);

        expect(result.apiCalls).toHaveLength(2);

        // Check GET call
        const getCall = result.apiCalls.find(c => c.method === 'GET');
        expect(getCall).toBeDefined();
        expect(getCall?.url).toContain('/api/users/${userId}');

        // Check POST call
        const postCall = result.apiCalls.find(c => c.method === 'POST');
        expect(postCall).toBeDefined();
        expect(postCall?.url).toBe('/api/users');
    });
>>>>>>> origin/main
});
