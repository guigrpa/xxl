/* eslint-disable strict, indent, max-len, quote-props */

// ===============================================
// Basic config
// ===============================================
const NAME = 'xxl';
const VERSION = '1.0.0';
const DESCRIPTION = 'LOC statistics for multiple directories';
const KEYWORDS = ['loc', 'statistics'];

// ===============================================
// Helpers
// ===============================================
const runMultiple = (arr) => arr.join(' && ');

// ===============================================
// Specs
// ===============================================
const specs = {

  // -----------------------------------------------
  // General
  // -----------------------------------------------
  name: NAME,
  version: VERSION,
  description: DESCRIPTION,
  bin: { 'xxl': 'lib/xxl.js' },
  author: 'Guillermo Grau Panea',
  license: 'MIT',
  keywords: KEYWORDS,
  homepage: `https://github.com/guigrpa/${NAME}#readme`,
  bugs: { url: `https://github.com/guigrpa/${NAME}/issues` },
  repository: { type: 'git', url: `git+https://github.com/guigrpa/${NAME}.git` },

  // -----------------------------------------------
  // Scripts
  // -----------------------------------------------
  scripts: {

    // Top-level
    start:                      'npm run compile && node lib/xxl',
    compile:                    runMultiple([
                                  'rm -rf ./lib',
                                  'babel -d lib src',
                                ]),
    docs:                       'extract-docs --template docs/templates/README.md --output README.md',
    build:                      runMultiple([
                                  'node package',
                                  'npm run lint',
                                  'npm run compile',
                                  'npm run docs',
                                  'npm run xxl',
                                ]),
    travis:                     runMultiple([
                                  'npm run compile',
                                ]),

    // Static analysis
    lint:                       'eslint src',
    xxl:                        'node lib/xxl',
  },


  // -----------------------------------------------
  // Deps
  // -----------------------------------------------
  engines: {
    node: '>=4',
  },

  dependencies: {
    'diveSync': '0.3.0',
    'sloc': '0.1.10',
    'timm': '^1.2.3',
    'commander': '2.9.0',
    'chalk': '1.1.3',
  },

  devDependencies: {
    'extract-docs': '^1.4.0',
    'cross-env': '^1.0.7',

    // Babel (except babel-eslint)
    'babel-cli': '^6.6.5',
    'babel-core': '^6.7.2',
    'babel-preset-es2015': '^6.6.0',
    'babel-preset-stage-2': '^6.5.0',
    'babel-preset-react': '^6.5.0',

    // Linting
    eslint: '3.8.1',
    'eslint-config-airbnb': '12.0.0',
    'eslint-plugin-flowtype': '2.20.0',
    'eslint-plugin-import': '1.16.0',
    'eslint-plugin-jsx-a11y': '2.2.3',
    'eslint-plugin-react': '6.4.1',
    'babel-eslint': '7.0.0',
  },
};

// ===============================================
// Build package.json
// ===============================================
const _sortDeps = (deps) => {
  const newDeps = {};
  for (const key of Object.keys(deps).sort()) {
    newDeps[key] = deps[key];
  }
  return newDeps;
};
specs.dependencies = _sortDeps(specs.dependencies);
specs.devDependencies = _sortDeps(specs.devDependencies);
const packageJson = `${JSON.stringify(specs, null, '  ')}\n`;
require('fs').writeFileSync('package.json', packageJson);

/* eslint-enable strict, indent, max-len, quote-props */
