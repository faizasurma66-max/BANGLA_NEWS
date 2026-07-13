import { z } from "zod";

const slugRule = z
  .string()
  .trim()
  .min(1)
  .max(90)
  .regex(/^[a-z0-9-]+$/, "Use lowercase letters, numbers and hyphens only");

export const loginInput = z.object({
  password: z.string().min(1, "Password is required"),
});

export const submissionInput = z.object({
  outlet_name: z.string().trim().min(2, "Please enter the site name").max(160),
  url: z.url("Enter a valid URL including https://").max(400),
  category_suggestion: z.string().trim().max(120).optional().default(""),
  submitter_email: z
    .union([z.literal(""), z.email("Enter a valid email").max(160)])
    .optional()
    .default(""),
  notes: z.string().trim().max(1000).optional().default(""),
});

export const outletInput = z.object({
  name: z.string().trim().min(1, "Name is required").max(160),
  name_bn: z.string().trim().max(160).optional().default(""),
  url: z.url("Enter a valid URL").max(400),
  category_slug: z.string().trim().min(1, "Choose a category"),
  logo_url: z.string().trim().max(600).optional().default(""),
  description: z.string().trim().max(1000).optional().default(""),
  is_featured: z.boolean().default(false),
  is_active: z.boolean().default(true),
  open_external: z.boolean().default(false),
  sort_order: z.number().int().min(0).max(99999).default(0),
});

export const categoryInput = z.object({
  slug: slugRule,
  title: z.string().trim().min(1, "Title is required").max(160),
  title_bn: z.string().trim().max(160).optional().default(""),
  description: z.string().trim().max(1200).optional().default(""),
  group_key: z.string().trim().min(1, "Group is required"),
  section_type: z.enum(["outlet_grid", "division_grid"]).default("outlet_grid"),
  parent_slug: z.string().trim().max(90).optional().default(""),
  accent: z.string().trim().max(20).optional().default(""),
  sort_order: z.number().int().min(0).max(99999).default(0),
  show_on_home: z.boolean().default(false),
  is_active: z.boolean().default(true),
});

export const postInput = z.object({
  title: z.string().trim().min(1, "Title is required").max(200),
  slug: slugRule,
  excerpt: z.string().trim().max(400).optional().default(""),
  content: z.string().trim().min(1, "Content is required"),
  cover_image: z.string().trim().max(600).optional().default(""),
  published: z.boolean().default(false),
  featured: z.boolean().default(false),
  sort_order: z.number().int().min(0).max(99999).default(0),
});

export type SubmissionInput = z.infer<typeof submissionInput>;
export type OutletInput = z.infer<typeof outletInput>;
export type CategoryInput = z.infer<typeof categoryInput>;
export type PostInput = z.infer<typeof postInput>;
