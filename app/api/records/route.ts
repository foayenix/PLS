import { and, eq, like } from 'drizzle-orm';
import { getDb } from '@/db';
import { learningRecords } from '@/db/schema';
import { getChatGPTUser } from '@/app/chatgpt-auth';
const practicePrefix = 'career:practice/';

export async function GET(request: Request) {
  const user = await getChatGPTUser();
  if (!user) return Response.json({ error: 'Sign in to sync your learning.' }, { status: 401 });
  try {
    const practice = new URL(request.url).searchParams.get('scope') === 'practice';
    const ownership = eq(learningRecords.userId, user.userId);
    const rows = await getDb().select().from(learningRecords)
      .where(practice ? and(ownership, like(learningRecords.key, practicePrefix + '%')) : ownership);
    const records = Object.fromEntries(rows.map(r => [r.key, JSON.parse(r.value)]));
    return Response.json(practice ? { records, owner: user.userId } : { records }, { headers: { 'Cache-Control': 'no-store' } });
  } catch { return Response.json({ error: 'Your progress could not be loaded. Your saved device copy is still available.' }, { status: 503 }); }
}
export async function POST(request: Request) {
  const user = await getChatGPTUser();
  if (!user) return Response.json({ error: 'Sign in to sync your learning.' }, { status: 401 });
  const origin = request.headers.get('origin');
  if (origin && new URL(origin).host !== new URL(request.url).host) return Response.json({ error: 'Request origin is not allowed.' }, { status: 403 });
  try {
    const { key, value, practiceOwner } = await request.json() as { key?: unknown; value?: unknown; practiceOwner?: unknown };
    if (typeof key !== 'string' || key.length > 300 || !/^(lesson:|note:|project:|career:|session:|settings$)/.test(key) || !value || typeof value !== 'object' || Array.isArray(value)) return Response.json({ error: 'Invalid learning record.' }, { status: 400 });
    if (key.startsWith(practicePrefix) && practiceOwner !== undefined && practiceOwner !== user.userId) {
      return Response.json({ error: 'This practice attempt belongs to another account.' }, { status: 403 });
    }
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
