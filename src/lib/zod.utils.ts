import z from "zod";

export const fileUploadSchema = z.object({
  type: z.enum(["A", "B"]),
  username: z.string().nullable(),
  fileUpload: z.any()

});

export type FileUpload = z.infer<typeof fileUploadSchema>;
