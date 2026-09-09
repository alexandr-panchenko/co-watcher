import fs from 'node:fs';
import path from 'node:path';
import { COLORS, RADII, SHADOWS, TYPOGRAPHY, LAYOUT } from '../src/styles/tokens.ts';

// Verify token integrity
if (!COLORS || !RADII || !SHADOWS || !TYPOGRAPHY || !LAYOUT) {
  throw new Error('Design system tokens failed verification');
}

const SRC_DIR = path.resolve('src/components');
// Hex color pattern e.g. #fff, #131316, #4d8eff/20 (tailwind opacity or standard hex)
const HEX_REGEX = /#(?:[0-9a-fA-F]{3,8})\b/g;

// Files allowed to declare design tokens and raw hex values
const ALLOWED_FILES = [
  'tokens.ts',
  'index.css',
];

let hasErrors = false;

function scanDir(dir: string) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      scanDir(fullPath);
    } else if (entry.isFile() && (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts'))) {
      if (ALLOWED_FILES.some((f) => entry.name.endsWith(f))) {
        continue;
      }
      checkFile(fullPath);
    }
  }
}

function checkFile(filePath: string) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');

  lines.forEach((line, index) => {
    // Ignore pure comments
    const trimmed = line.trim();
    if (trimmed.startsWith('//') || trimmed.startsWith('/*') || trimmed.startsWith('*')) {
      return;
    }

    const matches = line.match(HEX_REGEX);
    if (matches) {
      console.error(
        `\x1b[31m[Design Token Violation]\x1b[0m ${path.relative(process.cwd(), filePath)}:${index + 1}`
      );
      console.error(`   Found raw hex color(s): ${matches.join(', ')}`);
      console.error(`   Line: ${trimmed.slice(0, 100)}`);
      hasErrors = true;
    }
  });
}

console.log('🔍 Checking for raw hex colors in src/components...');
scanDir(SRC_DIR);

if (hasErrors) {
  console.error('\n❌ Design token check failed! Please replace raw hex colors with design tokens or Tailwind semantic utility classes.');
  process.exit(1);
} else {
  console.log('✅ All components adhere to design tokens! Zero raw hex colors found.');
}
