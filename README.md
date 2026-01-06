# kodkod

<p align="center">
  <img src="docs/public/logo.png" alt="kodkod logo" width="120" height="120" />
</p>

<h3 align="center">Small CLI. Big backends.</h3>

<p align="center">
  Production-ready backend boilerplate generator.<br/>
  Choose your framework, ORM, and database. Own every line of code.
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/kodkod-stack"><img src="https://img.shields.io/npm/v/kodkod-stack.svg" alt="npm version" /></a>
  <a href="https://github.com/SibilSoren/kodkod-stack/blob/main/LICENSE"><img src="https://img.shields.io/badge/license-MIT-blue.svg" alt="MIT license" /></a>
  <a href="https://github.com/SibilSoren/kodkod-stack"><img src="https://img.shields.io/github/stars/SibilSoren/kodkod-stack?style=social" alt="GitHub stars" /></a>
</p>

---

## ✨ Features

### 🚀 Quick Scaffolding
Generate a complete backend project in seconds with an interactive wizard or CLI flags.

### 🔧 Multiple Frameworks
- **Express** - Classic, flexible, battle-tested
- **Hono** - Ultrafast, modern, edge-ready
- **Fastify** - Performance-focused with built-in validation

### 🗄️ Multiple ORMs
- **Prisma** - Type-safe, auto-generated client
- **Drizzle** - Lightweight, SQL-like
- **Mongoose** - MongoDB-native ODM

### 💾 Multiple Databases
- **PostgreSQL** - Robust relational database
- **MySQL** - Popular relational database
- **MongoDB** - Flexible document database

### 🔐 Auth Module
Add JWT-based authentication with a single command:
```bash
npx kodkod-stack add auth
```

### 📦 Route Generator
Generate complete CRUD routes with controller, service, and repository:
```bash
npx kodkod-stack generate route products
```

### 🏗️ Clean Architecture
- Service-Controller-Repository pattern
- Manual dependency injection
- TypeScript-first with strict mode
- Ready for production

---

## 📦 Installation

```bash
# Interactive wizard
npx kodkod@latest my-api

# Or with flags
npx kodkod-stack@latest my-api --framework express --database postgresql --orm prisma
```

---

## 🚀 Quick Start

### 1. Create a new project
```bash
npx kodkod@latest my-api
```

### 2. Install dependencies
```bash
cd my-api
npm install
```

### 3. Configure your database
```bash
cp .env.example .env
# Edit .env with your database credentials
```

### 4. Run migrations
```bash
# Prisma
npx prisma migrate dev

# Drizzle
npx drizzle-kit push
```

### 5. Start the server
```bash
npm run dev
```

---

## 📖 Commands

| Command | Description |
|---------|-------------|
| `npx kodkod-stack [name]` | Create new project (interactive) |
| `npx kodkod-stack [name] --framework <f> --database <d> --orm <o>` | Create with flags |
| `npx kodkod-stack add auth` | Add JWT authentication |
| `npx kodkod-stack generate route <name>` | Generate CRUD route |
| `npx kodkod-stack g route <name>` | Short alias for generate |

### Flags

| Flag | Values |
|------|--------|
| `--framework` | `express`, `hono`, `fastify` |
| `--database` | `postgresql`, `mysql`, `mongodb` |
| `--orm` | `prisma`, `drizzle`, `mongoose` |

---

## 🗂️ Project Structure

```
my-api/
├── src/
│   ├── controllers/      # HTTP request handlers
│   ├── services/         # Business logic
│   ├── repositories/     # Data access layer
│   ├── routes/           # Route definitions
│   ├── middleware/       # Custom middleware
│   ├── config/           # Configuration files
│   ├── db/               # Database client
│   └── index.ts          # Entry point
├── prisma/ or drizzle/   # ORM configuration
├── .env.example          # Environment template
├── package.json
└── tsconfig.json
```

---

## 🌐 Web Builder

Use our [Visual Builder](https://kodkodstack.vercel.app/builder) to configure your stack and generate the CLI command!

---

## 📚 Documentation

Visit [kodkodstack.vercel.app/docs](https://kodkodstack.vercel.app/docs) for full documentation.

---

## 🤝 Contributing

Contributions are welcome! Please read our [Contributing Guide](CONTRIBUTING.md) for details.

---

## 📄 License

MIT © [kodkod](LICENSE)

---

## 💖 Support

If you find this project helpful, please consider giving it a ⭐ on GitHub!
