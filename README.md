<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# JetShort - URL Shortener

A modern URL shortener built with Next.js, Clerk authentication, and PostgreSQL. Transform long URLs into short, memorable links.

## Prerequisites

- Node.js 18+
- PostgreSQL database (recommended: **Neon** for free tier, or Vercel Postgres for simplicity)
- Clerk account for authentication

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables. Create a `.env.local` file:
   ```bash
   # Clerk Authentication
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   CLERK_SECRET_KEY=your_clerk_secret_key

   # Database (PostgreSQL)
   DATABASE_URL=your_postgresql_connection_string
   ```

3. Set up the database:
   ```bash
   # Generate Prisma Client
   npm run db:generate

   # Push schema to database
   npm run db:push
   ```

4. Run the app:
   ```bash
   npm run dev
   ```
   
   The app will be available at http://localhost:3000

## Deployment on Vercel

### Option 1: Neon (Recommended - Free Tier Available)

1. Go to [neon.tech](https://neon.tech) and create a free account
2. Create a new project and copy the connection string (it will look like `postgresql://user:password@ep-xxx.us-east-2.aws.neon.tech/dbname?sslmode=require`)
3. Push your code to GitHub
4. Import the project in Vercel
5. Add environment variables in Vercel dashboard:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `CLERK_SECRET_KEY`
   - `DATABASE_URL` (paste your Neon connection string)
6. Deploy!

**Benefits of Neon:**
- ✅ Generous free tier (0.5 GB storage, unlimited compute time)
- ✅ Serverless PostgreSQL with auto-scaling
- ✅ Branching (create database branches like git branches)
- ✅ Great performance

### Option 2: Vercel Postgres (Simpler Setup)

1. Push your code to GitHub
2. Import the project in Vercel
3. In Vercel dashboard, go to your project → Storage → Create Database → Postgres
4. This automatically creates and injects the `DATABASE_URL` environment variable
5. Add Clerk environment variables:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `CLERK_SECRET_KEY`
6. Deploy!

**Benefits of Vercel Postgres:**
- ✅ Native Vercel integration (connection string automatically added)
- ✅ No manual database setup needed
- ✅ Simple UI in Vercel dashboard

### After Deployment

1. Run database migrations:
   ```bash
   # In Vercel, you can use the Vercel CLI or add a postinstall script
   npx prisma db push
   ```

   Or add to `package.json`:
   ```json
   "scripts": {
     "postinstall": "prisma generate"
   }
   ```

Vercel will automatically:
- Run `prisma generate` during build (if you add the postinstall script)
- Connect to your database
- Set up Clerk authentication

## Database Commands

```bash
# Generate Prisma Client
npm run db:generate

# Push schema changes to database
npm run db:push

# Open Prisma Studio (database GUI)
npm run db:studio
```
