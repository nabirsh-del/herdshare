import { prisma } from './db';
import { UserRole, Prisma } from '@herdshare/db';

export type EventLogInput = {
  actorRole?: UserRole;
  actorId?: string;
  entityType: string;
  entityId: string;
  eventName: string;
  eventPayload?: Record<string, unknown>;
  allocationIntentId?: string;
};

// Log an event to the audit trail
export async function logEvent(input: EventLogInput) {
  return prisma.eventLog.create({
    data: {
      actorRole: input.actorRole,
      actorId: input.actorId,
      entityType: input.entityType,
      entityId: input.entityId,
      eventName: input.eventName,
      eventPayload: input.eventPayload as Prisma.InputJsonValue | undefined,
      allocationIntentId: input.allocationIntentId,
    },
  });
}

// Get events for an entity
export async function getEventsForEntity(entityType: string, entityId: string) {
  return prisma.eventLog.findMany({
    where: {
      entityType,
      entityId,
    },
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      actor: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          role: true,
        },
      },
    },
  });
}

// Get events for an allocation intent
export async function getEventsForAllocation(allocationIntentId: string) {
  return prisma.eventLog.findMany({
    where: {
      allocationIntentId,
    },
    orderBy: {
      createdAt: 'desc',
    },
    include: {
      actor: {
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          role: true,
        },
      },
    },
  });
}
