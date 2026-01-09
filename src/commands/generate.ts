import { existsSync, mkdirSync, writeFileSync, readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { intro, outro, text, isCancel, cancel, spinner } from '@clack/prompts';
import chalk from 'chalk';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const getTestTemplateDir = () => {
  const paths = [
    join(__dirname, '../templates/modules/test'),       // dist/
    join(__dirname, '../../templates/modules/test'),    // src/commands/
  ];
  for (const p of paths) {
    if (existsSync(p)) return p;
  }
  return paths[0]; // default
};

interface ProjectConfig {
  framework: 'express' | 'hono' | 'fastify';
  orm: 'prisma' | 'drizzle';
}

function detectProjectConfig(projectDir: string): ProjectConfig | null {
  const packageJsonPath = join(projectDir, 'package.json');
  
  if (!existsSync(packageJsonPath)) {
    return null;
  }

  const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
  const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };

  let framework: ProjectConfig['framework'] = 'express';
  if (deps['hono']) framework = 'hono';
  else if (deps['fastify']) framework = 'fastify';

  let orm: ProjectConfig['orm'] = 'prisma';
  if (deps['drizzle-orm']) orm = 'drizzle';

  return { framework, orm };
}

function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function toKebabCase(str: string): string {
  return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}

export async function handleGenerateCommand(type: string, name: string, projectDir: string) {
  intro(`${chalk.bgHex('#B45309').white(' kodkod generate ')} ${chalk.cyan(type)} ${chalk.yellow(name)}`);

  if (type !== 'route' && type !== 'test') {
    console.error(chalk.red(`Unknown generator type: ${type}`));
    console.log(chalk.yellow('Available generators: route, test'));
    process.exit(1);
  }

  const config = detectProjectConfig(projectDir);
  
  if (!config) {
    console.error(chalk.red('Error: Could not detect project configuration.'));
    console.error(chalk.yellow('Make sure you are running this command from a kodkod project root.'));
    process.exit(1);
  }

  console.log(chalk.dim(`Detected: ${config.framework} + ${config.orm}`));

  const s = spinner();

  if (type === 'test') {
    s.start(`Generating ${name} test...`);
    try {
      await generateTest(projectDir, name, config);
      s.stop(`Generated ${name} test successfully!`);
      
      const kebabName = toKebabCase(name);
      outro(chalk.green(`
✓ Test generated!

${chalk.cyan('File created:')}
  tests/integration/${kebabName}.test.ts

${chalk.dim('Run tests:')}
  npm run test
`));
    } catch (error) {
      s.stop('Test generation failed.');
      console.error(chalk.red(error));
      process.exit(1);
    }
    return;
  }

  s.start(`Generating ${name} route...`);

  try {
    await generateRoute(projectDir, name, config);
    s.stop(`Generated ${name} route successfully!`);
    
    const kebabName = toKebabCase(name);
    outro(chalk.green(`
✓ Route generated!

${chalk.cyan('Files created:')}
  src/controllers/${kebabName}.controller.ts
  src/services/${kebabName}.service.ts
  src/repositories/${kebabName}.repository.ts
    src/controllers/${kebabName}.controller.ts
    src/services/${kebabName}.service.ts
    src/repositories/${kebabName}.repository.ts
    src/api/routes/${kebabName}.routes.ts
  
  ${chalk.dim('Next steps:')}
  1. Register the route in your main router (src/api/router.ts)
  2. Add model to your ${config.orm === 'prisma' ? 'Prisma schema' : 'Drizzle schema'}
  3. Run migrations
  `));
    } catch (error) {
      s.stop('Generation failed.');
      console.error(chalk.red(error));
      process.exit(1);
    }
  }
  
  async function generateRoute(projectDir: string, name: string, config: ProjectConfig) {
    const srcDir = join(projectDir, 'src');
    const Name = capitalize(name);
    const kebabName = toKebabCase(name);
  
    // Create directories
    const dirs = ['controllers', 'services', 'repositories', 'api/routes'];
    for (const dir of dirs) {
      mkdirSync(join(srcDir, dir), { recursive: true });
    }
  
    // Generate files based on framework
    switch (config.framework) {
      case 'express':
        generateExpressRoute(srcDir, name, Name, kebabName);
        break;
      case 'hono':
        generateHonoRoute(srcDir, name, Name, kebabName);
        break;
      case 'fastify':
        generateFastifyRoute(srcDir, name, Name, kebabName);
        break;
    }
  
    // Generate shared files (service, repository)
    generateService(srcDir, name, Name, kebabName);
    generateRepository(srcDir, name, Name, kebabName, config.orm);
  }
  
  function generateExpressRoute(srcDir: string, name: string, Name: string, kebabName: string) {
    // Controller
    const controllerContent = `import { Request, Response, NextFunction } from 'express';
  import { ${Name}Service } from '../services/${kebabName}.service.js';
  
  export class ${Name}Controller {
    constructor(private ${name}Service: ${Name}Service) {}
  
    async getAll(req: Request, res: Response, next: NextFunction) {
      try {
        const items = await this.${name}Service.findAll();
        res.json(items);
      } catch (error) {
        next(error);
      }
    }
  
    async getById(req: Request, res: Response, next: NextFunction) {
      try {
        const item = await this.${name}Service.findById(req.params.id);
        if (!item) {
          return res.status(404).json({ message: '${Name} not found' });
        }
        res.json(item);
      } catch (error) {
        next(error);
      }
    }
  
    async create(req: Request, res: Response, next: NextFunction) {
      try {
        const item = await this.${name}Service.create(req.body);
        res.status(201).json(item);
      } catch (error) {
        next(error);
      }
    }
  
    async update(req: Request, res: Response, next: NextFunction) {
      try {
        const item = await this.${name}Service.update(req.params.id, req.body);
        res.json(item);
      } catch (error) {
        next(error);
      }
    }
  
    async delete(req: Request, res: Response, next: NextFunction) {
      try {
        await this.${name}Service.delete(req.params.id);
        res.status(204).send();
      } catch (error) {
        next(error);
      }
    }
  }
  `;
  
    // Routes
    const routesContent = `import { Router } from 'express';
  import { ${Name}Controller } from '../../controllers/${kebabName}.controller.js';
  import { ${Name}Service } from '../../services/${kebabName}.service.js';
  import { ${Name}Repository } from '../../repositories/${kebabName}.repository.js';
  import { db } from '../../db/index.js';
  
  const router = Router();
  
  // Dependency Injection
  const ${name}Repository = new ${Name}Repository(db);
  const ${name}Service = new ${Name}Service(${name}Repository);
  const ${name}Controller = new ${Name}Controller(${name}Service);
  
  router.get('/', (req, res, next) => ${name}Controller.getAll(req, res, next));
  router.get('/:id', (req, res, next) => ${name}Controller.getById(req, res, next));
  router.post('/', (req, res, next) => ${name}Controller.create(req, res, next));
  router.put('/:id', (req, res, next) => ${name}Controller.update(req, res, next));
  router.delete('/:id', (req, res, next) => ${name}Controller.delete(req, res, next));
  
  export default router;
  `;
  
    writeFileSync(join(srcDir, 'controllers', `${kebabName}.controller.ts`), controllerContent);
    writeFileSync(join(srcDir, 'api/routes', `${kebabName}.routes.ts`), routesContent);
  }

function generateHonoRoute(srcDir: string, name: string, Name: string, kebabName: string) {
  // Controller
  const controllerContent = `import { Context } from 'hono';
import { ${Name}Service } from '../services/${kebabName}.service.js';

export class ${Name}Controller {
  constructor(private ${name}Service: ${Name}Service) {}

  async getAll(c: Context) {
    const items = await this.${name}Service.findAll();
    return c.json(items);
  }

  async getById(c: Context) {
    const id = c.req.param('id');
    const item = await this.${name}Service.findById(id);
    if (!item) {
      return c.json({ message: '${Name} not found' }, 404);
    }
    return c.json(item);
  }

  async create(c: Context) {
    const body = await c.req.json();
    const item = await this.${name}Service.create(body);
    return c.json(item, 201);
  }

  async update(c: Context) {
    const id = c.req.param('id');
    const body = await c.req.json();
    const item = await this.${name}Service.update(id, body);
    return c.json(item);
  }

  async delete(c: Context) {
    const id = c.req.param('id');
    await this.${name}Service.delete(id);
    return c.body(null, 204);
  }
}
`;

  // Routes
  const routesContent = `import { Hono } from 'hono';
import { ${Name}Controller } from '../../controllers/${kebabName}.controller.js';
import { ${Name}Service } from '../../services/${kebabName}.service.js';
import { ${Name}Repository } from '../../repositories/${kebabName}.repository.js';
import { db } from '../../db/index.js';

const ${name}Routes = new Hono();

// Dependency Injection
const ${name}Repository = new ${Name}Repository(db);
const ${name}Service = new ${Name}Service(${name}Repository);
const ${name}Controller = new ${Name}Controller(${name}Service);

${name}Routes.get('/', (c) => ${name}Controller.getAll(c));
${name}Routes.get('/:id', (c) => ${name}Controller.getById(c));
${name}Routes.post('/', (c) => ${name}Controller.create(c));
${name}Routes.put('/:id', (c) => ${name}Controller.update(c));
${name}Routes.delete('/:id', (c) => ${name}Controller.delete(c));

export default ${name}Routes;
`;

  writeFileSync(join(srcDir, 'controllers', `${kebabName}.controller.ts`), controllerContent);
  writeFileSync(join(srcDir, 'api/routes', `${kebabName}.routes.ts`), routesContent);
}

function generateFastifyRoute(srcDir: string, name: string, Name: string, kebabName: string) {
  // Controller
  const controllerContent = `import { FastifyRequest, FastifyReply } from 'fastify';
import { ${Name}Service } from '../services/${kebabName}.service.js';

export class ${Name}Controller {
  constructor(private ${name}Service: ${Name}Service) {}

  async getAll(request: FastifyRequest, reply: FastifyReply) {
    const items = await this.${name}Service.findAll();
    return reply.send(items);
  }

  async getById(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    const item = await this.${name}Service.findById(request.params.id);
    if (!item) {
      return reply.status(404).send({ message: '${Name} not found' });
    }
    return reply.send(item);
  }

  async create(request: FastifyRequest<{ Body: unknown }>, reply: FastifyReply) {
    const item = await this.${name}Service.create(request.body);
    return reply.status(201).send(item);
  }

  async update(request: FastifyRequest<{ Params: { id: string }; Body: unknown }>, reply: FastifyReply) {
    const item = await this.${name}Service.update(request.params.id, request.body);
    return reply.send(item);
  }

  async delete(request: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    await this.${name}Service.delete(request.params.id);
    return reply.status(204).send();
  }
}
`;

  // Routes
  const routesContent = `import { FastifyInstance } from 'fastify';
import { ${Name}Controller } from '../../controllers/${kebabName}.controller.js';
import { ${Name}Service } from '../../services/${kebabName}.service.js';
import { ${Name}Repository } from '../../repositories/${kebabName}.repository.js';
import { db } from '../../db/index.js';

export default async function ${name}Routes(fastify: FastifyInstance) {
  // Dependency Injection
  const ${name}Repository = new ${Name}Repository(db);
  const ${name}Service = new ${Name}Service(${name}Repository);
  const ${name}Controller = new ${Name}Controller(${name}Service);

  fastify.get('/${kebabName}', ${name}Controller.getAll.bind(${name}Controller));
  fastify.get('/${kebabName}/:id', ${name}Controller.getById.bind(${name}Controller));
  fastify.post('/${kebabName}', ${name}Controller.create.bind(${name}Controller));
  fastify.put('/${kebabName}/:id', ${name}Controller.update.bind(${name}Controller));
  fastify.delete('/${kebabName}/:id', ${name}Controller.delete.bind(${name}Controller));
}
`;

  writeFileSync(join(srcDir, 'controllers', `${kebabName}.controller.ts`), controllerContent);
  writeFileSync(join(srcDir, 'api/routes', `${kebabName}.routes.ts`), routesContent);
}

function generateService(srcDir: string, name: string, Name: string, kebabName: string) {
  const content = `import { ${Name}Repository } from '../repositories/${kebabName}.repository.js';

export class ${Name}Service {
  constructor(private ${name}Repository: ${Name}Repository) {}

  async findAll() {
    return this.${name}Repository.findAll();
  }

  async findById(id: string) {
    return this.${name}Repository.findById(id);
  }

  async create(data: unknown) {
    return this.${name}Repository.create(data);
  }

  async update(id: string, data: unknown) {
    return this.${name}Repository.update(id, data);
  }

  async delete(id: string) {
    return this.${name}Repository.delete(id);
  }
}
`;

  writeFileSync(join(srcDir, 'services', `${kebabName}.service.ts`), content);
}

function generateRepository(srcDir: string, name: string, Name: string, kebabName: string, orm: 'prisma' | 'drizzle') {
  const content = `// Repository for ${Name}
// TODO: Implement database operations based on your ${orm} schema

export class ${Name}Repository {
  constructor(private db: unknown) {}

  async findAll() {
    // TODO: Implement
    // Example for Prisma: return this.db.${name}.findMany();
    throw new Error('Not implemented');
  }

  async findById(id: string) {
    // TODO: Implement
    // Example for Prisma: return this.db.${name}.findUnique({ where: { id } });
    throw new Error('Not implemented');
  }

  async create(data: unknown) {
    // TODO: Implement
    // Example for Prisma: return this.db.${name}.create({ data });
    throw new Error('Not implemented');
  }

  async update(id: string, data: unknown) {
    // TODO: Implement
    // Example for Prisma: return this.db.${name}.update({ where: { id }, data });
    throw new Error('Not implemented');
  }

  async delete(id: string) {
    // TODO: Implement
    // Example for Prisma: return this.db.${name}.delete({ where: { id } });
    throw new Error('Not implemented');
  }
}
`;

  writeFileSync(join(srcDir, 'repositories', `${kebabName}.repository.ts`), content);
}

async function generateTest(projectDir: string, name: string, config: ProjectConfig) {
  // Read package.json to get test runner choice
  const pkgPath = join(projectDir, 'package.json');
  const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'));
  const testRunner = pkg.kodkod?.testRunner || 'vitest';
  
  const testsDir = join(projectDir, 'tests', 'integration');
  mkdirSync(testsDir, { recursive: true });
  
  const Name = capitalize(name);
  const kebabName = toKebabCase(name);
  
  const templatesDir = getTestTemplateDir();
  const templatePath = join(
    templatesDir,
    config.framework,
    testRunner,
    'integration.template.ts'
  );
  
  if (!existsSync(templatePath)) {
    throw new Error(`Template not found: ${templatePath}`);
  }
  
  let template = readFileSync(templatePath, 'utf-8');
  
  template = template
    .replace(/\{\{Name\}\}/g, Name)
    .replace(/\{\{name\}\}/g, name)
    .replace(/\{\{kebabName\}\}/g, kebabName);
  
  writeFileSync(join(testsDir, `${kebabName}.test.ts`), template);
}
