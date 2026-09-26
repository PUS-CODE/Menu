import { NextResponse } from 'next/server';
import {
  cloudGetCategories,
  cloudSaveCategory,
  cloudDeleteCategory,
} from '@/lib/cloud-store';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const restaurantId = searchParams.get('restaurantId');

  if (!restaurantId) {
    return NextResponse.json({ error: 'restaurantId is required' }, { status: 400 });
  }

  const list = await cloudGetCategories(restaurantId);
  return NextResponse.json(list);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.name || !body.restaurant_id) {
      return NextResponse.json({ error: 'Name and restaurant_id are required' }, { status: 400 });
    }

    const saved = await cloudSaveCategory(body);
    return NextResponse.json(saved);
  } catch (e) {
    return NextResponse.json({ error: 'Failed to save category' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Category ID is required' }, { status: 400 });
  }

  await cloudDeleteCategory(id);
  return NextResponse.json({ success: true });
}
