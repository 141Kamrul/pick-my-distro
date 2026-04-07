import { NextRequest, NextResponse } from 'next/server';
import { initAdmin, verifyAdminPassword, getAdminByEmail } from '@/lib/db';
import { setAdminSession } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, action } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Check if this is a registration (first-time setup)
    if (action === 'register') {
      const existingAdmin = await getAdminByEmail(email);
      if (existingAdmin) {
        return NextResponse.json(
          { error: 'Admin already exists' },
          { status: 400 }
        );
      }
      await initAdmin(email, password);
      return NextResponse.json(
        { message: 'Admin registered successfully' },
        { status: 201 }
      );
    }

    // Login
    const isValid = await verifyAdminPassword(email, password);
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    // Set session
    await setAdminSession({
      id: email,
      email,
    });

    return NextResponse.json(
      { message: 'Login successful', email },
      { status: 200 }
    );
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
