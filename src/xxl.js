#!/usr/bin/env node

/* eslint-disable no-console */
/* --
```
  Usage: xxl [options]

  Options:

    -h, --help                   output usage information
    -V, --version                output the version number
    --src [srcDirs]              source directories (comma-separated)
    -e, --exclude [excludeDirs]  excluded path fragments (comma-separated)
```
-- */
import path from 'path';
import fs from 'fs';
import program from 'commander';
import diveSync from 'diveSync';
import sloc from 'sloc';
import chalk from 'chalk';
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

const DEFAULT_SOURCES = 'src';
const DEFAULT_EXCLUDE = '';

program
  .version(packageJson.version)
  .option('--src [srcDirs]',
    'source directories (comma-separated)',
    DEFAULT_SOURCES)
  .option('-e, --exclude [excludeDirs]',
    'excluded path fragments (comma-separated)',
    DEFAULT_EXCLUDE)
  .parse(process.argv);

program.src = program.src.split(/\s*,\s*/);
program.exclude = program.exclude ? program.exclude.split(/\s*,\s*/) : [];
program.exclude = program.exclude.map((o) => o.replace(/[\/,\\]/g, path.sep));

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

const filterOutPaths = (thePath) => {
  for (let i = 0; i < program.exclude.length; i++) {
    if (thePath.indexOf(program.exclude[i]) >= 0) return true;
  }
  return false;
};

const totalStats = getInitialStats();

const addStats = (stats, newStats, ext) => {
  /* eslint-disable no-param-reassign */
  stats.filesProcessed += 1;
  Object.keys(newStats).forEach((k) => { stats[k] += newStats[k]; });
  stats.extensions[ext] = stats.extensions[ext] == null ? 1 : stats.extensions[ext] + 1;
  /* eslint-enable no-param-reassign */
};

const logStats = (title, stats) => {
  console.log(`Stats: ${chalk.cyan.bold(title)}:`);
  Object.keys(stats).forEach((key) => {
    if (key !== 'extensions') {
      console.log(`  ${key} ${chalk.blue.bold(stats[key])}`);
    } else {
      console.log('  extensions:');
      Object.keys(stats.extensions).forEach((ext) => {
        console.log(`    ${ext} ${chalk.blue.bold(stats.extensions[ext])}`);
      });
    }
  });
};

const processDir = (srcPath) => {
  console.log(`Processing ${chalk.cyan.bold(srcPath)}...`);
  const partialStats = getInitialStats();
  diveSync(path.normalize(srcPath), (err, filePath0) => {
    if (err) {
      console.log(chalk.red.bold(err.stack));
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
  if (program.src.length > 1) logStats(srcPath, partialStats);
};

program.src.forEach(processDir);

if (program.src.length > 1) console.log('');
logStats('TOTAL', totalStats);
