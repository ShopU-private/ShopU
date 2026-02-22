import { NextResponse } from 'next/server';
import { ShopUError } from './ShopUError';

export function shopuErrorHandler(err: unknown) {
  if (err instanceof ShopUError) {
    return NextResponse.json({ success: false, message: err.message }, { status: err.statusCode });
  }

  // Properly extract error message
  let errorMessage = 'An unexpected error occurred';
  
  if (err instanceof Error) {
    errorMessage = err.message;
  } else if (typeof err === 'string') {
    errorMessage = err;
  } else if (err && typeof err === 'object') {
    errorMessage = JSON.stringify(err);
  }
  
  return NextResponse.json(
    { success: false, message: `Internal server error: ${errorMessage}` },
    { status: 500 }
  );
}