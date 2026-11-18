import { and, eq } from 'drizzle-orm';
import { getDb } from '@/db';
import { learningRecords } from '@/db/schema';
import { getChatGPTUser } from '@/app/chatgpt-auth';
export async function GET() {
  const user = await getChatGPTUser();
  if (!user) return Response.json({ error: 'Sign in to sync your learning.' }, { status: 401 });
  try {
    const rows = await getDb().select().from(learningRecords).where(eq(learningRecords.userId, user.userId));
    return Response.json({ records: Object.fromEntries(rows.map(r => [r.key, JSON.parse(r.value)])) }, { headers: { 'Cache-Control': 'no-store' } });
  } catch { return Response.json({ error: 'Your progress could not be loaded. Your saved device copy is still available.' }, { status: 503 }); }
}
export async function POST(request: Request) {
  const user = await getChatGPTUser();
  if (!user) return Response.json({ error: 'Sign in to sync your learning.' }, { status: 401 });
  const origin = request.headers.get('origin');
  if (origin && new URL(origin).host !== new URL(request.url).host) return Response.json({ error: 'Request origin is not allowed.' }, { status: 403 });
  try {
    const { key, value } = await request.json() as { key?: unknown; value?: unknown };
    if (typeof key !== 'string' || key.length > 300 || !/^(lesson:|note:|project:|career:|session:|settings$)/.test(key) || !value || typeof value !== 'object' || Array.isArray(value)) return Response.json({ error: 'Invalid learning record.' }, { status: 400 });
    const serialized = JSON.stringify(value);
    if (serialized.length > 50000) return Response.json({ error: 'This entry is too long. Keep it under 50,000 characters.' }, { status: 400 });
    const row = { userId: user.userId, key, value: serialized, updatedAt: new Date().toISOString() };
    await getDb().insert(learningRecords).values(row).onConflictDoUpdate({ target: [learningRecords.userId, learningRecords.key], set: { value: serialized, updatedAt: row.updatedAt } });
    return Response.json({ saved: true });
  } catch { return Response.json({ error: 'Cloud save is unavailable. Your change is queued on this device.' }, { status: 503 }); }
}
export async function DELETE(request: Request) {
  const user = await getChatGPTUser();
  if (!user) return Response.json({ error: 'Sign in to sync your learning.' }, { status: 401 });
  const origin = request.headers.get('origin');
  if (origin && new URL(origin).host !== new URL(request.url).host) return Response.json({ error: 'Request origin is not allowed.' }, { status: 403 });
  const key = new URL(request.url).searchParams.get('key');
  if (!key || !key.startsWith('session:')) return Response.json({error:'Only individual study sessions can be deleted here.'},{status:400});
  await getDb().delete(learningRecords).where(and(eq(learningRecords.userId,user.userId),eq(learningRecords.key,key)));
  return Response.json({deleted:true});
}
