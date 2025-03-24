# Next.js Authentication System

Website: [Fullstack Coding Assignment](https://fullstack-coding-assignment.vercel.app/)

This is a basic authentication system built using Next.js, allowing users to sign in via email (magic link) or Google authentication. Users can update their profile details, such as name and profile picture. The profile picture is stored using IPFS via Pinata API, and PostgreSQL is used as the database, deployed on Railway. The website is deployed on Vercel.

## Features

- **Authentication Methods:**
  - Email-based login using a magic link (via Gmail SMTP server)
  - Google OAuth authentication (via Google Cloud Credentials)
- **User Profile Management:**
  - Users can update their name
  - Users can upload and update their profile picture, stored on IPFS via Pinata API
- **Security:**
  - JWT tokens are used for temporary storage
  - NextAuth.js for authentication handling
- **Database:**
  - PostgreSQL used for storing user information
  - Hosted on Railway
- **Deployment:**
  - Frontend and authentication system deployed on Vercel

## Environment Variables

Create a `.env.local` file in the root directory and add the following environment variables:

```env
# NextAuth Configuration
NEXTAUTH_URL=

# Email Server Configuration (Gmail SMTP)
EMAIL_SERVER_HOST=
EMAIL_SERVER_PORT=
EMAIL_SERVER_USER=
EMAIL_SERVER_PASSWORD=
EMAIL_FROM=

# Google OAuth Credentials
AUTH_GOOGLE_ID=
AUTH_GOOGLE_SECRET=

# NextAuth Secret Key
AUTH_SECRET=

# Database Configuration (PostgreSQL on Railway)
AUTH_DATABASE_HOST=
AUTH_DATABASE_PORT=
AUTH_DATABASE_NAME=
AUTH_DATABASE_USER=
AUTH_DATABASE_PASSWORD=

# Pinata API Keys for IPFS Storage
NEXT_PUBLIC_PINATA_API_KEY=
NEXT_PUBLIC_PINATA_SECRET_KEY=
```

## Installation and Setup

1. Clone the repository:
   ```sh
   git clone https://github.com/your-repo.git
   cd your-repo
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Set up environment variables in `.env.local`.
4. Run the development server:
   ```sh
   npm run dev
   ```
5. Open the app in your browser at `http://localhost:3000`.

## Deployment

- The frontend and authentication system are deployed on **Vercel**.
- The database is hosted on **Railway**.

## Technologies Used

- **Next.js** - React framework for server-side rendering
- **NextAuth.js** - Authentication provider for Next.js
- **Google OAuth 2.0** - Used for Google login
- **Gmail SMTP** - Used for email-based authentication (magic link)
- **PostgreSQL** - Database for storing user data
- **Railway** - Cloud-hosted PostgreSQL database
- **IPFS & Pinata API** - Used for storing profile pictures on the decentralized web
- **JWT Tokens** - Used for temporary storage of authentication sessions
- **Vercel** - Deployment platform for frontend and backend

## License

This project is licensed under the MIT License.