# Assignment Project

A full-stack application with React frontend and Node.js backend services.

## Project Structure

- **Client**: React frontend application (Vite)
- **MS1**: Main backend service (Port 5000)
- **MS2**: Audit service backend (Port 8002)

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- MongoDB database
- Cloudinary account (for file uploads)

## Installation

### 1. Clone the repository

```bash
git clone <your-repo-url>
cd "Assignment Project"
```

### 2. Install Client Dependencies

```bash
cd Client
npm install
```

### 3. Install MS1 Dependencies

```bash
cd ../MS1
npm install
```

### 4. Install MS2 Dependencies

```bash
cd ../MS2
npm install
```

## Environment Setup

### Client (.env)

Create a `.env` file in the `Client` directory:

```env
VITE_BACKEND_URL=http://localhost:5000
```

### MS1 (.env)

Create a `.env` file in the `MS1` directory:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

### MS2 (.env)

Create a `.env` file in the `MS2` directory:

```env
PORT=8002
MONGODB_URI=your_mongodb_connection_string
```

## Running the Application

### Start MS1 (Main Backend)

```bash
cd MS1
npm run dev
```

Server will run on `http://localhost:5000`

### Start MS2 (Audit Service)

```bash
cd MS2
npm run dev
```

Server will run on `http://localhost:8002`

### Start Client (Frontend)

```bash
cd Client
npm run dev
```

Frontend will run on `http://localhost:5173` (or the port Vite assigns)

## Available Scripts

### Client
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### MS1 & MS2
- `npm run dev` - Start development server with nodemon

## Technologies Used

- **Frontend**: React, Vite, Tailwind CSS, Axios
- **Backend**: Node.js, Express, MongoDB, Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **File Upload**: Multer, Cloudinary
- **Other**:  bcryptjs

## Notes

- Make sure MongoDB is running before starting the backend services
- Ensure all environment variables are properly configured
- The `.env` files are not tracked in git for security reasons

