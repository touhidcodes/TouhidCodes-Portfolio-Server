import { prisma } from "../lib/prisma";

export const slugify = (value: string): string =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

export const generateUniqueSlug = async (
  title: string,
  excludeId?: string,
): Promise<string> => {
  const baseSlug = slugify(title) || "project";
  let slug = baseSlug;
  let counter = 1;

  while (true) {
    const existing = await prisma.project.findFirst({
      where: {
        slug,
        ...(excludeId ? { NOT: { id: excludeId } } : {}),
      },
      select: { id: true },
    });

    if (!existing) return slug;

    slug = `${baseSlug}-${counter++}`;
  }
};
