"use server";

import { z } from "zod";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

const eventSchema = z.object({
  name: z.string().min(3),
  startDate: z.string().datetime(),
  endDate: z.string().datetime().nullable(),
  buyIn: z.number().nullable().optional(),
  prizePool: z.number().positive().optional().nullable(),
  description: z.string().optional().nullable(),
});

const tournamentSchema = z.object({
  name: z.string().min(3),
  location: z.string().min(2),
  venue: z.string().min(2),
  addressLine1: z.string().optional().nullable(),
  addressLine2: z.string().optional().nullable(),
  city: z.string().optional().nullable(),
  state: z.string().optional().nullable(),
  postalCode: z.string().optional().nullable(),
  country: z.string().optional().nullable(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime().nullable(),
  buyIn: z.number().nullable().optional(),
  prizePool: z.number().positive().optional().nullable(),
  description: z.string().optional().nullable(),
  link: z.string().url().optional().nullable(),
  events: z.array(eventSchema).optional().nullable(),
});

const tournamentsArraySchema = z.array(tournamentSchema);

export async function bulkAddTournaments(jsonContent: string) {
  try {
    console.log('bulkAddTournaments: start');
    const data = JSON.parse(jsonContent);
    console.log('bulkAddTournaments: JSON parsed', Array.isArray(data) ? `array of length ${data.length}` : typeof data);
    const validation = tournamentsArraySchema.safeParse(data);

    if (!validation.success) {
      const errorMessage = (validation.error as import("zod").ZodError<any>).issues.map((e: any) => `Error at path '${e.path.join('.') }': ${e.message}`).join(', ');
      console.log('bulkAddTournaments: validation failed', errorMessage);
      return { success: false, message: `Invalid data structure. ${errorMessage}` };
    }

    let createdCount = 0;
    for (const t of validation.data) {
      // Extract events and remove from tournament data
      const { events, ...tournamentData } = t;
      // Build tournament data for Prisma, only include endDate if string
      const tournamentDataForPrisma: any = {
        ...tournamentData,
        buyIn: typeof tournamentData.buyIn === 'number' ? tournamentData.buyIn : null
      };
      if (typeof tournamentData.endDate === 'string') {
        tournamentDataForPrisma.endDate = tournamentData.endDate;
      }
      console.log('bulkAddTournaments: creating tournament', tournamentDataForPrisma.name);
      const tournament = await prisma.tournament.create({
        data: tournamentDataForPrisma,
      });
      console.log('bulkAddTournaments: tournament created', tournament.id);
      createdCount++;
      if (Array.isArray(events) && events.length > 0) {
        console.log('bulkAddTournaments: creating events for tournament', tournament.id, 'event count:', events.length);
        await prisma.tournamentEvent.createMany({
          data: events.map(e => {
            const eventData: any = {
              ...e,
              tournamentId: tournament.id,
              buyIn: typeof e.buyIn === 'number' ? e.buyIn : null
            };
            if (typeof e.endDate === 'string') {
              eventData.endDate = e.endDate;
            }
            return eventData;
          })
        });
        console.log('bulkAddTournaments: events created for tournament', tournament.id);
      }
    }

    revalidatePath("/tournaments");
    revalidatePath("/admin");
    console.log('bulkAddTournaments: completed successfully');

    return { success: true, message: "Upload successful!", count: createdCount };
  } catch (error) {
    if (error instanceof SyntaxError) {
      console.log('bulkAddTournaments: JSON parse error', error);
      return { success: false, message: "Invalid JSON format." };
    }
    console.error("Bulk Add Error:", error);
    return { success: false, message: "An unexpected error occurred on the server." };
  }
} 