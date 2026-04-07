import { NextRequest, NextResponse } from 'next/server';
import { getAttributes, getAttribute, createAttribute, updateAttribute, deleteAttribute } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id) {
      const attribute = await getAttribute(id);
      if (!attribute) {
        return NextResponse.json({ error: 'Attribute not found' }, { status: 404 });
      }
      return NextResponse.json(attribute);
    }

    const attributes = await getAttributes();
    return NextResponse.json(attributes);
  } catch (error) {
    console.error('Error fetching attributes:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, type, options, min, max } = body;

    if (!name || !type) {
      return NextResponse.json(
        { error: 'Name and type are required' },
        { status: 400 }
      );
    }

    const attribute = await createAttribute({
      name,
      type,
      options,
      min,
      max,
    });

    return NextResponse.json(attribute, { status: 201 });
  } catch (error) {
    console.error('Error creating attribute:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const body = await request.json();
    const attribute = await updateAttribute(id, body);

    if (!attribute) {
      return NextResponse.json({ error: 'Attribute not found' }, { status: 404 });
    }

    return NextResponse.json(attribute);
  } catch (error) {
    console.error('Error updating attribute:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'ID is required' }, { status: 400 });
    }

    const success = await deleteAttribute(id);

    if (!success) {
      return NextResponse.json({ error: 'Attribute not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Attribute deleted successfully' });
  } catch (error) {
    console.error('Error deleting attribute:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
