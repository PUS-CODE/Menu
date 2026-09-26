import { NextResponse } from 'next/server';
import {
  cloudGetMenuItems,
  cloudSaveMenuItem,
  cloudToggleMenuItemAvailable,
  cloudDeleteMenuItem,
} from '@/lib/cloud-store';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const restaurantId = searchParams.get('restaurantId');

  if (!restaurantId) {
    return NextResponse.json({ error: 'restaurantId is required' }, { status: 400 });
  }

  const list = await cloudGetMenuItems(restaurantId);
  return NextResponse.json(list);
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (!body.name || !body.restaurant_id || !body.category_id) {
      return NextResponse.json(
        { error: 'Name, restaurant_id, and category_id are required' },
        { status: 400 }
      );
    }

    const saved = await cloudSaveMenuItem(body);
    return NextResponse.json(saved);
  } catch (e) {
    return NextResponse.json({ error: 'Failed to save menu item' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const { id } = await request.json();
    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const newStatus = await cloudToggleMenuItemAvailable(id);
    return NextResponse.json({ success: true, available: newStatus });
  } catch (e) {
    return NextResponse.json({ error: 'Failed to toggle availability' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');

  if (!id) {
    return NextResponse.json({ error: 'Menu item ID is required' }, { status: 400 });
  }

  await cloudDeleteMenuItem(id);
  return NextResponse.json({ success: true });
}
