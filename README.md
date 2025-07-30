# StoryWonderbook

Create magical, personalized storybooks for children with AI-powered story generation and character matching.

## 🚀 Features

- **AI-Powered Stories**: Advanced AI creates unique, engaging stories tailored to your preferences
- **Personalized Characters**: Create stories featuring your child as the main character
- **Family Friendly**: Safe, age-appropriate content that parents can trust
- **Responsive Design**: Works beautifully on all devices
- **Secure Authentication**: Powered by Clerk for secure user management

## 🛠️ Tech Stack

- **Framework**: Next.js 15.4.5 with App Router
- **Authentication**: Clerk
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **TypeScript**: Full type safety
- **Build Tool**: Turbopack

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout with Header & Footer
│   ├── page.tsx          # Landing page
│   ├── dashboard/        # User dashboard (protected)
│   ├── create-story/     # Story creation (protected)
│   ├── admin/           # Admin panel (protected)
│   ├── sign-in/         # Authentication pages
│   └── sign-up/
├── components/           # React components
│   ├── Header.tsx       # Navigation header
│   ├── Footer.tsx       # Site footer
│   └── ui/             # shadcn/ui components
├── hooks/               # Custom React hooks
│   └── useAuth.ts      # Authentication hook
├── lib/                # Utility functions
│   └── utils.ts
└── types/              # TypeScript type definitions
    └── index.ts
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Clerk account for authentication

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd storybook
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

Fill in your Clerk credentials in `.env.local`:
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_publishable_key
CLERK_SECRET_KEY=your_secret_key
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
```

4. Start the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📝 Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## 🔐 Authentication

The application uses Clerk for authentication with the following features:

- Secure sign-in/sign-up flow
- Protected routes with middleware
- User profile management
- Role-based access control (admin features)

### Protected Routes

- `/dashboard` - User dashboard
- `/create-story` - Story creation interface
- `/admin` - Admin panel (requires admin role)

## 🎨 UI Components

Built with shadcn/ui for consistent, accessible components:

- Button variants and sizes
- Dropdown menus
- Avatar components
- Responsive navigation
- Form components

## 🔧 Configuration

### Middleware

Route protection is handled by `middleware.ts` which:
- Protects authenticated routes
- Redirects unauthenticated users
- Handles role-based access

### TypeScript

Full TypeScript support with:
- Custom type definitions in `src/types/`
- Strict type checking
- Extended user interface for application-specific data

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Other Platforms

The application can be deployed to any platform that supports Next.js:
- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🙋‍♂️ Support

For support, please open an issue on GitHub or contact our team.

---

Made with ❤️ for children everywhere
