import fs from 'node:fs';
import path from 'node:path';

// Banned directives pattern in executable source files
const BANNED_PATTERNS: Array<{ pattern: RegExp; name: string }> = [
  { pattern: /\/\/\s*@ts-ignore\b/i, name: '// @ts-ignore' },
  { pattern: /\/\/\s*@ts-expect-error\b/i, name: '// @ts-expect-error' },
  { pattern: /\/\/\s*@ts-nocheck\b/i, name: '// @ts-nocheck' },
  { pattern: /\/\*\s*eslint-disable\b/i, name: '/* eslint-disable */' },
  { pattern: /\/\/\s*eslint-disable\b/i, name: '// eslint-disable' },
  { pattern: /\/\/\s*eslint-disable-next-line\b/i, name: '// eslint-disable-next-line' },
  { pattern: /\/\*\s*eslint-disable-next-line\b/i, name: '/* eslint-disable-next-line */' },
  { pattern: /knipignore\b/i, name: 'knipignore' },
  { pattern: /stylelint-disable\b/i, name: 'stylelint-disable' },
];

const SCAN_DIRS = ['src', 'scripts'];
const IGNORED_PATHS = [
  'node_modules',
  'dist',
  'docs',
  'scripts/check-suppressions.ts', // Exclude self
];

let violationCount = 0;

function scan(itemPath: string) {
  const relPath = path.relative(process.cwd(), itemPath);
  if (IGNORED_PATHS.some((ignored) => relPath === ignored || relPath.startsWith(`${ignored}/`))) {
    return;
  }

  const stat = fs.statSync(itemPath);
  if (stat.isDirectory()) {
    const entries = fs.readdirSync(itemPath);
    for (const entry of entries) {
      scan(path.join(itemPath, entry));
    }
  } else if (stat.isFile()) {
    if (!/\.(tsx?|jsx?|css|jsonc?)$/.test(itemPath)) {
      return;
    }

    const content = fs.readFileSync(itemPath, 'utf-8');
    const lines = content.split('\n');

    lines.forEach((line, index) => {
      for (const { pattern, name } of BANNED_PATTERNS) {
        if (pattern.test(line)) {
          console.error(
            `\x1b[31m[Anti-Suppression Violation]\x1b[0m ${relPath}:${index + 1}`
          );
          console.error(`   Found banned directive: ${name}`);
          console.error(`   Line: ${line.trim().slice(0, 100)}`);
          violationCount++;
        }
      }
    });
  }
}

console.log('🔍 Scanning codebase for banned suppression directives (@ts-ignore, eslint-disable, etc.)...');
for (const dir of SCAN_DIRS) {
  const full = path.resolve(dir);
  if (fs.existsSync(full)) {
    scan(full);
  }
}

// Also scan top-level configs
const TOP_LEVEL_CONFIGS = ['vite.config.ts', 'eslint.config.js', 'knip.jsonc', 'tsconfig.json'];
for (const file of TOP_LEVEL_CONFIGS) {
  const full = path.resolve(file);
  if (fs.existsSync(full)) {
    scan(full);
  }
}

if (violationCount > 0) {
  console.error(`\n❌ Found ${violationCount} suppression violation(s)! Directives like @ts-ignore and eslint-disable are strictly forbidden.`);
  process.exit(1);
} else {
  console.log('✅ Zero suppression directives found! Strict quality gates satisfied.');
}
