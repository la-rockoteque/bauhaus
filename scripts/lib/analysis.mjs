// Shared plumbing for the analyser scripts: JSON files, CLI wrapper, small maths.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/** A bad command line. `run` prints the usage text and exits 2. */
export class UsageError extends Error {}

export function readJson(file) {
  if (!fs.existsSync(file)) throw new UsageError(`no such file: ${file}`);
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (err) {
    throw new Error(`${file}: ${err.message}`);
  }
}

/** Write `content` (object -> 2-space JSON) to dir/name, making the folder. Returns the path. */
export function writeArtifact(dir, name, content) {
  const file = path.join(dir, name);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, typeof content === 'string' ? content : `${JSON.stringify(content, null, 2)}\n`);
  return file;
}

export function requireDir(dir) {
  if (!dir || !fs.existsSync(dir) || !fs.statSync(dir).isDirectory()) throw new UsageError(`not a folder: ${dir}`);
  return dir;
}

/** Run `fn`; UsageError -> usage text + 2, other errors -> message + 2, else fn's exit code. */
export function run(name, usage, io, fn) {
  try {
    return fn() ?? 0;
  } catch (err) {
    io.error(err instanceof UsageError ? `${name}: ${err.message}\n${usage}` : `${name}: ${err.message}`);
    return 2;
  }
}

/** Call `main` when the module is the entry point. */
export function runIfMain(metaUrl, main) {
  if (process.argv[1] && fileURLToPath(metaUrl) === fs.realpathSync(process.argv[1])) process.exitCode = main(process.argv.slice(2));
}

export const round = (n, digits = 2) => Math.round(n * 10 ** digits) / 10 ** digits;
export const sum = (list, f = (x) => x) => list.reduce((n, x) => n + f(x), 0);
export const uniq = (list) => [...new Set(list)];
export const table = (head, rows) => [`| ${head.join(' | ')} |`, `|${head.map(() => '---').join('|')}|`, ...rows.map((r) => `| ${r.join(' | ')} |`)].join('\n');
