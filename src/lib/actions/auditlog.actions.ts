"use server";

import prisma from "@/lib/prisma";

export async function logAdminAction({ userId, action, entity, entityId, details }: {
  userId: string;
  action: string;
  entity: string;
  entityId: string;
  details?: string;
}) {
  try {
    await prisma.auditLog.create({
      data: {
        userId,
        action,
        entity,
        entityId,
        details,
      },
    });
  } catch (error) {
    console.error("Failed to log admin action:", error);
  }
} 