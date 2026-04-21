// src/services/admin.service.ts
import { count, desc, eq, like, or } from 'drizzle-orm';
import type { AdminListQueryInput } from '../admin/query.js';
import type { AdminListResult } from '../admin/types.js';
import type { UpdateUserAdminInput } from '../admin/validation.js';
import { db } from '../config/db.js';
import { user } from '../models/schema.js';

type AdminUserRow = {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  role: 'admin' | 'user';
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export async function listUsers(query: AdminListQueryInput): Promise<AdminListResult<AdminUserRow>> {
  const page = query.page;
  const limit = query.limit;
  const offset = (page - 1) * limit;
  const search = query.search?.trim() ?? '';

  const where = search
    ? or(
        like(user.name, `%${search}%`),
        like(user.email, `%${search}%`),
      )
    : undefined;

  const items = await db
    .select({
      id: user.id,
      name: user.name,
      email: user.email,
      emailVerified: user.emailVerified,
      role: user.role,
      image: user.image,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    })
    .from(user)
    .where(where)
    .orderBy(desc(user.createdAt))
    .limit(limit)
    .offset(offset);

  const totalRows = await db
    .select({ total: count() })
    .from(user)
    .where(where);

  return {
    items,
    total: Number(totalRows[0]?.total ?? 0),
    page,
    limit,
  };
}

export async function updateUser(id: string, patch: UpdateUserAdminInput) {
  const safePatch: Partial<typeof user.$inferInsert> = {};

  if (typeof patch.name === 'string') safePatch.name = patch.name;
  if (patch.role === 'admin' || patch.role === 'user') safePatch.role = patch.role;
  safePatch.updatedAt = new Date();

  await db.update(user).set(safePatch).where(eq(user.id, id));

  const rows = await db.select().from(user).where(eq(user.id, id));
  return rows[0] ?? null;
}