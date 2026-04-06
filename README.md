<div align="center">

# 📝 BlogApp

A modern, full-stack blogging platform inspired by Medium and Threads — built with Next.js 15, NestJS, GraphQL, and PostgreSQL.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-nestjs--blog.vercel.app-blue?style=for-the-badge)](https://nestjs-blog.vercel.app)
[![Backend](https://img.shields.io/badge/API-Render-46E3B7?style=for-the-badge)](https://nestjs-blog-1.onrender.com/graphql)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

<!-- Add a screenshot here -->
<!-- ![BlogApp Screenshot](./docs/screenshot.png) -->

</div>

---

## ✨ Features

- 🔐 **Authentication** — Google & Facebook OAuth via Passport.js, JWT with HTTP-only cookies
- ✍️ **Rich Text Editor** — Tiptap editor with slash commands, bubble menu, inline link input
- 🖼️ **Image Uploads** — ImageKit CDN integration with drag & drop support
- 💬 **Comments & Replies** — Nested threaded comments with real-time optimistic updates
- ❤️ **Likes** — Toggle likes with optimistic UI and live count updates
- 🔖 **Categories & Tags** — Multi-select categories, auto-suggest tag input
- 🔍 **Search** — Debounced full-text search with URL-synced filters
- 📱 **Responsive** — Mobile-first design with bottom drawer navigation
- 🌙 **Dark Mode** — System-aware theme with manual toggle
- ♾️ **Infinite Scroll** — Feed and search results with IntersectionObserver
- 📊 **Reading Time** — Auto-calculated per post
- 📈 **Reading Progress Bar** — Scroll progress indicator on post pages
- 🗺️ **SEO** — Dynamic metadata, sitemap.xml, robots.txt, Open Graph tags
- ⚡ **Performance** — SSR + ISR, hover prefetch, batch DB queries, loading skeletons
- 🔒 **Security** — Rate limiting, input validation with Zod, CORS, Helmet

---

## 🛠️ Tech Stack

### Frontend

| Technology                  | Purpose                      |
| --------------------------- | ---------------------------- |
| **Next.js 15** (App Router) | React framework with SSR/ISR |
| **TypeScript**              | Type safety                  |
| **Apollo Client**           | GraphQL client with caching  |
| **Tailwind CSS v4**         | Styling                      |
| **shadcn/ui**               | UI component library         |
| **Tiptap**                  | Rich text editor             |
| **Zustand**                 | Client state management      |
| **next-themes**             | Dark mode                    |

### Backend

| Technology               | Purpose            |
| ------------------------ | ------------------ |
| **NestJS**               | Node.js framework  |
| **Bun**                  | JavaScript runtime |
| **GraphQL** (Code-first) | API layer          |
| **Drizzle ORM**          | Database ORM       |
| **PostgreSQL**           | Database           |
| **Passport.js**          | Authentication     |
| **JWT**                  | Session management |
| **Zod**                  | Schema validation  |
| **ImageKit**             | Image CDN          |

### Deployment

| Service             | Purpose             |
| ------------------- | ------------------- |
| **Vercel**          | Frontend hosting    |
| **Render**          | Backend hosting     |
| **Neon / Supabase** | PostgreSQL database |

---

## 📁 Folder Structure

```
nestjs-blog/
├── frontend/                     # Next.js application
│   ├── app/                      # App Router pages
│   │   ├── (auth)/               # Auth-related pages
│   │   ├── p/[slug]/             # Post detail page
│   │   ├── search/               # Search page
│   │   ├── layout.tsx            # Root layout
│   │   ├── page.tsx              # Home feed
│   │   ├── loading.tsx           # Feed skeleton
│   │   ├── sitemap.ts            # Dynamic sitemap
│   │   └── robots.ts             # Robots.txt
│   └── src/
│       ├── components/
│       │   ├── home/             # Feed, FeedCard
│       │   ├── layout/           # Header, CategoryStrip
│       │   ├── post/             # PostComp, Comments, ReadingProgress
│       │   ├── shared/           # InfoAvatar, SocialAction, Icons
│       │   └── ui/               # shadcn components
│       ├── graphql/
│       │   ├── queries/          # GraphQL queries
│       │   └── mutations/        # GraphQL mutations
│       ├── hooks/                # Custom React hooks
│       ├── lib/
│       │   ├── apollo-client.ts          # Browser Apollo client
│       │   └── apollo-server-client.ts   # Server Apollo client (SSR)
│       ├── modal/                # Dialog/Drawer modals
│       ├── providers/            # React context providers
│       ├── store/                # Zustand stores (auth, post, login modal)
│       └── types/                # TypeScript interfaces
│
└── backend/                      # NestJS application
    └── src/
        ├── common/
        │   ├── dto/              # Shared DTOs (pagination)
        │   ├── errors/           # Custom error classes
        │   ├── guards/           # GqlAuthGuard, GqlOptionalAuthGuard
        │   └── utils/            # Slug generator, etc.
        ├── config/               # App configuration
        ├── database/
        │   ├── schema/           # Drizzle schemas
        │   │   ├── user.schema.ts
        │   │   ├── post.schema.ts
        │   │   ├── category.schema.ts
        │   │   ├── tag.schema.ts
        │   │   ├── comment.schema.ts
        │   │   ├── like.schema.ts
        │   │   └── upload.schema.ts
        │   └── migrate.ts        # Migration runner
        └── modules/
            ├── auth/             # OAuth + JWT auth
            ├── posts/            # Posts CRUD + batch queries
            ├── categories/       # Category management
            ├── tags/             # Tag search & suggestions
            ├── comments/         # Nested comments
            ├── likes/            # Toggle likes
            └── uploads/          # ImageKit file uploads
```

---

## 🚀 Getting Started

### Prerequisites

- [Bun](https://bun.sh) >= 1.0
- [Node.js](https://nodejs.org) >= 20
- PostgreSQL database ([Neon](https://neon.tech) recommended)
- [ImageKit](https://imagekit.io) account (free tier)
- Google/Facebook OAuth credentials

### 1. Clone the repository

```bash
git clone https://github.com/AshishPal8/nestjs-blog.git
cd nestjs-blog
```

### 2. Setup Backend

```bash
cd backend
bun install
```

Create `.env` in `/backend`:

```env
DATABASE_URL=postgresql://user:password@host/dbname
JWT_SECRET=your_super_secret_key
NODE_ENV=development

# OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
FACEBOOK_APP_ID=your_facebook_app_id
FACEBOOK_APP_SECRET=your_facebook_app_secret
CALLBACK_URL=http://localhost:4000

# ImageKit
IMAGEKIT_PUBLIC_KEY=your_public_key
IMAGEKIT_PRIVATE_KEY=your_private_key
IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_id
```

Run migrations and start:

```bash
bun src/database/migrate.ts && bun --watch src/main.ts
```

Backend runs at `http://localhost:4000/graphql`

### 3. Setup Frontend

```bash
cd frontend
npm install
```

Create `.env.local` in `/frontend`:

```env
NEXT_PUBLIC_GRAPHQL_URL=http://localhost:4000/graphql
NEXT_PUBLIC_SITE_URL=http://localhost:3000
BACKEND_URL=http://localhost:4000
```

Start the dev server:

```bash
npm run dev
```

Frontend runs at `http://localhost:3000`

---

## 🗄️ Database Schema

```
users ──────────────── posts ──────────── post_categories ── categories
  │                      │
  │                      ├──────────────── post_tags ───────── tags
  │                      │
  ├── likes ─────────────┤
  │                      │
  └── comments ──────────┘
                         │
                    uploads (images)
```

Key design decisions:

- `posts.image_ids` — array of upload IDs for flexible image ordering
- `posts.likes_count` / `posts.comments_count` — cached counters to avoid expensive COUNT queries
- `comments.parent_id` — self-referencing for nested reply threads

---

## 🔌 GraphQL API

The API is available at `/graphql`. Key operations:

**Queries**

```graphql
posts(pagination: PaginationInput)        # Feed with pagination
postBySlug(slug: String!)                 # Single post
comments(postId: Int!, pagination: ...)   # Post comments
searchTags(input: SearchTagsInput!)       # Tag suggestions
activeCategories                          # Navigation categories
```

**Mutations**

```graphql
createPost(input: CreatePostInput!)       # Create a new post
toggleLike(input: ToggleLikeInput!)       # Like/unlike a post
createComment(input: CreateCommentInput!) # Add a comment
deleteComment(input: DeleteCommentInput!) # Remove a comment
uploadFile(file: Upload!)                 # Upload image to ImageKit
```

---

## ⚡ Performance Highlights

- **Batch DB queries** — all post relations (tags, categories, images, authors, likes) fetched in 2 parallel round trips instead of N+1
- **Hover prefetch** — post data prefetched into Apollo cache on mouse hover, navigation feels instant
- **SSR + ISR** — home page server-rendered and revalidated every 60 seconds
- **Zustand post cache** — post data stored client-side on hover so post page renders from cache immediately
- **Lazy loaded comments** — comments deferred with `React.lazy` + `Suspense` so post content appears first
- **Reading progress** — passive scroll listener with `requestAnimationFrame` throttling

---

## 🚢 Deployment

### Frontend (Vercel)

1. Push to GitHub
2. Import repo on [vercel.com](https://vercel.com)
3. Add environment variables
4. Deploy — auto-deploys on every push

### Backend (Render)

- **Build command:** `bun install`
- **Start command:** `bun src/database/migrate.ts && bun src/main.ts`
- Add all environment variables in Render dashboard

---

## 📸 Screenshots

> Add screenshots here after deployment

| Feed                     | Post Page                | Dark Mode                |
| ------------------------ | ------------------------ | ------------------------ |
| ![Feed](./docs/feed.png) | ![Post](./docs/post.png) | ![Dark](./docs/dark.png) |

---

## 🤝 Contributing

Pull requests are welcome. For major changes, please open an issue first.

---

## 📄 License

[MIT](LICENSE)

---

<div align="center">
  Made with ❤️ by <a href="https://github.com/AshishPal8">Ashish Pal</a>
</div>
