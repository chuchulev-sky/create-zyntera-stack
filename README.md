# create-zyntera-stack

Scaffold a new Zyntera fullstack app from the official template.

## Quick Start (Recommended)

### 1) Create a new app

```bash
npm create zyntera-stack@latest my-app
```

You can also use:

```bash
npx create-zyntera-stack my-app
```

### 2) Move into the new project

```bash
cd my-app
```

### 3) Run database migration

```bash
npm run db:migrate
```

### 4) Start development

```bash
npm run dev
```

## Important Note About `npm i`

`npm i create-zyntera-stack` only installs the package.  
It does **not** start the scaffolder automatically.

If you installed it with `npm i`, run one of these next:

```bash
npx create-zyntera-stack my-app
```

or:

```bash
npm create zyntera-stack@latest my-app
```

## Troubleshooting

- If you see "Target directory already exists", use a new project name or delete the existing folder.
- If install fails, check Node/npm versions and network access, then rerun.
- If terminal width is narrow, the CLI may show compact branding instead of full ASCII art.
