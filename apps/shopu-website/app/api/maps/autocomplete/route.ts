import { ShopUError } from '@/proxy/ShopUError';
import { shopuErrorHandler } from '@/proxy/shopuErrorHandling';
import { envs } from '@shopu/config/config';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const query = searchParams.get('q');

  if (!query) {
    return shopuErrorHandler(new ShopUError(404, 'Missing fields'));
  }

  const apiKey = envs.NEXT_PUBLIC_GOOGLE_MAP_API_KEY;
  const url = `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
    query
  )}&key=${apiKey}`;

  try {
    const res = await fetch(url);
    if (!res.ok) {
      return shopuErrorHandler(new ShopUError(401, `Google API failed: ${res.status}`));
    }
    const data = await res.json();
    return NextResponse.json({ success: true, data });
  } catch (error) {
    return shopuErrorHandler(error);
  }
}
