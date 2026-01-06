import { copyFileSync, mkdirSync, readFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

interface ProjectConfig {
  framework: 'express' | 'hono' | 'fastify';
  orm: 'prisma' | 'drizzle';
  database: string;
}

const getSwaggerTemplateDir = () => {
  const paths = [
    join(__dirname, '../templates/modules/swagger'),       // dist/
    join(__dirname, '../../../templates/modules/swagger'), // src/commands/modules/
    join(__dirname, '../../templates/modules/swagger'),    // fallback
  ];
  for (const p of paths) {
    if (existsSync(p)) return p;
  }
  return paths[0]; // default
};

const SWAGGER_TEMPLATE_DIR = getSwaggerTemplateDir();

export async function addSwaggerModule(projectDir: string, config: ProjectConfig) {
  const srcDir = join(projectDir, 'src');
  const configDir = join(srcDir, 'config');
  
  mkdirSync(configDir, { recursive: true });

  // Copy framework-specific files
  if (config.framework === 'express') {
    copyTemplateFile(
      join(SWAGGER_TEMPLATE_DIR, 'express', 'swagger.config.ts'),
      join(configDir, 'swagger.config.ts')
    );
  } else {
    copyTemplateFile(
      join(SWAGGER_TEMPLATE_DIR, config.framework, 'swagger.ts'),
      join(configDir, 'swagger.ts')
    );
  }

  // Update package.json with new dependencies
  await addDependencies(projectDir, config.framework);

  // Note: We don't automatically update index.ts because it can be complex with imports.
  // We will provide instructions in the console output.
}

function copyTemplateFile(src: string, dest: string) {
  if (existsSync(src)) {
    copyFileSync(src, dest);
  } else {
    console.warn(`Warning: Template file not found: ${src}`);
  }
}

async function addDependencies(projectDir: string, framework: string) {
  const packageJsonPath = join(projectDir, 'package.json');
  const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));

  if (framework === 'express') {
    packageJson.dependencies = {
      ...packageJson.dependencies,
      'swagger-ui-express': '^5.0.1',
      'swagger-jsdoc': '^6.2.8',
    };
    packageJson.devDependencies = {
      ...packageJson.devDependencies,
      '@types/swagger-ui-express': '^4.1.6',
      '@types/swagger-jsdoc': '^6.0.4',
    };
  } else if (framework === 'hono') {
    packageJson.dependencies = {
      ...packageJson.dependencies,
      '@hono/swagger-ui': '^0.4.0',
    };
  } else if (framework === 'fastify') {
    packageJson.dependencies = {
      ...packageJson.dependencies,
      '@fastify/swagger': '^9.4.0',
      '@fastify/swagger-ui': '^5.1.0',
    };
  }

  writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n');
}
