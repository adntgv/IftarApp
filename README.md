# Iftar App

A community-focused application for planning and sharing Iftar events during Ramadan.

## Features

- 🔐 **User Authentication**: Secure email & password authentication
- 📅 **Event Management**: Create, manage and share Iftar events
- 📨 **Invitations**: Invite friends and family via email
- 🔄 **RSVP System**: Manage attendance with a simple RSVP system
- 🔗 **Public Sharing**: Generate shareable links for your events
- 📱 **Responsive Design**: Works on both mobile and web

## Technology Stack

- **Frontend**: React Native with Expo
- **Backend**: Appwrite (self-hosted)
- **State Management**: Zustand
- **Authentication**: Appwrite Auth
- **Database**: Appwrite Database
- **Environment Management**: Expo Config

## Getting Started

### Prerequisites

- Node.js (v14 or newer)
- Yarn or npm
- Expo CLI (`npm install -g expo-cli`)
- An Appwrite instance (self-hosted or cloud)

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/iftar-app.git
cd iftar-app
```

2. Install dependencies
```bash
yarn install
# or
npm install
```

3. Set up your environment variables by creating a `.env` file:
```
EXPO_PUBLIC_APPWRITE_ENDPOINT=https://appwrite.adntgv.com/v1
EXPO_PUBLIC_APPWRITE_PROJECT_ID=67be273b00380449cff1
EXPO_PUBLIC_DATABASE_ID=67be2835003c542ca773
```

4. Set up your Appwrite project:
- Create a new project in your Appwrite console
- Create a database and collections according to the `appwrite.json` configuration
- Set up the correct permissions for each collection
- Enable email authentication

5. Start the development server
```bash
yarn start
# or
npm start
```

## Project Structure

```
iftar-app/
├── app/                 # Expo Router application screens
│   ├── (auth)/          # Authentication screens (login, signup)
│   ├── (tabs)/          # Main app tabs
│   └── _layout.tsx      # Root layout with authentication handling
├── components/          # UI components
│   ├── ui/              # Reusable UI components
│   └── ...              # Feature-specific components
├── utils/               # Utility functions
│   ├── appwrite.js      # Appwrite configuration
│   ├── env.js           # Environment variables
│   └── eventService.js  # Event-related API functions
├── hooks/               # Custom React hooks
│   ├── useAuth.js       # Authentication hook
│   └── useEvents.js     # Events management hook
├── constants/           # App constants
├── assets/              # Static assets
└── appwrite.json        # Appwrite collections and permissions config
```

## Deployment

### Deploying the Backend (Appwrite)

1. Set up your Appwrite instance (Docker recommended)
2. Import the `appwrite.json` configuration
3. Create users with appropriate roles
4. Configure authentication settings

### Deploying the App

#### Web
```bash
yarn build:web
# or
npm run build:web
```

#### Android/iOS
```bash
eas build --platform android
eas build --platform ios
```

## Contributing

We welcome contributions to the Iftar App! Please check out our [Contributing Guide](CONTRIBUTING.md) to get started.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgements

- The Muslim community for inspiration
- Appwrite for the backend infrastructure
- Expo and React Native for the development framework
