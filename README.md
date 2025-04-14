
# Smart Home Butler - Voice-Controlled Smart Home Assistant

**DISCLAIMER: This is a test project and not intended for commercial use.**

## Vision & Concept

Smart Home Butler is an innovative voice assistant that controls your smart home in a natural and intuitive way. The project aims to simplify the complexity of modern smart home systems through natural language commands.

### Key Features

- 🎤 **Voice Control**: Natural communication with your Smart Home
- 🏠 **Device Management**: Intelligent management of all Smart Home devices
- 🔄 **Automation**: Creation of scenes and routines
- 📊 **Dashboard**: Comprehensive visualization of all devices and their status
- 🔐 **Security**: Robust authentication and data privacy

## Technology Stack

The project leverages modern technologies for maximum performance and user-friendliness:

### Frontend
- **React** with **TypeScript** for type-safe development
- **Vite** as build tool for rapid development
- **Tailwind CSS** & **shadcn/ui** for responsive, modern design
- **React Query** for efficient state management

### Backend
- **Supabase** as Backend-as-a-Service
  - Realtime Database
  - Authentication
  - Row Level Security
  - Edge Functions
  - Storage

## Local Development

1. Clone the repository:
```bash
git clone <repository-url>
cd smart-home-butler
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

## Project Structure

```
src/
  ├── components/     # UI Components
  ├── pages/         # Main pages
  ├── store/         # State Management
  ├── lib/          # Utilities and Types
  └── integrations/  # External Services (Supabase)
```

## Ideas & Further Development

The project is in continuous development. Planned features:

- AI-powered automations
- Advanced energy management
- Integration of additional Smart Home systems
- Mobile app with React Native

## Contact & Contribution

Developed by Hussein Daoud

- GitHub: [hussein-da](https://github.com/hussein-da)
- For questions, ideas, or collaboration, please contact me via GitHub

## License

This project is exclusively intended for testing purposes and not approved for commercial use.
