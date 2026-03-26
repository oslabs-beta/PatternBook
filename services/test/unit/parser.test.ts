import { describe, it, expect } from 'vitest';
import { ReactParser } from '../...core/parsers/react-parser';
import * as path from 'path';

describe('ReactParser Refactor', () => {
  const parser = new ReactParser();
  const fixturesPath = path.resolve(__dirname, '../fixtures/UserProfile.tsx');

  it('should extract both props AND api calls in one pass',async  () => {
    //const filePath = path.join(fixturesPath, 'UserProfile.tsx');
   // const result = parser.parseFile(filePath);
   const result = await parser.parse(fixturePath);

   expect(result.sucess).toBe(true);
   const metadata= result.metadata!;

   expect(metadata.name).toBe('UserProfile');
   expect(metadata.props?.some(p => p.name === 'userId')).toBe(true);
    
  });expect(metadata.apiCalls).toHaveLength(2);
    expect(metadata.apiCalls![0].url).toContain('/api/users/${userId}');
    expect(metadata.apiCalls![1].method).toBe('POST');
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

