# Cardify

Cardify is a credit card management app I built to practice full-stack development and AI integration. It lets you add credit cards, create budgets, track your spending, and chat with an AI assistant that answers questions based on your own financial data. Everything is displayed in South African Rand.

**Live demo:** https://cardify-woad.vercel.app

> This is a portfolio project, so there's no real financial data involved. Card numbers are generated, and balances are calculated from the transactions you add rather than a real bank feed.
>
> The backend runs on Render's free tier, so if the app hasn't been used in a while, the first request may take 30–60 seconds to wake up. After that, everything runs normally.

<!-- Add screenshots here later
![Dashboard](docs/dashboard.png)
-->

## Features

- Add and manage credit cards
- Create monthly budgets by category
- Log transactions and automatically update card balances
- View spending insights with charts and analytics
- Chat with an AI assistant that understands your financial data
- Sign in with email/password or Google
- Manage your profile, password, notifications, and account settings

## Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React, TypeScript, Vite, Material UI, Recharts |
| Backend | ASP.NET Core 8 (Web API), Entity Framework Core |
| Database | PostgreSQL |
| Authentication | JWT + Google OAuth |
| AI | Groq (`llama-3.3-70b-versatile`) with a swappable provider setup |
| Hosting | Vercel (Frontend), Render (Backend), Neon (PostgreSQL) |

## What I enjoyed building

### AI Assistant

The AI doesn't give generic financial advice. It uses the user's own cards, budgets, and transactions to answer questions about their spending. I also built it with a provider interface, so switching between Ollama for development and Groq for production only requires a configuration change.

### Authentication

Users can sign in with either email/password or Google. Regardless of how they log in, the app uses the same JWT authentication flow behind the scenes, which keeps everything consistent.

### PostgreSQL Migration

I originally built the project with SQL Server before moving everything to PostgreSQL. It gave me hands-on experience with database migrations, UTC datetime handling, and supporting users who sign in through OAuth without passwords.

### Deployment

Deploying the app was a great learning experience. I containerised the API, configured environment variables and CORS, connected the frontend, backend, and database, and worked through real deployment issues like Linux case-sensitive paths and CORS preflight requests.

## Running the project locally

You'll need:

- .NET 8 SDK
- Node.js
- PostgreSQL (installed locally or running in Docker)

### Backend

```bash
cd cardify-backend/Cardify.API
dotnet restore

# Store secrets locally (never commit them)
dotnet user-secrets set "ConnectionStrings:DefaultConnection" "Host=localhost;Port=5432;Database=cardify;Username=postgres;Password=yourpassword"
dotnet user-secrets set "Jwt:Key" "a-long-random-secret-key"
dotnet user-secrets set "Ai:Provider" "Groq"          # or "Ollama"
dotnet user-secrets set "Groq:ApiKey" "your-groq-key"

dotnet ef database update
dotnet run
```

### Frontend

```bash
cd cardify-frontend
npm install

# Create a .env file
# VITE_API_BASE_URL=http://localhost:5271/api
# VITE_GOOGLE_CLIENT_ID=your-google-client-id

npm run dev
```

Once both projects are running, create an account (or sign in with Google), add your first card, and start exploring the app.

## Future Improvements

- Add Microsoft sign-in
- Add a dark/light mode toggle
- Improve the mobile experience
- Allow custom transaction dates for better monthly trend analysis

---

Thanks for checking out Cardify!

I built this project to strengthen my full-stack development skills while learning more about authentication, AI integration, PostgreSQL, and deploying real-world applications.

Feedback, suggestions, and contributions are always welcome.
