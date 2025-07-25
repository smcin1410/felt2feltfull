"use server";

import { z } from "zod";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

const destinationSchema = z.object({
  city: z.string().min(2),
  state: z.string().optional().nullable(),
  country: z.string().min(2),
  addressLine1: z.string().optional().nullable(),
  addressLine2: z.string().optional().nullable(),
  postalCode: z.string().optional().nullable(),
  description: z.string().min(5),
  imageKey: z.string().min(1),
  tags: z.string().optional().nullable(), // comma-separated string
});

const destinationsArraySchema = z.array(destinationSchema);

export async function bulkAddDestinations(jsonContent: string) {
  try {
    const data = JSON.parse(jsonContent);
    // Accept either the new format (root object with pokerDestinations) or legacy (array)
    const destinationsRaw = Array.isArray(data)
      ? data
      : Array.isArray(data.pokerDestinations)
        ? data.pokerDestinations
        : [];
    if (!destinationsRaw.length) {
      return { success: false, message: "No destinations found in uploaded file." };
    }
    // Map nested structure to flat schema
    const mapped = destinationsRaw.map((d: any) => ({
      casinoName: d.casinoName || "",
      city: d.location?.city || "",
      state: d.location?.state || null,
      country: d.location?.country || "USA", // fallback if not present
      addressLine1: d.location?.address || null,
      addressLine2: d.location?.region || null,
      region: d.location?.region || null,
      postalCode: d.location?.postalCode || null,
      description: d.pokerRoomInfo?.overview || d.description || "",
      imageKey: d.imageKey || "",
      tags: Array.isArray(d.tags) ? d.tags.join(",") : (d.tags || null),
      website: d.website || null,
      pokerRoomInfo: d.pokerRoomInfo ? d.pokerRoomInfo : null,
      travelerInformation: d.travelerInformation || null,
    }));
    // Validate using zod, but allow new fields
    const validation = z.array(
      z.object({
        casinoName: z.string(),
        city: z.string(),
        state: z.string().optional().nullable(),
        country: z.string(),
        addressLine1: z.string().optional().nullable(),
        addressLine2: z.string().optional().nullable(),
        region: z.string().optional().nullable(),
        postalCode: z.string().optional().nullable(),
        description: z.string(),
        imageKey: z.string(),
        tags: z.string().optional().nullable(),
        website: z.string().optional().nullable(),
        pokerRoomInfo: z.any().optional().nullable(),
        travelerInformation: z.string().optional().nullable(),
      })
    ).safeParse(mapped);
    if (!validation.success) {
      const errorMessage = (validation.error as import("zod").ZodError<any>).issues.map((e: any) => `Error at path '${e.path.join('.') }': ${e.message}`).join(', ');
      return { success: false, message: `Invalid data structure. ${errorMessage}` };
    }
    const result = await prisma.destination.createMany({
      data: validation.data
    });
    revalidatePath("/destinations");
    revalidatePath("/admin");
    return { success: true, message: "Upload successful!", count: result.count };
  } catch (error) {
    if (error instanceof SyntaxError) {
      return { success: false, message: "Invalid JSON format." };
    }
    console.error("Bulk Add Error:", error);
    return { success: false, message: "An unexpected error occurred on the server." };
  }
} 