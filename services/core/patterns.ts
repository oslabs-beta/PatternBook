/**
 * Framework-specific file patterns
 * These patterns are framework-agnostic at the scanning level
 * but help identify component files for each framework
 */

export const FRAMEWORK_PATTERNS = {
  react: {
    include: [
      '**/*.{jsx,ts,js,tsx}',
      '**/components/**/*.{js,ts}',
      '**/hooks/**/*.{js,ts}',
    ],
    exclude: [
      '**/*.test.{js,jsx,ts,tsx}',
      '**/*.spec.{js,jsx,ts,tsx}',
      '**/*.stories.{js,jsx,ts,tsx}',
      '**/__tests__/**',
    ],
  },
  vue: {
    include: [
      '**/*.vue',
      '**/components/**/*.{js,ts}',
      '**/composables/**/*.{js,ts}',
    ],
    exclude: [
      '**/*.test.{js,ts}',
      '**/*.spec.{js,ts}',
      '**/__tests__/**',
    ],
  },
  svelte: {
    include: [
      '**/*.svelte',
      '**/components/**/*.{js,ts}',
    ],
    exclude: [
      '**/*.test.{js,ts}',
      '**/*.spec.{js,ts}',
      '**/__tests__/**',
    ],
  },
} as const;

export const DEFAULT_EXCLUDE_PATTERNS = [
  '**/node_modules/**',
  '**/dist/**',
  '**/build/**',
  '**/.next/**',
  '**/.nuxt/**',
  '**/out/**',
  '**/coverage/**',
  '**/.git/**',
  '**/public/**',
  '**/static/**',
];

export const DEFAULT_INCLUDE_PATTERNS = [
  '**/*.{jsx,tsx,vue,svelte}',
  '**/components/**/*.{js,ts}',
  '**/hooks/**/*.{js,ts}',
  '**/composables/**/*.{js,ts}',
];

export function getFrameworkPatterns(framework: 'react' | 'vue' | 'svelte' | 'auto') {
  if (framework === 'auto') {
    // For auto-detection, we'll use a combination of all patterns
    return {
      include: DEFAULT_INCLUDE_PATTERNS,
      exclude: DEFAULT_EXCLUDE_PATTERNS,
    };
  }
  
  return {
    include: FRAMEWORK_PATTERNS[framework].include,
    exclude: [
      ...DEFAULT_EXCLUDE_PATTERNS,
      ...FRAMEWORK_PATTERNS[framework].exclude,
    ],
  };
}