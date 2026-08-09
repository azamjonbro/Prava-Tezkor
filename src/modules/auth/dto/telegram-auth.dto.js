import z from "zod";

const TelegramAuthSchema = z.object({
  initData: z.string().min(1),
});

export default TelegramAuthSchema;
