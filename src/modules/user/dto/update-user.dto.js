import z from "zod";

const UpdateuserSchema = z.object({
  username: z.string().optional(),
  password: z.string().optional(),
  email: z.string().optional(),
});

export default UpdateuserSchema;
