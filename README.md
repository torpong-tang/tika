# TIKA - Defect Tracker

A modern defect tracking web application with Jira-like features, built with Next.js, Prisma, and MySQL.

## Features

- **Dashboard** - Overview with statistics, charts, and recent issues
- **Issues** - Create, edit, delete, filter issues with table view
- **Board** - Kanban board with drag-and-drop status changes
- **Projects** - Manage projects with issue tracking
- **Bilingual** - English/Thai language toggle
- **Modern UI** - Dark blue and orange theme

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TailwindCSS, Lucide Icons
- **Backend**: Next.js API Routes
- **Database**: MySQL with Prisma ORM
- **Language**: TypeScript

## Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Configure database
Edit `.env` and set your MySQL connection:
```
DATABASE_URL="mysql://root:password@localhost:3306/tika_defect_tracker"
```

### 3. Create database and push schema
```bash
npx prisma db push
```

### 4. Seed sample data
```bash
npm run db:seed
```

### 5. Start development server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Management

- **Prisma Studio**: `npm run db:studio` - Visual database editor
- **Push schema**: `npm run db:push` - Sync schema to database
- **Seed data**: `npm run db:seed` - Insert sample data
