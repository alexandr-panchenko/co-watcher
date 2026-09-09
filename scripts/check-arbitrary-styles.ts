import fs from 'node:fs';
import path from 'node:path';

const TARGET_DIRS = ['src/components', 'src/styles'];
// Pattern for arbitrary Tailwind classes like text-[11px], w-[200px], bg-[#fff], etc.
// Look for className="..." containing [something]
const ARBITRARY_CLASS_REGEX = /className=["'`][^"'`]*\[[^\]]+\][^"'`]*["'`]/g;

let hasErrors = false;

function scanDir(dir: string) {
  if (!fs.existsSync(dir)) return;
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      scanDir(fullPath);
    } else if (entry.isFile() && (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts'))) {
      checkFile(fullPath);
    }
  }
}

function checkFile(filePath: string) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');

  lines.forEach((line, index) => {
    const trimmed = line.trim();
    if (trimmed.startsWith('//') || trimmed.startsWith('/*') || trimmed.startsWith('*')) {
      return;
    }

    const matches = line.match(ARBITRARY_CLASS_REGEX);
    if (matches) {
      console.error(
        `\x1b[31m[Arbitrary Style Violation]\x1b[0m ${path.relative(process.cwd(), filePath)}:${index + 1}`
      );
      console.error(`   Found arbitrary Tailwind class: ${matches.join(', ')}`);
      console.error(`   Line: ${trimmed.slice(0, 120)}`);
      hasErrors = true;
    }
  });
}

console.log('🔍 Checking for arbitrary Tailwind values ([...]) in components...');
for (const d of TARGET_DIRS) {
  scanDir(path.resolve(d));
}

if (hasErrors) {
  console.error('\n❌ Arbitrary style check failed! Please replace arbitrary values ([...]) with design tokens or semantic utility classes.');
  process.exit(1);
} else {
  console.log('✅ Zero arbitrary Tailwind values found! All styles strictly adhere to semantic design tokens.');
}
