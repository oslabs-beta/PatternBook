
### Back-end file structure

../
├── services/
│   ├── cli.ts                 # Entry point
│   ├── commands/
│   │   └── scan.ts           # Main scan command
│   ├── core/
│   │   ├── scanner.ts        # File discovery engine
│   │   ├── config.ts         # Config management
│   │   └── patterns.ts       # Framework-specific patterns
│   ├── utils/
│   │   ├── ignore.ts         # .gitignore handling
│   │   └── output.ts         # JSON formatting
│   └── types/
│       └── index.ts          # TypeScript types
├── tests/
│   └── fixtures/             # Dummy component files for testing
├── package.json
├── package_lock.json
└── tsconfig.json


```
{
  "dependencies": {
    "commander": "^11.1.0",
    "enquirer": "^2.4.1",
    "chalk": "^5.3.0",
    "ora": "^8.0.1"
  }
}


{
  "dependencies": {
    "fast-glob": "^3.3.2",      // Faster than globby, better for large projects
    "ignore": "^5.3.0",         // Respect .gitignore
    "chokidar": "^3.5.3"        // File watching (for future dev mode)
  }
}
```