import z from "zod";

const UpdateTicketDto = z.object({
  imgUrl: z.string(),
  questions: z.object({
    lotin: z.string(),
    rus: z.string(),
    krill: z.string(),
  }),
  answers: z.array(
    z.object({ lotin: z.string(), krill: z.string(), rus: z.string() })
  ),
  currentAnswer: z.number(),
  izoh: z.object({
    lotin: z.string(),
    rus: z.string(),
    krill: z.string(),
  }),
});

export default UpdateTicketDto;
