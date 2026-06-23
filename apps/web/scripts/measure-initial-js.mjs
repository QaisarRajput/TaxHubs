import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

function parseArgs(argv) {
  const options = {
    route: '/income-tax',
    maxKb: 100,
    failOnThreshold: false,
  };

  for (const arg of argv) {
    if (arg.startsWith('--route=')) {
      options.route = arg.slice('--route='.length);
    } else if (arg.startsWith('--max-kb=')) {
      const parsed = Number(arg.slice('--max-kb='.length));
      if (Number.isFinite(parsed) && parsed > 0) {
        options.maxKb = parsed;
      }
    } else if (arg === '--fail-on-threshold') {
      options.failOnThreshold = true;
    }
  }

  return options;
}

function routeToHtmlPath(route) {
  if (route === '/' || route === '') {
    return 'index.html';
  }
  const clean = route.replace(/^\//, '').replace(/\/$/, '');
  return `${clean}.html`;
}

function extractChunkSources(html) {
  const scriptRe = /<script[^>]+src="([^"]+)"/g;
  const sources = new Set();

  let match;
  while ((match = scriptRe.exec(html))) {
    const src = match[1];
    if (src.startsWith('/_next/static/chunks/') && src.endsWith('.js')) {
      sources.add(src);
    }
  }

  return [...sources];
}

function gzipSize(buffer) {
  return zlib.gzipSync(buffer, { level: 9 }).length;
}

const options = parseArgs(process.argv.slice(2));
const htmlFile = routeToHtmlPath(options.route);
const htmlPath = path.join(process.cwd(), 'out', htmlFile);

if (!fs.existsSync(htmlPath)) {
  console.error(`Missing exported HTML: ${htmlPath}`);
  console.error('Run build first: corepack pnpm --filter web run build');
  process.exit(1);
}

const html = fs.readFileSync(htmlPath, 'utf8');
const sources = extractChunkSources(html);

if (sources.length === 0) {
  console.error(`No chunk scripts found in ${htmlFile}`);
  process.exit(1);
}

let totalRaw = 0;
let totalGzip = 0;
for (const src of sources) {
  const relative = src.replace(/^\//, '');
  const chunkPath = path.join(process.cwd(), 'out', relative);
  if (!fs.existsSync(chunkPath)) {
    console.error(`Missing chunk file referenced by HTML: ${chunkPath}`);
    process.exit(1);
  }

  const bytes = fs.readFileSync(chunkPath);
  totalRaw += bytes.length;
  totalGzip += gzipSize(bytes);
}

const totalGzipKb = totalGzip / 1024;
const totalRawKb = totalRaw / 1024;
const exceeds = totalGzipKb > options.maxKb;

console.log(`Route: ${options.route}`);
console.log(`HTML: out/${htmlFile}`);
console.log(`Chunk scripts: ${sources.length}`);
console.log(`Initial JS (raw): ${totalRawKb.toFixed(2)} KB`);
console.log(`Initial JS (gzip): ${totalGzipKb.toFixed(2)} KB`);
console.log(`Threshold: ${options.maxKb.toFixed(2)} KB`);
console.log(`Status: ${exceeds ? 'OVER' : 'PASS'}`);

if (options.failOnThreshold && exceeds) {
  process.exit(2);
}
