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

const AUTH_TEMPLATE_DIR = join(__dirname, '../../templates/modules/auth');

export async function addAuthModule(projectDir: string, config: ProjectConfig) {
  const srcDir = join(projectDir, 'src');
  
  // Create auth directories
  const authDir = join(srcDir, 'auth');
  const middlewareDir = join(srcDir, 'middleware');
  const utilsDir = join(srcDir, 'utils');
  
  mkdirSync(authDir, { recursive: true });
  mkdirSync(middlewareDir, { recursive: true });
  mkdirSync(utilsDir, { recursive: true });

  // Copy shared files
  copyTemplateFile(
    join(AUTH_TEMPLATE_DIR, 'shared', 'auth.service.ts'),
    join(authDir, 'auth.service.ts')
  );
  
  copyTemplateFile(
    join(AUTH_TEMPLATE_DIR, 'shared', 'auth.middleware.ts'),
    join(middlewareDir, 'auth.middleware.ts')
  );
  
  copyTemplateFile(
    join(AUTH_TEMPLATE_DIR, 'shared', 'password.utils.ts'),
    join(utilsDir, 'password.utils.ts')
  );

  // Copy framework-specific files
  copyTemplateFile(
    join(AUTH_TEMPLATE_DIR, config.framework, 'auth.controller.ts'),
    join(authDir, 'auth.controller.ts')
  );
  
  copyTemplateFile(
    join(AUTH_TEMPLATE_DIR, config.framework, 'auth.routes.ts'),
    join(authDir, 'auth.routes.ts')
  );

  // Update package.json with new dependencies
  await addDependencies(projectDir);

  // Update Prisma schema if using Prisma
  if (config.orm === 'prisma') {
    await updatePrismaSchema(projectDir);
  }

  // Update .env.example with JWT_SECRET
  updateEnvExample(projectDir);
}

function copyTemplateFile(src: string, dest: string) {
  if (existsSync(src)) {
    copyFileSync(src, dest);
  } else {
    console.warn(`Warning: Template file not found: ${src}`);
  }
}

async function addDependencies(projectDir: string) {
  const packageJsonPath = join(projectDir, 'package.json');
  const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));

  // Add auth dependencies
  packageJson.dependencies = {
    ...packageJson.dependencies,
    'bcrypt': '^5.1.1',
    'jsonwebtoken': '^9.0.2',
  };

  packageJson.devDependencies = {
    ...packageJson.devDependencies,
    '@types/bcrypt': '^5.0.2',
    '@types/jsonwebtoken': '^9.0.7',
  };

  writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n');
}

async function updatePrismaSchema(projectDir: string) {
  const schemaPath = join(projectDir, 'prisma', 'schema.prisma');
  
  if (!existsSync(schemaPath)) {
    return;
  }

  let schema = readFileSync(schemaPath, 'utf-8');

  // Check if password field already exists
  if (schema.includes('password')) {
    return;
  }

  // Add password field to User model
  const userModelRegex = /model User \{([^}]*)\}/;
  const match = schema.match(userModelRegex);
  
  if (match) {
    const userModel = match[1];
    const updatedUserModel = userModel.replace(
      /email\s+String\s+@unique/,
      'email     String   @unique\n  password  String'
    );
    schema = schema.replace(userModelRegex, `model User {${updatedUserModel}}`);
    writeFileSync(schemaPath, schema);
  }
}

function updateEnvExample(projectDir: string) {
  const envExamplePath = join(projectDir, '.env.example');
  
  let envContent = '';
  if (existsSync(envExamplePath)) {
    envContent = readFileSync(envExamplePath, 'utf-8');
  }

  if (!envContent.includes('JWT_SECRET')) {
    envContent += '\n# Auth\nJWT_SECRET=your-super-secret-jwt-key-change-in-production\nJWT_EXPIRES_IN=7d\n';
    writeFileSync(envExamplePath, envContent);
  }
}
