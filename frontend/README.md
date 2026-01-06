# Task Management Frontend

React + Vite frontend for Task Management System.

## Tech Stack
- React 18
- Vite
- Tailwind CSS
- React Router v6
- Axios
- Zustand

## Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Run Development Server**
   ```bash
   npm run dev
   ```

3. **Build for Production**
   ```bash
   npm run build
   ```

## Environment Variables

Create a `.env` file in the root directory:
```
VITE_API_URL=http://localhost:8080/api
```

## Project Structure

```
src/
  ├── components/     # Reusable components
  ├── pages/          # Page components
  ├── services/       # API services
  ├── store/          # Zustand stores
  ├── App.jsx         # Main app component
  └── main.jsx        # Entry point
```

