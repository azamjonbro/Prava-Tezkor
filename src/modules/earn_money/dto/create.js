import z from "zod";

const CreateEarnMoneyDto = z.object({
  coin: z.number(),
  price: z.string(),
});

export default CreateEarnMoneyDto;
