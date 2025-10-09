# CyferNova - Interactive Tile Experience

An innovative interactive tile board with stunning GSAP-powered animations built with Next.js 15 and React 19.

![CyferNova](./public/cyfernova.png)

## ✨ Features

- 🎨 **Interactive Tile Board**: 6x6 grid of animated tiles with hover effects
- 🔄 **Flip Animation**: Smooth tile flip transitions with GSAP
- 🎯 **Block Highlight Effect**: Mouse-tracking highlight system
- ⚡ **High Performance**: Optimized with RAF, throttling, and DocumentFragment
- 🚀 **Next.js 15**: Latest Next.js with Turbopack
- 📱 **Responsive Design**: Works seamlessly across all devices
- 🎭 **Storybook Integration**: Component documentation and testing
- 🔒 **Security Headers**: Comprehensive security configuration
- 📊 **SEO Optimized**: Complete metadata, Open Graph, and Twitter cards
- 🤖 **CI/CD Pipeline**: Automated testing and deployment with GitHub Actions

## 🛠️ Tech Stack

- **Framework**: Next.js 15.5.4 (App Router)
- **React**: 19.1.0
- **Animation**: GSAP 3.13.0
- **Styling**: Tailwind CSS 4
- **TypeScript**: 5.x
- **Linting**: Biome + ESLint
- **Testing**: Vitest + Playwright
- **Documentation**: Storybook 9.x
- **Deployment**: Vercel

## 🚀 Getting Started

### Prerequisites

- Node.js 20 or higher
- pnpm (recommended) or npm/yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd cn-website
```

2. Install dependencies:
```bash
pnpm install
```

3. Run the development server:
```bash
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Development Commands

```bash
# Development
pnpm dev                 # Start dev server with Turbopack
pnpm build              # Build for production
pnpm start              # Start production server

# Code Quality
pnpm lint               # Run all linters
pnpm lint:biome         # Run Biome linter
pnpm lint:eslint        # Run ESLint
pnpm format             # Format code with Biome
pnpm type-check         # TypeScript type checking

# Storybook
pnpm storybook          # Start Storybook dev server
pnpm build-storybook    # Build Storybook static site
```

## 📁 Project Structure

```
cn-website/
├── .github/
│   ├── workflows/       # GitHub Actions workflows
│   └── VERCEL_SETUP.md  # Vercel deployment guide
├── app/
│   ├── api/
│   │   └── health/      # Health check endpoint
│   ├── layout.tsx       # Root layout with metadata
│   ├── page.tsx         # Home page
│   ├── robots.ts        # Robots.txt generation
│   ├── sitemap.ts       # Sitemap generation
│   └── manifest.ts      # PWA manifest
├── components/
│   └── Hero.tsx         # Main interactive tile board
├── public/              # Static assets
├── stories/             # Storybook stories
├── next.config.ts       # Next.js configuration
├── vercel.json          # Vercel configuration
└── OPTIMIZATIONS.md     # Detailed optimization guide
```

## 🎨 Components

### Hero (TileBoard)

The main interactive component featuring:
- 6x6 grid of animated tiles
- Hover-triggered tile animations
- Flip all tiles button
- Mouse tracking highlight effect
- Optimized performance with RAF and throttling

## 🔄 CI/CD

### GitHub Actions Workflows

1. **Main CI/CD Pipeline** (`.github/workflows/ci.yml`)
   - Runs on push and PR to main/develop branches
   - Type checking, linting, and building
   - Automatic Vercel preview deployments for PRs
   - Production deployment on main branch

2. **Lighthouse CI** (`.github/workflows/lighthouse.yml`)
   - Performance audits on PRs
   - Automated reports with scores

### Setup Vercel Deployment

See [.github/VERCEL_SETUP.md](.github/VERCEL_SETUP.md) for detailed instructions on configuring GitHub secrets for Vercel deployment.

Required secrets:
- `VERCEL_TOKEN`
- `VERCEL_ORG_ID`
- `VERCEL_PROJECT_ID`

## 🎯 Performance Optimizations

This project includes comprehensive performance optimizations:

- ✅ Image optimization (AVIF/WebP)
- ✅ Font optimization with `display: swap`
- ✅ Bundle size optimization
- ✅ Code splitting and tree shaking
- ✅ Security headers
- ✅ Caching strategies
- ✅ DOM optimization with DocumentFragment
- ✅ Animation optimization with RAF
- ✅ Event throttling
- ✅ Passive event listeners

See [OPTIMIZATIONS.md](./OPTIMIZATIONS.md) for complete details.

## 🔒 Security

- Comprehensive security headers (HSTS, CSP, etc.)
- XSS protection
- Clickjacking protection
- MIME type sniffing protection
- Permissions policy

## 📊 Monitoring

- Health check endpoint: `/api/health`
- Vercel Analytics (built-in)
- Lighthouse CI on PRs

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Quality

- Run linting before committing: `pnpm lint`
- Format code: `pnpm format`
- Type check: `pnpm type-check`
- Pre-commit hooks are configured with Husky

## 📝 License

This project is private and proprietary.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org) - The React framework
- [GSAP](https://greensock.com/gsap/) - Animation library
- [Vercel](https://vercel.com) - Hosting platform
- [Tailwind CSS](https://tailwindcss.com) - Styling framework

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [GSAP Documentation](https://greensock.com/docs/)
- [Vercel Deployment](https://vercel.com/docs)
- [Performance Optimization Guide](./OPTIMIZATIONS.md)

---

Built with ❤️ by the CyferNova Team
