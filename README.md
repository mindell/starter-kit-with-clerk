# Next.js Starter Kit with Clerk Authentication

A modern, full-featured starter kit built with Next.js, featuring Clerk authentication, Strapi CMS, Stripe subscription integration, and Prisma ORM.

## Key Features

- 🔐 Clerk Authentication
- 📝 Strapi CMS Integration
- 💳 Stripe Subscription System
- 🗄️ Prisma ORM
- 📱 Responsive Design
- 🌐 SEO Optimized

## Setup Guide

### Prerequisites

- Node.js (Latest LTS version recommended)
- PostgreSQL database
- Stripe account
- Clerk account
- Strapi CMS instance

### Environment Variables

Copy `.env.example` to `.env` and configure the following variables:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=

# Strapi CMS
NEXT_PUBLIC_STRAPI_URL=
STRAPI_API_TOKEN=

# Stripe Integration
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=

# Database
DATABASE_URL=
```

### Clerk Authentication Setup

1. Create an account at [clerk.com](https://clerk.com)
2. Set up a new application
3. Copy the `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` to your `.env` file

### Strapi CMS Configuration

1. Copy the contents of the `strapi-content-types-schema` folder to your `[strapi-folder]/src/api` directory
2. Configure the following content types:
   - **Plan**: Manages subscription plan contents and Stripe Price IDs
   - **Page**: Creates pages accessible at `/page/[slug]`
   - **Category**: Creates category pages at `/blog/[category]`
   - **Articles**: Creates article pages at `/blog/[category]/[slug]`
   - **Author**: Manages article authors
3. Generate an API Token in Strapi (Settings > API Tokens)
   - Set Token duration to 'Unlimited'
   - Set Token type to 'Read Only'
4. Add the Strapi URL and API token to your environment variables

### Stripe Integration

1. Set up the required environment variables from your Stripe dashboard
2. Configure webhook endpoint at `/api/webhooks/stripe`
3. Subscribe to the following webhook events:
   - `invoice.payment_failed`
   - `invoice.finalized`
   - `invoice.paid`
   - `checkout.session.completed`

**Important Notes:**
- The current Stripe integration is optimized for Tiered subscription pricing model
- A free tier with the slug `free` in Strapi is required
- The subscription model assumes all subscriptions are active, defaulting to free tier when no paid subscription exists

### Prisma Database Setup

#### Using Supabase Database

1. Create a custom Prisma user with the following SQL:
```sql
-- Create custom user
create user "prisma" with password 'custom_password' bypassrls createdb;

-- Extend prisma's privileges to postgres
grant "prisma" to "postgres";

-- Grant schema permissions
grant usage on schema public to prisma;
grant create on schema public to prisma;
grant all on all tables in schema public to prisma;
grant all on all routines in schema public to prisma;
grant all on all sequences in schema public to prisma;
alter default privileges for role postgres in schema public grant all on tables to prisma;
alter default privileges for role postgres in schema public grant all on routines to prisma;
alter default privileges for role postgres in schema public grant all on sequences to prisma;
```

2. Set up your database URL in `.env`:
```
DATABASE_URL="postgres://[DB-USER].[PROJECT-REF]:[PRISMA-PASSWORD]@aws-0-us-east-1.pooler.supabase.com:5432/postgres"
```

3. Initialize the database:
```bash
npx prisma generate
npx prisma db push
```

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Support

For detailed documentation and support:
- [Clerk Documentation](https://clerk.com/docs)
- [Strapi Documentation](https://docs.strapi.io)
- [Stripe Documentation](https://stripe.com/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Supabase Database > ORM Quickstart > Prisma](https://supabase.com/docs/guides/database/prisma)
## License

MIT
