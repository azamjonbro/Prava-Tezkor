import z from "zod";

const SignUpSchema = z.object({
  username: z.string().min(3).optional(),
  email: z.string().email().optional(),
  password: z.string().min(4).optional(),
});

export default SignUpSchema;
