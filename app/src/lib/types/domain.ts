import type { CampaignStatus, PaymentMode, WorkType } from "@/lib/types/database";

export type PublicCampaign = {
  id: string;
  slug: string;
  title: string;
  farmName: string;
  district: string;
  province: string;
  startDate: string;
  endDate: string;
  workType: WorkType;
  paymentMode: PaymentMode;
  paymentAmount: number;
  paymentUnitLabel: string | null;
  workersNeeded: number;
  includesFood: boolean;
  includesLodging: boolean;
  transportProvided: boolean;
  description: string;
  locationReference: string;
  safetyNote: string;
  rating: number;
  completedCampaigns: number;
  ratingComments?: string[];
  status: CampaignStatus;
  isDemo?: boolean;
};

export type LocationOption = {
  id: string;
  province: string;
  district: string;
  slug: string;
};

export type CampaignFilters = {
  district?: string;
  workType?: string;
  paymentMode?: string;
  lodging?: string;
  from?: string;
};
