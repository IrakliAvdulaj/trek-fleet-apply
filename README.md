# TRE Delivery - Courier Application Platform

A modern web application for courier applications and fleet management, built as a partner platform for Wolt delivery services.

## Project Overview

TRE Delivery is a comprehensive courier application platform that allows potential delivery partners to apply for courier positions and enables administrators to manage applications efficiently.

## Features

- **Multi-language Support**: Available in English and Albanian
- **User Authentication**: Secure sign-up and login system
- **Application Management**: Complete courier application workflow
- **Admin Dashboard**: Administrative interface for managing applications
- **Real-time Updates**: Live status updates for applications
- **Responsive Design**: Mobile-first design approach

## Technology Stack

- **Frontend**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: Radix UI primitives with shadcn/ui
- **Backend**: Supabase (PostgreSQL database, authentication, real-time)
- **Build Tool**: Vite
- **Deployment**: Ready for modern hosting platforms

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account and project

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd trek-fleet-apply
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env.local` file with your Supabase credentials:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Start the development server:
```bash
npm run dev
```

## Project Structure

```
src/
├── components/          # Reusable UI components
├── contexts/           # React contexts (Auth, Language)
├── hooks/              # Custom React hooks
├── integrations/       # External service integrations
├── lib/                # Utility functions
├── pages/              # Application pages/routes
└── styles/             # Global styles and design system
```

## Database Schema

The application uses Supabase with the following main tables:
- `profiles`: User profile information
- `applications`: Courier applications
- `user_roles`: User role management

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is proprietary software owned by TRE Delivery.