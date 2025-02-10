# Kupal-AI 🤖✨

A modern AI-powered chat application with Google authentication, featuring a sleek neon-themed interface and seamless user experience.

![Kupal-AI Screenshot](docs/screenshot.png)

## ✨ Features

- 🔐 Secure Google Authentication with email verification
- 💬 Real-time AI chat powered by OpenAI's GPT-4o
- 🎨 Modern neon-themed UI with smooth animations
- 📱 Responsive design for all devices
- 💾 Persistent chat history with PostgreSQL
- 🔄 Multiple chat conversations support

## 🚀 Tech Stack

- **Frontend**: React + Vite + TypeScript
- **Backend**: Express.js
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Firebase
- **AI**: OpenAI GPT-4o
- **Styling**: Tailwind CSS + shadcn/ui
- **Animations**: Framer Motion

## 🛠 Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL database
- Firebase account
- OpenAI API key

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/kupal-ai.git
cd kupal-ai
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

### 🔑 Configuration

#### Firebase Setup

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Add a web app to your project
4. Enable Google Authentication:
   - Go to Authentication > Sign-in methods
   - Enable Google sign-in
5. Add authorized domains:
   - Go to Authentication > Settings
   - Add your domain to authorized domains
6. Get your Firebase configuration:
   - Go to Project Settings > General
   - Find the Firebase SDK snippet
   - Copy the configuration values

#### Environment Variables

Fill in your `.env` file with:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_APP_ID=your-app-id

# Firebase Admin
FIREBASE_PRIVATE_KEY=your-private-key
FIREBASE_CLIENT_EMAIL=your-client-email

# OpenAI Configuration
OPENAI_API_KEY=your-openai-api-key

# Database Configuration
DATABASE_URL=your-database-url
```

### 🏃‍♂️ Development

1. Start the development server:
```bash
npm run dev
```

2. Open [http://localhost:5000](http://localhost:5000)

### 🚀 Deployment

Deploy to Replit:

1. Create a new Repl
2. Import from GitHub
3. Add your environment variables in Replit's Secrets tab
4. Click "Run"

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 💖 Acknowledgments

- [OpenAI](https://openai.com/) for the powerful GPT-4o model
- [shadcn/ui](https://ui.shadcn.com/) for beautiful UI components
- [Firebase](https://firebase.google.com/) for authentication
- [Replit](https://replit.com/) for hosting and development platform
