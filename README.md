# 📚 MERN Book App

A full-stack book management application built with the MERN stack (MongoDB, Express.js, React, Node.js) and Next.js.

![image](https://github.com/user-attachments/assets/082211cd-9dcc-4dae-b71c-9b89ba8c4255)

![image](https://github.com/user-attachments/assets/d8194eb6-d70a-4899-9d66-be4187c6ee15)


## ✨ Features

- 📖 **Book Management**: Add, edit, delete, and view books
- 🖼️ **Cover Images**: Display book covers with URL support
- 📱 **Responsive Design**: Optimized for desktop, tablet, and mobile
- 🔍 **Book Details**: Comprehensive book information display
- 🎨 **Modern UI**: Built with shadcn/ui and Tailwind CSS
- ⚡ **Fast Performance**: Optimized with Next.js and MongoDB
- 🛡️ **Error Handling**: Comprehensive validation and error management

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - Modern UI components
- **Lucide React** - Beautiful icons

### Backend
- **Express.js** - Node.js web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **Express Validator** - Input validation
- **CORS** - Cross-origin resource sharing
- **Helmet** - Security middleware

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local installation or MongoDB Atlas)
- npm or pnpm package manager

### 1. Clone the Repository
\`\`\`bash
git clone https://github.com/your-username/book-shelf-mern.git
cd book-shelf-mern
\`\`\`

### 2. Quick Setup & Run
\`\`\`bash
# Complete setup (installs dependencies, sets up environment, seeds database)
make quick-start

# Start both frontend and backend in development mode
make dev
\`\`\`

That's it! The app will be running at:
- **Frontend**: http://localhost:3000
- **Backend**: http://localhost:5000

## 📋 Manual Setup (Alternative)

If you prefer manual setup or don't have make installed:

### 1. Install Dependencies
\`\`\`bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server
npm install
cd ..
\`\`\`

### 2. Environment Configuration
\`\`\`bash
# Copy environment files
cp .env.example .env.local
cp server/.env.example server/.env
\`\`\`

### 3. Database Setup
\`\`\`bash
# Seed the database with sample books
cd server
npm run seed
cd ..
\`\`\`

### 4. Start the Application
\`\`\`bash
# Start backend (in one terminal)
cd server
npm run dev

# Start frontend (in another terminal)
npm run dev
\`\`\`

## 🎯 Available Make Commands

\`\`\`bash
make help              # Show all available commands
make quick-start       # Complete setup for new developers
make dev               # Start both frontend and backend
make dev-frontend      # Start only frontend
make dev-backend       # Start only backend
make setup             # Install all dependencies
make setup-env         # Copy environment files
make seed              # Seed database with sample data
make build             # Build frontend for production
make start             # Start both servers in production
make clean             # Clean node_modules and build files
make status            # Show project status
make health            # Check if servers are running
\`\`\`

## 🔧 API Endpoints

| Method | Endpoint            | Description            |
|--------|---------------------|------------------------|
| GET    | `/api/books`        | Get all books          |
| GET    | `/api/books/:id`    | Get single book        |
| POST   | `/api/books`       | Create new book        |
| PUT    | `/api/books/:id`   | Update book            |
| DELETE | `/api/books/:id`   | Delete book            |
| GET    | `/api/health`      | Health check           |

## 📱 Responsive Design

The application is fully responsive and optimized for:
- 📱 **Mobile devices** (320px and up)
- 📱 **Tablets** (768px and up)
- 💻 **Desktop** (1024px and up)
- 🖥️ **Large screens** (1280px and up)



## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide](https://lucide.dev/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)

---

**Happy Reading! 📚✨**
\`\`\`
