# How to Run Locally

## Prerequisites

Make sure you have Node.js installed (version 18 or higher recommended).

## Quick Start

### Option 1: Frontend Only (Recommended - No Backend Needed)

Since this app uses localStorage and doesn't require a backend, you can run just the frontend:

1. **Navigate to the project folder:**
   ```bash
   cd RoutineFlow
   ```

2. **Install dependencies (first time only):**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev:client
   ```

4. **Open your browser:**
   - The app will be available at: `http://localhost:5000`
   - The terminal will show you the exact URL

### Option 2: Full Stack (Client + Server)

If you want to run the full application with the backend:

1. **Navigate to the project folder:**
   ```bash
   cd RoutineFlow
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

   **Note for Windows users:** If you get an error with `NODE_ENV=development`, you can:
   - Use Git Bash or WSL
   - Or modify the script in `package.json` to use `cross-env`
   - Or just use Option 1 (frontend only) which works fine

4. **Open your browser:**
   - The app will be available at: `http://localhost:5000`

## Troubleshooting

### Port Already in Use
If port 5000 is already in use, you can:
- Stop the other application using that port
- Or modify the port in `package.json` script: `vite dev --port 3000`

### Dependencies Not Installing
```bash
# Clear cache and reinstall
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Build for Production
To build the app for production:
```bash
npm run build:client
```

The built files will be in the `dist/public` folder.

## Development Tips

- The app uses **Hot Module Replacement (HMR)**, so changes will automatically refresh in the browser
- All data is stored in your browser's localStorage
- No database setup required for the frontend to work

