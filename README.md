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