import z from "zod";

const UpdateEarnMoneyDto = z.object({
  coin: z.number(),
  price: z.string(),
});

export default UpdateEarnMoneyDto;
