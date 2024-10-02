import { auth } from '@clerk/nextjs';

export async function GET() {
  const { userId } = auth();
  return Response.json({ isAuthed: !!userId, userId });
}