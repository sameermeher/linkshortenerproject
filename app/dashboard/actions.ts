"use server";

import crypto from "crypto";
import { auth } from "@clerk/nextjs/server";
import { z } from "zod";
import { deleteLinkById, insertLink, updateLinkById } from "@/data/links";

const createLinkSchema = z.object({
  url: z.string().url("Please enter a valid URL").refine(
    (val) => val.startsWith("http://") || val.startsWith("https://"),
    { message: "Only http and https URLs are allowed" }
  ),
  slug: z
    .string()
    .max(50, "Slug must be 50 characters or less")
    .regex(/^[a-zA-Z0-9_-]+$/, "Slug can only contain letters, numbers, hyphens, and underscores")
    .optional()
    .or(z.literal("")),
});

type CreateLinkInput = z.infer<typeof createLinkSchema>;

function generateSlug(): string {
  return crypto.randomBytes(4).toString("hex");
}

export async function createLink(data: CreateLinkInput) {
  const { userId } = await auth();
  if (!userId) return { error: "Unauthorized" };

  const parsed = createLinkSchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  const shortCode = parsed.data.slug || generateSlug();

  try {
    await insertLink({
      originalUrl: parsed.data.url,
      shortCode,
      userId,
    });
    return { success: true };
  } catch {
    return { error: "That slug is already taken. Please choose another." };
  }
}

const updateLinkSchema = z.object({
  id: z.number().int().positive(),
  url: z.string().url("Please enter a valid URL").refine(
    (val) => val.startsWith("http://") || val.startsWith("https://"),
    { message: "Only http and https URLs are allowed" }
  ),
  slug: z
    .string()
    .min(1, "Slug cannot be empty")
    .max(50, "Slug must be 50 characters or less")
    .regex(/^[a-zA-Z0-9_-]+$/, "Slug can only contain letters, numbers, hyphens, and underscores"),
});

type UpdateLinkInput = z.infer<typeof updateLinkSchema>;

export async function updateLink(data: UpdateLinkInput) {
  const { userId } = await auth();
  if (!userId) return { error: "Unauthorized" };

  const parsed = updateLinkSchema.safeParse(data);
  if (!parsed.success) return { error: parsed.error.issues[0].message };

  try {
    await updateLinkById(parsed.data.id, userId, {
      originalUrl: parsed.data.url,
      shortCode: parsed.data.slug,
    });
    return { success: true };
  } catch {
    return { error: "That slug is already taken. Please choose another." };
  }
}

const deleteLinkSchema = z.object({
  id: z.number().int().positive(),
});

type DeleteLinkInput = z.infer<typeof deleteLinkSchema>;

export async function deleteLink(data: DeleteLinkInput) {
  const { userId } = await auth();
  if (!userId) return { error: "Unauthorized" };

  const parsed = deleteLinkSchema.safeParse(data);
  if (!parsed.success) return { error: "Invalid input" };

  try {
    await deleteLinkById(parsed.data.id, userId);
    return { success: true };
  } catch {
    return { error: "Failed to delete link." };
  }
}
