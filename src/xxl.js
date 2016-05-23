#!/usr/bin/env node
/* --
```
  Usage: node_modules/.bin/xxl [options]

  Options:

    -h, --help                   output usage information
    -V, --version                output the version number
    --src [srcDirs]              e.g. "[\"server\", \"client\", \"common\"]"
    -e, --exclude [excludeDirs]  e.g. "[\"playground\", \"preRendered\"]"
```
-- */
import path from 'path';
import fs from 'fs';
import program from 'commander';
import diveSync from 'diveSync';
import sloc from 'sloc';
import { mainStory, chalk } from 'storyboard';
import packageJson from '../package.json';

const EXTENSION_MAPPING = {
  '.coffee': 'coffee',
  '.js': 'js',
  '.jsx': 'jsx',
  '.cjsx': 'coffee',
  '.html': 'html',
  '.sass': 'scss',
  '.css': 'css',
};

const DEFAULT_SOURCES = ['src'];
const DEFAULT_EXCLUDE = ['playground', 'preRendered'];

program
  .version(packageJson.version)
  .option('--src [srcDirs]',
    'e.g. "[\\"server\\", \\"client\\", \\"common\\"]"',
    JSON.stringify(DEFAULT_SOURCES))
  .option('-e, --exclude [excludeDirs]',
    'e.g. "[\\"playground\\", \\"preRendered\\"]"',
    JSON.stringify(DEFAULT_EXCLUDE))
  .parse(process.argv);

program.src = JSON.parse(program.src);
program.exclude = JSON.parse(program.exclude);

const getInitialStats = () => ({
  filesProcessed: 0,
  total: 0,
  source: 0,
  comment: 0,
  single: 0,
  block: 0,
  mixed: 0,
  empty: 0,
  extensions: {},
});

const filterOutPaths = thePath => {
  for (let i = 0; i < program.exclude.length; i++) {
    if (thePath.indexOf(program.exclude[i]) >= 0) return true;
  }
  return false;
};

const totalStats = getInitialStats();

const addStats = (stats, newStats, ext) => {
  /* eslint-disable no-param-reassign */
  stats.filesProcessed++;
  Object.keys(newStats).forEach(k => { stats[k] += newStats[k]; });
  stats.extensions[ext] = stats.extensions[ext] == null ? 1 : stats.extensions[ext] + 1;
  /* eslint-enable no-param-reassign */
};

const processDir = srcPath => {
  mainStory.info('xxl', `Processing ${chalk.cyan.bold(srcPath)}...`);
  const partialStats = getInitialStats();
  diveSync(path.normalize(srcPath), (err, filePath0) => {
    if (err) {
      mainStory.error('xxl', '', { attach: err });
      return;
    }
    const filePath = path.normalize(filePath0);
    if (filterOutPaths(filePath)) return;
    const ext = path.extname(filePath);
    const processor = EXTENSION_MAPPING[ext];
    if (!processor) return;
    const code = fs.readFileSync(filePath, 'utf8');
    const stats = sloc(code, processor);
    addStats(totalStats, stats, ext);
    addStats(partialStats, stats, ext);
  });
  if (program.src.length > 1) {
    mainStory.info('xxl', `Stats for ${chalk.cyan.bold(srcPath)}:`, { attach: partialStats });
  }
};

program.src.forEach(processDir);

if (program.src.length > 1) mainStory.info('xxl', '');
mainStory.info('xxl', `${chalk.cyan.bold('TOTAL')} stats:`, { attach: totalStats });
