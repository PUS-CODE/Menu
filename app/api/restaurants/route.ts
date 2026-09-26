import { NextResponse } from 'next/server';
import {
  cloudGetAllRestaurants,
  cloudSaveRestaurant,
  cloudDeleteRestaurant,
  cloudGetRestaurantBySlug,
} from '@/lib/cloud-store';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get('slug');

  if (slug) {
    const data = await cloudGetRestaurantBySlug(slug);
    if (!data) {
      return NextResponse.json({ error: 'Restaurant not found' }, { status: 404 });
    }
    return NextResponse.json(data);
  }

  const list = await cloudGetAllRestaurants();
  return NextResponse.json(list);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.name || !body.slug) {
      return NextResponse.json({ error: 'Name and slug are required' }, { status: 400 });
    }

    const saved = await cloudSaveRestaurant(body);
    return NextResponse.json(saved);
  } catch (e) {
    return NextResponse.json({ error: 'Failed to save restaurant' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Restaurant ID is required' }, { status: 400 });
  }

  await cloudDeleteRestaurant(id);
  return NextResponse.json({ success: true });
}
