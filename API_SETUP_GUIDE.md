# SwiftTrack Pro - API Setup Guide

## Current Setup

### Frontend
- Deployed on Vercel: https://swifttrack-pro.vercel.app
- Built with React + TypeScript + Vite + Tailwind CSS

### Backend
- Flask API running on localhost:5000
- Ngrok tunnel: https://nonlethally-pseudomorular-shakia.ngrok-free.dev
- Excel database: swifttrack_database.xlsx

## API Configuration

The API base URL is configured in `src/config/api.ts`:

```typescript
export const API_BASE_URL = 'https://nonlethally-pseudomorular-shakia.ngrok-free.dev';