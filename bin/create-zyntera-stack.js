#!/usr/bin/env node
import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const C = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
};

const I = {
  info: 'ℹ',
  ok: '✓',
  error: '✖',
  install: '⬇',
  rocket: '🚀',
};

const BANNER_LINES = [
  '███████╗██╗   ██╗███╗   ██╗████████╗███████╗██████╗  █████╗',
  '╚══███╔╝╚██╗ ██╔╝████╗  ██║╚══██╔══╝██╔════╝██╔══██╗██╔══██╗',
  '  ███╔╝  ╚████╔╝ ██╔██╗ ██║   ██║   █████╗  ██████╔╝███████║',
  ' ███╔╝    ╚██╔╝  ██║╚██╗██║   ██║   ██╔══╝  ██╔══██╗██╔══██║',
  '███████╗   ██║   ██║ ╚████║   ██║   ███████╗██║  ██║██║  ██║',
  '╚══════╝   ╚═╝   ╚═╝  ╚═══╝   ╚═╝   ╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝',
  '',
  '███████╗████████╗ █████╗  ██████╗██╗  ██╗',
  '██╔════╝╚══██╔══╝██╔══██╗██╔════╝██║ ██╔╝',
  '███████╗   ██║   ███████║██║     █████╔╝ ',
  '╚════██║   ██║   ██╔══██║██║     ██╔═██╗ ',
  '███████║   ██║   ██║  ██║╚██████╗██║  ██╗',
  '╚══════╝   ╚═╝   ╚═╝  ╚═╝ ╚═════╝╚═╝  ╚═╝',
];

const BANNER_ROW_COLORS = [
  '\x1b[38;5;93m',
  '\x1b[38;5;99m',
  '\x1b[38;5;135m',
  '\x1b[38;5;177m',
  '\x1b[38;5;219m',
  '\x1b[97m',
  '',
  '\x1b[38;5;135m',
  '\x1b[38;5;177m',
  '\x1b[38;5;213m',
  '\x1b[38;5;219m',
  '\x1b[97m',
  '\x1b[97m',
];

function color(code, text) {
  return `${code}${text}${C.reset}`;
}

function printBanner() {
  const cols = process.stdout.columns ?? 80;
  const width = Math.max(...BANNER_LINES.map((line) => [...line].length));
  const canRender = cols >= width + 2;

  console.log('');
  if (!canRender) {
    console.log(color(C.magenta, `${I.rocket} Zyntera Stack`));
  } else {
    for (let i = 0; i < BANNER_LINES.length; i++) {
      const line = BANNER_LINES[i];
      const rowColor = BANNER_ROW_COLORS[i];
      if (!line) {
        console.log('');
        continue;
      }
      console.log(color(rowColor || C.magenta, line));
    }
  }
  console.log(color(C.dim, 'Scaffold a production-ready fullstack starter.\n'));
}

const args = process.argv.slice(2);
const projectName = args[0];
printBanner();

if (!projectName) {
  console.error(color(C.red, `${I.error} Usage: npm create-zyntera-stack@latest <project-name>`));
  process.exit(1);
}

const cwd = process.cwd();
const targetDir = path.join(cwd, projectName);
const templateDir = path.join(path.dirname(new URL(import.meta.url).pathname), '..', 'templates', 'fullstack');

if (fs.existsSync(targetDir)) {
  console.error(color(C.red, `${I.error} Target directory already exists: ${targetDir}`));
  process.exit(1);
}

console.log(color(C.cyan, `${I.info} Creating project in ${targetDir}`));
copyDir(templateDir, targetDir);
replaceInFiles(targetDir, '__PROJECT_NAME__', projectName);

// create env from examples if missing
copyIfMissing(path.join(targetDir, '.env.example'), path.join(targetDir, '.env'));
copyIfMissing(path.join(targetDir, 'apps/web/.env.example'), path.join(targetDir, 'apps/web/.env'));

console.log(`\n${color(C.cyan, `${I.install} Installing dependencies...`)}\n`);
execSync('npm install', { cwd: targetDir, stdio: 'inherit' });

if (fs.existsSync(path.join(targetDir, 'apps/web/package.json'))) {
  execSync('npm install', { cwd: path.join(targetDir, 'apps/web'), stdio: 'inherit' });
}

console.log('');
console.log(color(C.green, `${I.ok} Project created: ${projectName}`));
console.log('');
console.log(`${color(C.bold, 'Next steps:')}`);
console.log(`  ${color(C.cyan, 'cd')} ${projectName}`);
console.log(`  ${color(C.cyan, 'npm run db:migrate')}`);
console.log(`  ${color(C.cyan, 'npm run dev')}`);
console.log('');
console.log(color(C.yellow, `${I.rocket} Happy building with Zyntera Stack!`));

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) copyDir(srcPath, destPath);
    else fs.copyFileSync(srcPath, destPath);
  }
}

function replaceInFiles(dir, find, replacement) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      replaceInFiles(fullPath, find, replacement);
      continue;
    }
    if (!isTextFile(fullPath)) continue;
    const content = fs.readFileSync(fullPath, 'utf8');
    if (content.includes(find)) {
      fs.writeFileSync(fullPath, content.replaceAll(find, replacement), 'utf8');
    }
  }
}

function isTextFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const textExts = new Set([
    '.js', '.mjs', '.cjs', '.ts', '.tsx', '.json', '.md', '.yml', '.yaml',
    '.env', '.txt', '.css', '.html', '.sql', '.gitignore', '.dockerignore'
  ]);
  return textExts.has(ext) || path.basename(filePath).startsWith('.env');
}

function copyIfMissing(src, dest) {
  if (fs.existsSync(src) && !fs.existsSync(dest)) {
    fs.copyFileSync(src, dest);
  }
}