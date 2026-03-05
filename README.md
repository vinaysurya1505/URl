# Admin Entries App

A full-stack Next.js application for managing entries with topics and URLs. Features admin authentication and markdown-based storage.

## Features

- **Admin Authentication**: Secure login using environment variables
- **Admin Dashboard**: Add entries with Topic and URL fields
- **Public Homepage**: Display all entries in a numbered list
- **Markdown Storage**: Entries stored in `/content/entries.md`
- **Responsive UI**: Clean, minimal design with Tailwind CSS

## Tech Stack

- Next.js 14 (App Router)
- Tailwind CSS
- TypeScript
- Jose (JWT authentication)

## Project Structure

```
├── app/
│   ├── admin/
│   │   └── page.tsx          # Admin dashboard (protected)
│   ├── api/
│   │   ├── add-entry/
│   │   │   └── route.ts      # API to add entries
│   │   └── auth/
│   │       ├── login/
│   │       │   └── route.ts  # Login API
│   │       └── logout/
│   │           └── route.ts  # Logout API
│   ├── login/
│   │   └── page.tsx          # Login page
│   ├── globals.css           # Global styles
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Public homepage
├── components/
│   └── AdminDashboard.tsx    # Admin dashboard component
├── content/
│   └── entries.md            # Markdown file for storing entries
├── lib/
│   ├── auth.ts               # Authentication utilities
│   └── entries.ts            # Entry management utilities
├── middleware.ts             # Route protection middleware
├── .env.example              # Example environment variables
└── README.md
```

## Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env.local` and update the values:

```bash
cp .env.example .env.local
```

Edit `.env.local`:

```env
# Admin Credentials
ADMIN_ID=your-admin-id
ADMIN_PASSWORD=your-secure-password

# JWT Secret (use a long random string in production)
JWT_SECRET=your-super-secret-jwt-key-at-least-32-characters
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Usage

### Public Homepage

- Visit `/` to see all entries
- Entries are displayed in a numbered list with clickable URLs

### Admin Login

- Visit `/login` to access the admin login page
- Enter the Admin ID and Password configured in environment variables

### Admin Dashboard

- After logging in, you'll be redirected to `/admin`
- Fill in the Topic and URL fields
- Click "Add Entry" to save
- A success message will appear confirming the entry was added

## Deployment on Vercel

### Important Note About Data Persistence

**On Vercel's serverless environment, file system writes do NOT persist between deployments or function invocations.** The `/content/entries.md` file will reset to its initial state after each deployment.

For production use with persistent data, consider these alternatives:

1. **Database**: Use Vercel Postgres, PlanetScale, MongoDB Atlas, or Supabase
2. **Vercel KV/Blob**: Use Vercel's built-in storage solutions
3. **External Storage**: Store markdown files in GitHub (via API) or cloud storage

### Deployment Steps

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)

2. Import the project in Vercel Dashboard

3. Add environment variables in Vercel:
   - `ADMIN_ID`: Your admin username
   - `ADMIN_PASSWORD`: Your admin password
   - `JWT_SECRET`: A secure random string (32+ characters)

4. Deploy!

### For Local/Self-Hosted Deployment

If you're deploying to a traditional server where the file system persists:

```bash
npm run build
npm start
```

The markdown file storage will work correctly in this scenario.

## Entry Format

Entries are stored in `/content/entries.md` in the following format:

```markdown
# Entries

1. Topic: Example Topic
   URL: https://example.com

2. Topic: Another Topic
   URL: https://another-example.com
```

## Security Features

- HTTP-only cookies for JWT storage
- Server-side authentication checks
- Middleware protection for admin routes
- Credentials stored securely in environment variables
- CSRF protection via SameSite cookie attribute

## License

MIT
