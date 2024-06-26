import { NextResponse } from 'next/server';

export function middleware(req) {
  const res = NextResponse.next();

  // Установка заголовков CORS
  res.headers.set('Access-Control-Allow-Origin', '*');
  res.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.headers.set('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');

  return res;
}
