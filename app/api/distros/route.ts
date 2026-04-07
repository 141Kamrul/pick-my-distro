import { NextRequest, NextResponse } from 'next/server';
import { getDistros, getDistroById, createDistro, updateDistro, deleteDistro } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (id) {
      const distro = await getDistroById(id);
      if (!distro) {
        return NextResponse.json({ error: 'Distro not found' }, { status: 404 });
      }
      return NextResponse.json(distro);
    }

    const distros = await getDistros();
    return NextResponse.json(distros);
  } catch (error) {
    console.error('Error fetching distros:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, description, image, website, attributes } = body;

    if (!name || !description) {
      return NextResponse.json(
        { error: 'Name and description are required' },
        { status: 400 }
      );
    }

    const distro = await createDistro({
      name,
      description,
      image,
      website,
      attributes: attributes || {},
    });

    return NextResponse.json(distro, { status: 201 });
  } catch (error) {
    console.error('Error creating distro:', error);
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
    const distro = await updateDistro(id, body);

    if (!distro) {
      return NextResponse.json({ error: 'Distro not found' }, { status: 404 });
    }

    return NextResponse.json(distro);
  } catch (error) {
    console.error('Error updating distro:', error);
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

    const success = await deleteDistro(id);

    if (!success) {
      return NextResponse.json({ error: 'Distro not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Distro deleted successfully' });
  } catch (error) {
    console.error('Error deleting distro:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
