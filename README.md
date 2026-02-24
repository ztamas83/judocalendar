# Welcome to Remix!

- 📖 [Remix docs](https://remix.run/docs)

## Development

### Local Development with Firebase Emulators

This project is configured to run entirely locally using Firebase Emulators for Auth and Firestore. No cloud connection needed for development!

#### Quick Start

1. **Install dependencies** (first time only):

   ```shellscript
   pnpm install
   ```

2. **Run the development server**:

   ```shellscript
   pnpm dev
   ```

   This command automatically:
   - Starts Firebase emulators (Auth, Firestore, Database)
   - Imports existing test data from `data_export/`
   - Starts the Vite dev server
   - Exports data to `.firebase/` on exit for persistence

3. **Access the app**:
   - **Application**: http://localhost:5173
   - **Firebase Emulator UI**: http://localhost:4000

#### Alternative: Run Components Separately

If you prefer to run emulators and dev server separately:

```shellscript
# Terminal 1: Start emulators only
pnpm emulators:start

# Terminal 2: Start dev server only
pnpm dev:only
```

#### Available Scripts

- `pnpm dev` - Run emulators + dev server together
- `pnpm dev:only` - Run only the Vite dev server
- `pnpm emulators:start` - Start Firebase emulators with data import
- `pnpm emulators:ui` - Open emulator UI in browser
- `pnpm emulators:export` - Export current emulator data to `data_export/`

#### Emulator Configuration

The app uses the following emulator ports (configured in `firebase.json`):

- **Auth**: localhost:9099
- **Firestore**: localhost:9080
- **Realtime Database**: localhost:9000
- **Hosting**: localhost:5000
- **Emulator UI**: http://localhost:4000

Environment variables are configured in `.env.local` (git-ignored).

#### Data Persistence

- Emulator data is automatically **exported to `.firebase/`** on shutdown
- Data is **imported from `data_export/`** on startup (first time)
- After first run, data persists between sessions in `.firebase/`
- To reset to original state, delete `.firebase/` folder and restart

#### Troubleshooting

**Emulators won't start:**

- Make sure no other processes are using ports 9099, 9080, 9000, 4000, or 5000
- Run `lsof -i :9099` (or other port) to find conflicting processes
- Install Firebase CLI if not present: `npm install -g firebase-tools`

**App connects to production instead of emulators:**

- Check that `.env.local` exists and has `VITE_FIREBASE_LOCAL=1`
- Look for console logs: "using local emulator" (client) and "connecting to emulators" (server)
- Clear browser cache and local storage

**Data not persisting:**

- Emulators must shutdown gracefully (Ctrl+C) to export data
- Check that `.firebase/` directory exists and contains exported data
- Use `pnpm emulators:export` to manually export data

## Deployment

First, build your app for production:

```sh
npm run build
```

Then run the app in production mode:

```sh
npm start
```

Now you'll need to pick a host to deploy it to.

### DIY

If you're familiar with deploying Node applications, the built-in Remix app server is production-ready.

Make sure to deploy the output of `npm run build`

- `build/server`
- `build/client`

## Styling

This template comes with [Tailwind CSS](https://tailwindcss.com/) already configured for a simple default starting experience. You can use whatever css framework you prefer. See the [Vite docs on css](https://vitejs.dev/guide/features.html#css) for more information.
