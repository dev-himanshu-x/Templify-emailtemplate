# Email Template Builder

A drag-and-drop email template builder built with React 19 and TanStack Start. Compose emails from ready-made blocks, tweak every property in a settings panel, and preview the result live inside laptop, tablet and phone device frames.

## Features

- **Drag-and-drop canvas**: drag blocks from the left sidebar, reorder them, nest them in columns, duplicate or delete them.
- **Block library**: headers, grid layouts (1/2 + 1/2, 1/3 + 2/3, 1/3 x 3), headings, text, inline snippets and links, buttons, images, dividers, feature lists, avatars, banners, feedback and review sections, and footers.
- **Per-block settings**: text, colours, alignment, links, images (with alt text) and padding, either as vertical/horizontal values or per side.
- **Email settings** (deselect any block): subject, preheader, page and email background, width, font, and optional dark-mode colours.
- **Responsive**: grid columns stack on phones by default (turn it off per layout). Preview in laptop, tablet and phone frames, with a dark-mode toggle.
- **Templates**: four starter templates, plus **My templates** (save, load, rename, duplicate, delete) kept in the browser.
- **My blocks**: click the bookmark on any block to save it, then add it to any email from the sidebar.
- **Undo / redo and autosave**: your work survives a reload.
- **Export**: copy or download HTML, copy the plain-text version, or save and import the template as JSON.
- **Checks**: warns about missing alt text, placeholder links, `data:` images, no footer, long subject lines, and HTML over Gmail's 102 KB clipping limit.
- **Send and Send test**: email it through your own SMTP account (see below).
- **Dynamic variables**: insert `{{name}}`, filled in per recipient when sending.

### Keyboard shortcuts

| Keys | Action |
| --- | --- |
| ⌘Z / ⇧⌘Z (Ctrl+Z / Ctrl+Y) | Undo / redo |
| Delete or Backspace | Remove the selected block |
| ⌘D (Ctrl+D) | Duplicate the selected block |
| ↑ / ↓ | Move the selected block up or down |
| Esc | Deselect |

Shortcuts are ignored while you are typing in a field.

## Tech Stack

- **Framework**: React 19, Vite, [TanStack Start](https://tanstack.com/start) and [TanStack Router](https://tanstack.com/router)
- **Email rendering**: [React Email](https://react.email/)
- **Drag and drop**: [react-dnd](https://react-dnd.github.io/react-dnd/)
- **Styling**: Tailwind CSS 4, [shadcn/ui](https://ui.shadcn.com/), [Base UI](https://base-ui.com/), Lucide icons
- **Tooling**: TypeScript, [Biome](https://biomejs.dev/), Vitest and React Testing Library

## Getting Started

### Prerequisites

- Node.js 18 or newer
- [Bun](https://bun.sh/) (the repository ships a `bun.lock`; pnpm or npm also work)

### Install and run

```bash
bun install
bun run dev
```

The app is served at <http://localhost:3000>.

## Scripts

| Script | Description |
| --- | --- |
| `dev` | Start the Vite dev server on port 3000 |
| `build` | Build for production |
| `preview` | Preview the production build locally |
| `test` | Run unit tests with Vitest |
| `format` | Format the codebase with Biome |
| `lint` | Lint the codebase with Biome |
| `check` | Run Biome formatting and lint checks together |

## Project Structure

```
├── public/                     # Static assets and manifest
├── src/
│   ├── components/
│   │   ├── blocks/             # Renderers for each block type
│   │   ├── builder/            # Canvas, sidebars, top bar and settings panels
│   │   │   └── devices/        # Laptop, tablet and mobile preview frames
│   │   ├── email/              # EmailTemplate (React Email output)
│   │   └── ui/                 # shadcn/ui primitives
│   ├── config/                 # Block catalogue and builder defaults
│   ├── context/                # Builder state provider
│   ├── lib/                    # Helpers
│   ├── routes/                 # TanStack Router routes
│   └── types/                  # Shared TypeScript types
├── biome.json
├── vite.config.ts
└── package.json
```

## Contributing

Run the checks before committing:

```bash
bun run check
```

## Sending email

Click **Send**, then fill in the dialog:

- **Your name / email / app password:** the account the email is sent from. Host and port are filled in automatically for Gmail, Outlook, Yahoo and iCloud. For other providers, open *Advanced: SMTP server*. Gmail needs an [app password](https://myaccount.google.com/apppasswords), not your normal password.
- **To:** up to 50 addresses, separated by commas or new lines. Each person gets their own copy, and `{{name}}` is replaced with their first name.
- **Subject:** set it in Email settings (deselect any block to see them).

The password is sent only to your own server to log in over SMTP. It is kept in memory and never saved in the browser. Your name, email and recipients are remembered for next time.

### Optional: preconfigured senders

To skip typing credentials, copy `.env.example` to `.env.local` and list accounts in `MAIL_ACCOUNTS`. They then appear in the dialog's **From account** dropdown, and their passwords stay on the server. Restart `bun run dev` after editing.

### Send test

**Send test** emails the template to the sender's own address with `[TEST]` in the subject. The first time in a session it opens the dialog to ask for the sender; after that it is one click, reusing that sender. The password is remembered in memory only, so a reload forgets it.

### Running it for others

The send endpoint has no login. It works out of the box in development, but a production build refuses to send unless you set `ALLOW_SEND=true`. Requests are limited to 10 per minute per client, 50 recipients per request, and SMTP hosts on private networks are rejected. Only enable sending on a server you trust, and put it behind your own authentication if it is reachable by others.

## Images

Images are referenced by URL, so host them somewhere public over https (your own site, S3, Cloudinary, Vercel Blob and so on). There is no upload feature, because an image that only exists on your machine would not load for recipients.

