import { z } from "zod";

export const CreateSepaySchema = z.object({
  name: z.string(),
  code: z.string(),
  bin: z.string(),
  shortName: z.string(),
  logo: z.string(),
  transferSupported: z.number(),
  lookupSupported: z.number(),
  short_name: z.string(),
  support: z.number(),
  isTransfer: z.number(),
  swift_code: z.string(),
  note: z.string(),
  isUse: z.boolean(),
  bankInfo: z.object({
    accountNumber: z.string(),
    accountHolder: z.string(),
  }),
});

export type CreateSepay = z.infer<typeof CreateSepaySchema>;

export const UpdateSepaySchema = CreateSepaySchema.partial();
export type UpdateSepay = z.infer<typeof UpdateSepaySchema>;

export type Sepay = {
  _id: string;
  name: string;
  code: string;
  bin: string;
  shortName: string;
  logo: string;
  transferSupported: number;
  lookupSupported: number;
  short_name: string;
  support: number;
  isTransfer: number;
  swift_code: string;
  note: string;
  bankInfo: {
    accountNumber: string;
    accountHolder: string;
  };
  isUse: boolean;
  createdAt: string;
  updatedAt: string;
};

export type GenerateQrCode = {
  orderCode: string;
  amount: number;
  bankInfo: {
    bankName: string;
    accountNumber: string;
  };
};
