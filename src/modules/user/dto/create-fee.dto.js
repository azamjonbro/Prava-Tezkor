import z from "zod";

const CreateFeeDto = z.object({
  money_id: z.string(),
  credit_card: z.string(),
  name: z.string(),
});

export default CreateFeeDto;
