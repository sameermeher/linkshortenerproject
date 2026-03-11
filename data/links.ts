import { db } from "@/db/index.js";
import { links, InsertLink, SelectLink } from "@/db/schema";
import { and, desc, eq } from "drizzle-orm";

export async function getLinksByUserId(userId: string): Promise<SelectLink[]> {
  return db.select().from(links).where(eq(links.userId, userId)).orderBy(desc(links.updatedAt));
}

export async function insertLink(
  data: Omit<InsertLink, "id" | "createdAt" | "updatedAt">
): Promise<void> {
  await db.insert(links).values(data);
}

export async function updateLinkById(
  id: number,
  userId: string,
  data: { originalUrl: string; shortCode: string }
): Promise<void> {
  await db
    .update(links)
    .set({ ...data, updatedAt: new Date() })
    .where(and(eq(links.id, id), eq(links.userId, userId)));
}

export async function deleteLinkById(id: number, userId: string): Promise<void> {
  await db.delete(links).where(and(eq(links.id, id), eq(links.userId, userId)));
}

export async function getLinkByShortCode(shortCode: string): Promise<SelectLink | undefined> {
  const results = await db.select().from(links).where(eq(links.shortCode, shortCode)).limit(1);
  return results[0];
}
