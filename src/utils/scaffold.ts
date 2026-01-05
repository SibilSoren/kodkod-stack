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

export async function scaffoldProject(targetDir: string, options: ScaffoldOptions) {
  const templatesDir = path.resolve(__dirname, '../templates');
  const baseDir = path.join(templatesDir, 'base');
  const frameworkDir = path.join(templatesDir, `frameworks/${options.framework}`);
  const ormDir = path.join(templatesDir, `orms/${options.orm}`);
  
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

  // 4. Copy ORM specific files
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
    }

    // Add ORM dependencies
    if (options.orm === 'prisma') {
      pkg.dependencies = { ...pkg.dependencies, '@prisma/client': '^5.7.1' };
      pkg.devDependencies = { ...pkg.devDependencies, prisma: '^5.7.1' };
    } else if (options.orm === 'drizzle') {
      pkg.dependencies = { ...pkg.dependencies, 'drizzle-orm': '^0.29.3', 'postgres': '^3.4.3' };
      pkg.devDependencies = { ...pkg.devDependencies, 'drizzle-kit': '^0.20.14' };
    }
    
    await fs.writeJson(pkgPath, pkg, { spaces: 2 });
  }
}
