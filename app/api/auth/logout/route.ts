import { NextResponse } from 'next/server';

export async function POST() {
  const response = NextResponse.json({ success: true });
  
  response.cookies.set('iuaix_token', '', {
    httpOnly: true,
    expires: new Date(0),
    path: '/'
  });

  response.cookies.set('iuaix_role', '', {
    expires: new Date(0),
    path: '/'
  });

  return response;
}
