# Post Stash

**Instagram Saved Posts Manager**

*Your personal vault for organizing and managing Instagram saved posts.*

## Overview

Have you ever saved so many Instagram posts that your Saved section became a mess?

Instagram's built-in Saved feature is useful, but it has some limitations when it comes to managing a large number of saved posts. Filtering posts by custom categories, organizing saved content, or identifying posts that haven't been assigned to any category can quickly become tedious.

That's why I built **Post Stash**.

Post Stash is a simple, standalone vault designed to help you organize and manage your Instagram saved posts outside of Instagram itself.

Instead of connecting directly to your Instagram account, Post Stash works by accepting Instagram post metadata in JSON format. Simply provide the metadata, paste it into the application, and the post will be stored in your personal vault.

No Instagram login, no account connection, and no complicated integration. Just a simple way to keep your saved posts organized.

## Why This Project?

The motivation behind this project comes from a few frustrations with Instagram's default Saved feature:

- **Limited filtering options** — There's no flexible way to filter saved posts based on custom categories or other criteria.
- **Unorganized saved posts** — As the number of saved posts grows, finding a particular post becomes increasingly difficult.
- **No clear overview of categorized posts** — It's not easy to identify which saved posts have already been organized into categories and which ones are still unorganized.
- **Tedious manual management** — Checking saved posts one by one just to figure out which ones need organizing is exhausting.

I wanted a separate place where I could manage my saved posts without having to deal with these limitations.

## How It Works

Post Stash uses Instagram post metadata in JSON format to store saved posts.

The recommended tool for obtaining this metadata is **[PostLens](https://shotmod.com/post-inspector/)** by shotMod.

PostLens allows you to inspect public Instagram posts and export their metadata as JSON. Post Stash is designed to work with this metadata format, so using other tools or metadata sources may result in incompatible input.

The workflow is simple:

1. Open [PostLens](https://shotmod.com/post-inspector/).
2. Paste the public Instagram post URL you want to add.
3. Inspect the post and export its metadata in JSON format.
4. Open Post Stash and paste the JSON into the provided input field.
5. Submit the data, and the post will be stored in your vault.
6. Organize, categorize, filter, and manage your saved posts from there.

**Note:** PostLens supports public Instagram posts only. Its JSON export is the recommended metadata source for Post Stash.

## Features

- [x] Add saved posts by pasting JSON metadata.
- [x] View all stored posts in one place.
- [x] Organize saved posts into categories.
- [x] Filter posts by category.
- [x] Search saved posts.
- [x] Identify saved posts that haven't been assigned to any category.
- [x] Manage saved posts more efficiently.

## Tech Stack

<div align="center">

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com/)

[![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=for-the-badge&logo=nestjs&logoColor=white)](https://nestjs.com/)
[![Drizzle ORM](https://img.shields.io/badge/Drizzle_ORM-C5F74F?style=for-the-badge&logo=drizzle&logoColor=black)](https://orm.drizzle.team/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)

</div>

## Getting Started

### Prerequisites

Make sure you have the following installed on your machine:

- [Node.js](https://nodejs.org/)
- [pnpm](https://pnpm.io/)
- [PostgreSQL](https://www.postgresql.org/)

### Installation

Clone the repository:

```bash
git clone https://github.com/nightpurrexe/poststash.git
cd poststash
```

Install backend dependencies:

```bash
cd backend
pnpm install
```

Install frontend dependencies:

```bash
cd ../frontend
pnpm install
```

### Environment Configuration

Create a `.env` file in both the `backend` and `frontend` directories.

**Backend (`backend/.env`):**

Configure your PostgreSQL connection:

```env
DATABASE_URL=postgresql://postgres:password@localhost:5432/my_database
```

Replace the connection details with your local PostgreSQL credentials and database name.

**Frontend (`frontend/.env`):**

Configure the backend API URL:

```env
VITE_API_URL=http://localhost:3000
```

Make sure the API URL matches the address where your backend server is running.

### Database Setup

Make sure your local PostgreSQL server is running.

Create a PostgreSQL database for the application, then navigate to the backend directory:

```bash
cd backend
```

Synchronize the database schema using Drizzle Kit:

```bash
pnpm db:push
```

This command synchronizes your PostgreSQL database structure with the application's Drizzle schema.

### Running the Application

Start the backend development server:

```bash
cd backend
pnpm start:dev
```

In a separate terminal, start the frontend development server:

```bash
cd frontend
pnpm dev
```

The backend and frontend should now be running locally.

## Limitations

There are some limitations worth knowing before using this application.

### No Instagram Account Integration

Post Stash does not support Instagram authentication or direct account integration.

It will not:

- Log in to your Instagram account.
- Automatically retrieve your saved posts.
- Synchronize your Instagram data.
- Access your Instagram account or its data directly.

The application is intentionally designed to remain a simple, standalone vault. Instagram account integration is not part of its current scope or future plans.

### Restricted Instagram Posts

Some Instagram posts, particularly age-restricted content, may not be accessible directly through the application.

When this happens, you'll need to open the original post in another browser or tab where you're already logged in to your Instagram account.

Post Stash stores post metadata, but it does not bypass Instagram's access restrictions.

### Metadata Compatibility

Post Stash is designed around the JSON metadata format provided by PostLens.

Metadata generated by other tools or services may use a different structure and might not be compatible with the application.

### Manual Metadata Input

Every post must be added by providing its metadata in JSON format. Post Stash does not automatically collect or import saved posts from your Instagram account.

## Disclaimer

Post Stash is an independent personal project. It is not affiliated with, endorsed by, sponsored by, or officially connected to Instagram, Meta Platforms, Inc., shotMod, or PostLens.

PostLens is a separate tool developed by shotMod and is recommended solely as a metadata source for Post Stash.

Instagram is a trademark of Meta Platforms, Inc.

All product names and trademarks belong to their respective owners.

---

*Built to make managing saved Instagram posts a little less painful.*