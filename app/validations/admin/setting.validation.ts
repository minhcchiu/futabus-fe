import { z } from "zod";

export const CreateSettingSchema = z.object({
  zalo: z.string(),
  phone: z.string(),
  logo: z.string(),
  banner: z.string(),
  email: z.string(),
  shortName: z.string(),
  fullName: z.string(),
  website: z.string(),
  fax: z.string(),
  address: z.string(),
  mapLink: z.string(),
  termsOfUse: z.string(),
  privacyPolicy: z.string(),
  bankInfo: z.object({
    bankName: z.string(),
    accountNumber: z.string(),
    accountHolder: z.string(),
    qr: z.string(),
  }),
});

export type CreateSetting = z.infer<typeof CreateSettingSchema>;

export const UpdateSettingSchema = CreateSettingSchema.partial();
export type UpdateSetting = z.infer<typeof UpdateSettingSchema>;

export type Setting = {
  _id: string;
  zalo: string;
  phone: string;
  logo: string;
  banner: string;
  email: string;
  shortName: string;
  fullName: string;
  website: string;
  fax: string;
  address: string;
  mapLink: string;
  termsOfUse: string;
  privacyPolicy: string;
  coverImage: string;
  bankInfo: {
    bankName: string;
    accountNumber: string;
    accountHolder: string;
    qr: string;
  };
  createdAt: string;
  updatedAt: string;
};
