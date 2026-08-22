# Email Template Builder

A modern, fast, and robust React application for building and managing email templates. This project leverages the power of modern web tools to provide an excellent developer experience and highly performant output.

## Tech Stack

This project is built with a cutting-edge frontend stack:

- **Framework**: React 19 + Vite
- **Routing**: [TanStack Router](https://tanstack.com/router)
- **Email Generation**: [React Email](https://react.email/) & [Nodemailer](https://nodemailer.com/)
- **Styling**: Tailwind CSS + [shadcn/ui](https://ui.shadcn.com/)
- **Linting & Formatting**: [Biome](https://biomejs.dev/)
- **Testing**: Vitest + React Testing Library

## Getting Started

### Prerequisites

- Node.js (v18+)
- Bun, pnpm, or npm (The project uses `bun.lock` indicating Bun is preferred)

### Installation

1. Clone the repository and install dependencies:
   ```bash
   bun install
   ```

2. Start the development server:
   ```bash
   bun run dev
   ```
   The application will be available at `http://localhost:3000`.

## Scripts

- `dev` - Starts the Vite development server on port 3000
- `build` - Builds the application for production
- `preview` - Locally preview the production build
- `test` - Runs unit tests using Vitest
- `format` - Formats the codebase using Biome
- `lint` - Lints the codebase using Biome
- `check` - Runs both formatting and linting checks

## Project Structure

```
├── public/             # Static assets
├── src/                # Application source code
│   ├── components/     # Reusable React components (including shadcn/ui)
│   ├── config/         # Application configuration
│   ├── context/        # React context providers
│   ├── lib/            # Utility functions
│   ├── routes/         # TanStack Router route definitions
│   └── types/          # TypeScript type declarations
├── package.json        # Project dependencies and scripts
└── vite.config.ts      # Vite configuration
```

## Contributing

Make sure to format and lint your code before committing:
```bash
bun run check
```
