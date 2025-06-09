// utils/fetch.ts
// // const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
// const API_BASE = process.env.NEXT_PUBLIC_API_URL || "https://be.masjidin.my.id";

const API_BASE = process.env.NEXT_PUBLIC_API_URL;


export const apiUrl = (path: string) => `${API_BASE}${path}`;
