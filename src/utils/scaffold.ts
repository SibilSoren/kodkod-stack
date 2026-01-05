import fs from 'fs-extra';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export interface ScaffoldOptions {
  projectName: string;
  framework: string;
  database: string;
  orm: string;
}

function getOrmTemplateDir(templatesDir: string, orm: string, database: string): string {
  // Check for database-specific ORM template first
  const dbSpecificDir = path.join(templatesDir, `orms/${orm}-${database}`);
  const baseOrmDir = path.join(templatesDir, `orms/${orm}`);
  
  // Use database-specific template if it exists (e.g., prisma-mysql, drizzle-mysql)
  if (fs.pathExistsSync(dbSpecificDir)) {
    return dbSpecificDir;
  }
  
  return baseOrmDir;
}

export async function scaffoldProject(targetDir: string, options: ScaffoldOptions) {
  const templatesDir = path.resolve(__dirname, '../templates');
  const baseDir = path.join(templatesDir, 'base');
  const frameworkDir = path.join(templatesDir, `frameworks/${options.framework}`);
  const ormDir = getOrmTemplateDir(templatesDir, options.orm, options.database);
  
  // 1. Create target directory
  await fs.ensureDir(targetDir);

  // 2. Copy base template files
  if (await fs.pathExists(baseDir)) {
    await fs.copy(baseDir, targetDir);
  }

  // 3. Copy framework specific files
  if (await fs.pathExists(frameworkDir)) {
    await fs.copy(frameworkDir, targetDir);
  }

  // 4. Copy ORM specific files (may be database-specific)
  if (await fs.pathExists(ormDir)) {
    await fs.copy(ormDir, targetDir);
  }

  // 5. Update package.json
  const pkgPath = path.join(targetDir, 'package.json');
  if (await fs.pathExists(pkgPath)) {
    const pkg = await fs.readJson(pkgPath);
    pkg.name = options.projectName;
    
    // Add framework dependencies
    if (options.framework === 'express') {
      pkg.dependencies = { ...pkg.dependencies, express: '^4.18.2', cors: '^2.8.5', helmet: '^7.1.0', dotenv: '^16.3.1' };
      pkg.devDependencies = { ...pkg.devDependencies, '@types/express': '^4.17.21', '@types/cors': '^2.8.17' };
    } else if (options.framework === 'hono') {
      pkg.dependencies = { ...pkg.dependencies, hono: '^3.11.7', '@hono/node-server': '^1.3.1' };
    } else if (options.framework === 'fastify') {
      pkg.dependencies = { ...pkg.dependencies, fastify: '^4.25.0' };
      pkg.devDependencies = { ...pkg.devDependencies, '@types/node': '^20.10.0' };
    }

    // Add ORM dependencies
    if (options.orm === 'prisma') {
      pkg.dependencies = { ...pkg.dependencies, '@prisma/client': '^5.7.1' };
      pkg.devDependencies = { ...pkg.devDependencies, prisma: '^5.7.1' };
    } else if (options.orm === 'drizzle') {
      pkg.dependencies = { ...pkg.dependencies, 'drizzle-orm': '^0.29.3' };
      pkg.devDependencies = { ...pkg.devDependencies, 'drizzle-kit': '^0.20.14' };
      
      // Add database-specific driver for Drizzle
      if (options.database === 'postgresql') {
        pkg.dependencies['postgres'] = '^3.4.3';
      } else if (options.database === 'mysql') {
        pkg.dependencies['mysql2'] = '^3.11.0';
      }
    } else if (options.orm === 'mongoose') {
      pkg.dependencies = { ...pkg.dependencies, mongoose: '^8.0.3' };
      pkg.devDependencies = { ...pkg.devDependencies, '@types/mongoose': '^5.11.97' };
    }
    
    await fs.writeJson(pkgPath, pkg, { spaces: 2 });
  }

  // 6. Update .env.example with correct DATABASE_URL format
  await updateEnvExample(targetDir, options.database);
}

async function updateEnvExample(targetDir: string, database: string) {
  const envPath = path.join(targetDir, '.env.example');
  
  let dbUrlExample: string;
  switch (database) {
    case 'mysql':
      dbUrlExample = 'DATABASE_URL="mysql://user:password@localhost:3306/mydb"';
      break;
    case 'mongodb':
      dbUrlExample = 'DATABASE_URL="mongodb://user:password@localhost:27017/mydb"';
      break;
    default: // postgresql
      dbUrlExample = 'DATABASE_URL="postgresql://user:password@localhost:5432/mydb"';
  }

  const content = `# Database\n${dbUrlExample}\n\n# Server\nPORT=3000\nNODE_ENV=development\n`;
  
  await fs.writeFile(envPath, content);
}
