# LeafyGo

A modern web application built with React frontend and Node.js backend.

## Tech Stack

- **Frontend**: React, Vite, Tailwind CSS
- **Backend**: Node.js, Express
- **Database**: MongoDB
- **Package Manager**: npm

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm
- MongoDB

### Installation

1. Clone the repository:
```bash
git clone [your-repository-url]
cd leafygo
```

2. Install frontend dependencies:
```bash
npm install
```

3. Install backend dependencies:
```bash
cd server
npm install
```

4. Create a `.env` file in the server directory:
```bash
cd server
# Copy the example file and edit with your values
```

5. Start the development servers:

Frontend:
```bash
npm run dev
```

Backend:
```bash
cd server
npm start
```

## Project Structure

```
leafygo/
├── src/                    # React frontend
│   ├── components/         # Reusable components
│   ├── pages/             # Page components
│   ├── App.jsx            # Main app component
│   └── main.jsx           # Entry point
├── server/                 # Node.js backend
│   ├── models/            # Database models
│   ├── scripts/           # Utility scripts
│   └── server.js          # Main server file
├── package.json           # Frontend dependencies
└── README.md             # Project documentation
```

## Available Scripts

- `npm run dev` - Start Vite development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm start` - Start backend server (from server directory)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
