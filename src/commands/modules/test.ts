import fsExtra from 'fs-extra';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { existsSync as nodeExistsSync } from 'node:fs';
import { select, isCancel, cancel } from '@clack/prompts';

const { copySync, readJsonSync, writeJsonSync, mkdirSync, existsSync } = fsExtra;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface ProjectConfig {
  framework: 'express' | 'hono' | 'fastify';
  orm: 'prisma' | 'drizzle';
  database: string;
}

type TestRunner = 'vitest' | 'jest';

const getTestTemplateDir = () => {
  const paths = [
    join(__dirname, '../templates/modules/test'),       // dist/
    join(__dirname, '../../../templates/modules/test'), // src/commands/modules/
    join(__dirname, '../../templates/modules/test'),    // fallback
  ];
  for (const p of paths) {
    if (nodeExistsSync(p)) return p;
  }
  return paths[0]; // default
};

export async function addTestModule(projectDir: string, config: ProjectConfig) {
  // Prompt for test runner
  const testRunner = await select({
    message: 'Select a testing framework',
    options: [
      { value: 'vitest', label: 'Vitest', hint: 'Fast, modern, ESM-native' },
      { value: 'jest', label: 'Jest', hint: 'Classic, widely adopted' },
    ],
  }) as TestRunner;

  if (isCancel(testRunner)) {
    cancel('Operation cancelled.');
    process.exit(0);
  }

  const templatesDir = getTestTemplateDir();
  
  // Create tests directory
  mkdirSync(join(projectDir, 'tests', 'integration'), { recursive: true });
  
  // Copy config file
  if (testRunner === 'vitest') {
    copySync(
      join(templatesDir, 'vitest.config.ts'),
      join(projectDir, 'vitest.config.ts')
    );
  } else {
    copySync(
      join(templatesDir, 'jest.config.js'),
      join(projectDir, 'jest.config.js')
    );
  }
  
  // Copy framework-specific setup
  const setupSource = join(templatesDir, config.framework, testRunner, 'setup.ts');
  if (existsSync(setupSource)) {
    copySync(setupSource, join(projectDir, 'tests', 'setup.ts'));
  }
  
  // Update package.json
  const pkgPath = join(projectDir, 'package.json');
  const pkg = readJsonSync(pkgPath);
  
  if (testRunner === 'vitest') {
    pkg.devDependencies = {
      ...pkg.devDependencies,
      'vitest': '^3.0.0',
      'supertest': '^7.0.0',
      '@types/supertest': '^6.0.0',
    };
    pkg.scripts = {
      ...pkg.scripts,
      'test': 'vitest run',
      'test:watch': 'vitest',
      'test:coverage': 'vitest run --coverage',
    };
  } else {
    pkg.devDependencies = {
      ...pkg.devDependencies,
      'jest': '^29.7.0',
      '@types/jest': '^29.5.0',
      'ts-jest': '^29.2.0',
      'supertest': '^7.0.0',
      '@types/supertest': '^6.0.0',
    };
    pkg.scripts = {
      ...pkg.scripts,
      'test': 'jest',
      'test:watch': 'jest --watch',
      'test:coverage': 'jest --coverage',
    };
  }
  
  // Store test runner choice for generate command
  pkg.kodkod = {
    ...pkg.kodkod,
    testRunner,
  };
  
  writeJsonSync(pkgPath, pkg, { spaces: 2 });
}
