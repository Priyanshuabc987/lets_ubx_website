
import { NextResponse } from 'next/server';
import { getUserById } from '@/lib/data/users';

// Force dynamic evaluation for this route, as it's a user-specific endpoint.
export const dynamic = 'force-dynamic';

/**
 * API route to get a user by their ID.
 * GET /api/user/[id]
 */
export async function GET(request: Request, { params }: { params: { id: string } }) {

  const resolvedparams = await params;
  const id = resolvedparams.id;

  if (!id) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  try {
    // This function is fully cached on the server side
    const user = await getUserById(id);

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error(`API Error fetching user ${id}:`, error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
