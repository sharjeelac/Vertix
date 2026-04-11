# Vertix

Vertix is a modern video upload and showcase platform built with Next.js App Router, NextAuth, MongoDB, and ImageKit.

## Short Description

Securely register and log in, upload video plus thumbnail files to ImageKit, and publish entries to a clean creator dashboard.

## Features

- Credentials-based authentication with NextAuth
- User registration API with password hashing
- Protected create-video workflow
- ImageKit upload integration for videos and thumbnails
- Responsive UI redesign for Home, Login, and Register pages
- Video listing feed from MongoDB

## Tech Stack

- Next.js 16 (App Router)
- TypeScript
- NextAuth
- MongoDB + Mongoose
- ImageKit
- Tailwind CSS v4

## Environment Variables

Create a .env.local file with the following values:

```env
MONGODB_URI=
NEXTAUTH_SECRET=
NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY=
IMAGEKIT_PRIVATE_KEY=
NEXT_PUBLIC_IMAGEKIT_ENDPOINT=
```

## Run Locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Validation Commands

```bash
npm run lint
npm run build
```

## Recent Updates

- Fixed auth flow and credentials checks
- Completed uploader logic with validation, progress, and error handling
- Built working Home dashboard for upload and listing
- Improved register API response consistency
- Fixed middleware matcher and protected route behavior
- Resolved TypeScript and Mongoose typing/build issues
- Added polished and consistent UI redesign across Home, Login, and Register
