# XYB Wallet Assignment

A full-stack wallet application consisting of a Node.js backend API and a modern React frontend with TypeScript, Ant Design, and internationalization support.

## 🏗️ Project Structure

```
XYB/
├── 📁 backend/           # Node.js API server
│   ├── package.json      # Backend dependencies
│   └── src/              # API source code
├── 📁 xyb-wallet/        # React frontend application
│   ├── package.json      # Frontend dependencies
│   ├── src/              # React components and logic
│   └── public/           # Static assets
└── 📄 README.md          # This file
```

## 🚀 Tech Stack

### Backend

- **Runtime**: Node.js
- **Package Manager**: pnpm
- **API**: RESTful endpoints

### Frontend

- **Framework**: React with TypeScript
- **UI Library**: Ant Design
- **State Management**: TanStack Query (React Query)
- **Internationalization**: i18next
- **Package Manager**: pnpm

## 📋 Prerequisites

Before running this project, make sure you have the following installed:

- **Node.js** (v18 or higher) - [Download here](https://nodejs.org/)
- **pnpm** (package manager) - Install globally with: `npm install -g pnpm`

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd XYB
```

### 2. Start the Backend Server

```bash
# Navigate to backend directory
cd backend

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

### 3. Start the Frontend Application

Open a new terminal window and run:

```bash
# Navigate to frontend directory
cd xyb-wallet

# Install dependencies
pnpm install

# Start development server
pnpm dev
```

## 🌐 Access the Application

- **Frontend**: http://localhost:3000 (or the port shown in terminal)
- **Backend API**: http://localhost:8000 (or the port shown in terminal)

## 📁 Application Features

### Wallet Functionality

- User authentication and account management
- Wallet balance display and management
- Transaction history and details
- Multi-language support (internationalization)

### Technical Features

- **Responsive Design**: Works on desktop and mobile devices
- **Type Safety**: Full TypeScript implementation
- **Modern UI**: Clean, professional interface with Ant Design
- **State Management**: Efficient data fetching and caching with TanStack Query
- **Internationalization**: Support for multiple languages

## 🛠️ Development

### Available Scripts

#### Backend

```bash
cd backend
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
```

#### Frontend

```bash
cd xyb-wallet
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm preview      # Preview production build
pnpm lint         # Run ESLint
pnpm test         # Run tests
```

## 🔧 Project Configuration

### Backend Configuration

- API endpoints and server configuration
- Database connections (if applicable)
- Environment variables setup

### Frontend Configuration

- React configuration with TypeScript
- Ant Design theming and customization
- i18next language configuration
- TanStack Query setup for API communication

## 📦 Dependencies

### Backend Dependencies

Check `backend/package.json` for the complete list of dependencies.

### Frontend Dependencies

Key dependencies include:

- `react` & `react-dom` - Core React framework
- `typescript` - Type safety
- `antd` - UI component library
- `@tanstack/react-query` - Server state management
- `i18next` & `react-i18next` - Internationalization

## 🚀 Deployment

### Backend Deployment

1. Build the application: `pnpm build`
2. Set production environment variables
3. Start the server: `pnpm start`

### Frontend Deployment

1. Build the application: `pnpm build`
2. Deploy the `dist/` folder to your hosting service
3. Configure environment variables for API endpoints

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes and test thoroughly
4. Commit your changes: `git commit -m 'Add amazing feature'`
5. Push to the branch: `git push origin feature/amazing-feature`
6. Open a Pull Request

## 📄 License

This project is part of an assignment and follows the terms specified by XYB.

---

**Built with ❤️ using modern web technologies for a seamless wallet experience.**
