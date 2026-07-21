import { z } from "zod";

export const TRADES = ["Electrical", "HVAC"] as const;

export const CHANGE_TYPES = [
  "GC / Owner Request",
  "Design Revision",
  "Concealed Condition",
  "Code Requirement",
  "Other Trade Conflict",
] as const;

export const URGENCIES = ["Low", "Medium", "High", "Critical"] as const;

export const fieldReportSchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  projectName: z.string().min(1, "Project name is required"),
  submittedBy: z.string().min(1, "Submitted by is required"),
  trade: z.enum(TRADES),
  changeType: z.enum(CHANGE_TYPES),
  description: z
    .string()
    .min(10, "Describe the changed condition in at least 10 characters"),
  laborImpact: z.string().min(1, "Labor impact is required"),
  materialImpact: z.string().min(1, "Material impact is required"),
  scheduleImpact: z.string().min(1, "Schedule impact is required"),
  urgency: z.enum(URGENCIES),
  requestedNextStep: z.string().min(1, "Requested next step is required"),
  pmEmail: z.email("Enter a valid email for the project manager"),
});

export type FieldReport = z.infer<typeof fieldReportSchema>;

export const changeRequestPackageSchema = z.object({
  title: z.string().min(1),
  executiveSummary: z.string().min(1),
  existingCondition: z.string().min(1),
  requestedChange: z.string().min(1),
  laborImpact: z.string().min(1),
  materialImpact: z.string().min(1),
  scheduleImpact: z.string().min(1),
  recommendedNextStep: z.string().min(1),
  customerFacingRequest: z.string().min(1),
  emailDraft: z.string().min(1),
});

export type ChangeRequestPackage = z.infer<typeof changeRequestPackageSchema>;

export type ZapierStatus = "sent" | "skipped" | "failed";

export type GenerateResponse = {
  source: "groq" | "sample";
  pkg: ChangeRequestPackage;
  zapier: ZapierStatus;
};
