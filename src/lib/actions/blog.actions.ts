"use server";

import { z } from "zod";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

const blogPostSchema = z.object({
  title: z.string().min(3),
  content: z.string().min(10),
  excerpt: z.string().optional().nullable(),
  imageKey: z.string().optional().nullable(),
  tags: z.string().optional().nullable(), // comma-separated
  published: z.boolean().optional(),
  authorId: z.string().optional().nullable(),
});

const blogPostsArraySchema = z.array(blogPostSchema);

export async function bulkAddBlogPosts(jsonContent: string) {
  try {
    const data = JSON.parse(jsonContent);
    const validation = blogPostsArraySchema.safeParse(data);
    if (!validation.success) {
      const errorMessage = (validation.error as import("zod").ZodError<any>).issues.map((e: any) => `Error at path '${e.path.join('.') }': ${e.message}`).join(', ');
      return { success: false, message: `Invalid data structure. ${errorMessage}` };
    }
    const result = await prisma.blogPost.createMany({
      data: validation.data,
      skipDuplicates: true,
    });
    revalidatePath("/blog");
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