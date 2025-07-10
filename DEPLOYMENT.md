# Deployment Guide

## Environment Variables Setup

This application requires several environment variables to function properly. Here's how to set them up for different environments:

### Required Environment Variables

#### Database
```
MONGODB_URI=your_mongodb_connection_string
```

#### NextAuth.js (Authentication)
```
NEXTAUTH_SECRET=your_random_secret_string_32_chars_or_more
NEXTAUTH_URL=https://your-domain.com (or http://localhost:3000 for development)
```

#### Optional: Google OAuth (for Google sign-in)
```
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

#### Optional: Pusher (for real-time collaboration)
```
PUSHER_APP_ID=your_pusher_app_id
PUSHER_KEY=your_pusher_key
PUSHER_SECRET=your_pusher_secret
PUSHER_CLUSTER=your_pusher_cluster
NEXT_PUBLIC_PUSHER_KEY=your_pusher_key
NEXT_PUBLIC_PUSHER_CLUSTER=your_pusher_cluster
```

#### Optional: Email Configuration
```
EMAIL_FROM=noreply@yourdomain.com
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

## Vercel Deployment

### Setting Environment Variables in Vercel

1. Go to your Vercel dashboard
2. Select your project
3. Go to Settings → Environment Variables
4. Add each required environment variable:

**Required for basic functionality:**
- `MONGODB_URI`: Your MongoDB connection string
- `NEXTAUTH_SECRET`: Generate a random string (32+ characters)
- `NEXTAUTH_URL`: Your production URL (e.g., `https://yourapp.vercel.app`)

**Google OAuth (if configured in .env.local):**
- `GOOGLE_CLIENT_ID`: Copy from your local .env.local file
- `GOOGLE_CLIENT_SECRET`: Copy from your local .env.local file

**Pusher (if configured for real-time collaboration):**
- `PUSHER_APP_ID`: Copy from your local .env.local file
- `PUSHER_KEY`: Copy from your local .env.local file
- `PUSHER_SECRET`: Copy from your local .env.local file
- `PUSHER_CLUSTER`: Copy from your local .env.local file
- `NEXT_PUBLIC_PUSHER_KEY`: Same as PUSHER_KEY
- `NEXT_PUBLIC_PUSHER_CLUSTER`: Same as PUSHER_CLUSTER

**Optional (only add if you want these features):**
- Email variables (if you want email functionality)

### Generating NEXTAUTH_SECRET

You can generate a secure secret using:
```bash
openssl rand -base64 32
```

Or use an online generator for a random 32+ character string.

## Local Development

1. Copy `.env.example` to `.env.local`
2. Fill in the required values
3. Comment out any optional services you don't need
4. Restart your development server: `npm run dev`

## Troubleshooting

### "Server configuration error"
- This usually means missing or invalid `NEXTAUTH_SECRET` or `NEXTAUTH_URL`
- Make sure these are set in your production environment

### Build failures
- Check that all required environment variables are available during build
- The app is designed to build successfully even with missing optional variables

### Database connection issues
- Verify your `MONGODB_URI` is correct and accessible
- The app will gracefully handle missing database connections during build

## Security Note

**Important**: The `.env.local` file contains sensitive credentials and is automatically ignored by git (see `.gitignore`). Never commit actual credentials to your repository. The actual values are only stored locally and in your production environment variables.

## Feature Availability

The application is designed to work with minimal configuration:

- **Core functionality**: Requires only `MONGODB_URI`, `NEXTAUTH_SECRET`, and `NEXTAUTH_URL`
- **Google Sign-in**: Requires Google OAuth variables (configured in `.env.local`)
- **Real-time collaboration**: Requires Pusher variables (configured in `.env.local`)
- **Email notifications**: Requires email configuration variables

Missing optional variables will simply disable those features without breaking the app.