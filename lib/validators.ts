import { z } from "zod";

const phoneDigits = z
  .string()
  .transform((v) => v.replace(/\D/g, ""))
  .refine((v) => v.length >= 10 && v.length <= 11, "Invalid phone");

export const ConsultationSchema = z.object({
  name: z.string().min(1).max(50),
  phone: phoneDigits,
  serviceType: z.string().optional().nullable(),
  message: z.string().optional().nullable(),
  consentPrivacy: z.boolean(),
});

export const ApplicationSchema = z.object({
  insuranceType: z.string().min(1).max(30),
  name: z.string().min(1).max(50),
  phone: phoneDigits,
  residentNumber1: z.string().regex(/^\d{6}$/),
  residentNumber2: z.string().regex(/^\d{7}$/),
  yearlyPremium: z.string().optional().nullable(),
  firstPremium: z.string().optional().nullable(),
  address: z.string().min(1).max(200),
  addressDetail: z.string().optional().nullable(),

  isSamePerson: z.boolean(),
  contractorName: z.string().optional().nullable(),
  contractorResidentNumber1: z.string().optional().nullable(),
  contractorResidentNumber2: z.string().optional().nullable(),

  bankName: z.string().min(1).max(50),
  accountNumber: z.string().min(1).max(50),
  cardNumber: z.string().optional().nullable(),
  cardExpiry: z.string().optional().nullable(),

  consentPrivacy: z.boolean(),
});

