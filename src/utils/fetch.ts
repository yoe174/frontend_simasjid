// utils/fetch.ts
const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const apiUrl = (path: string) => `${API_BASE}${path}`;
