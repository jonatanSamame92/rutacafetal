export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type UserRole = "worker" | "farmer" | "admin";
export type AccountStatus = "pending" | "active" | "suspended";
export type RegistrationStatus = "pending" | "approved" | "rejected";
export type CampaignStatus = "draft" | "pending_review" | "published" | "closed" | "rejected" | "cancelled";
export type ApplicationStatus = "pending" | "accepted" | "rejected" | "withdrawn";
export type AssignmentStatus = "active" | "completed" | "cancelled";
export type RatingStatus = "pending" | "approved" | "rejected";
export type ReportStatus = "open" | "reviewing" | "resolved" | "dismissed";
export type WorkType = "harvest" | "maintenance" | "postharvest" | "mixed";
export type PaymentMode = "per_day" | "per_week" | "per_unit";
export type AnalyticsEventName = "registration_requested" | "campaign_submitted" | "campaign_published" | "application_created" | "application_accepted" | "campaign_completed" | "rating_created" | "report_created" | "whatsapp_opened";

type Table<Row, Insert = Partial<Row>, Update = Partial<Insert>> = {
  Row: Row;
  Insert: Insert;
  Update: Update;
  Relationships: [];
};

export type Database = {
  public: {
    Tables: {
      locations: Table<{
        id: string;
        province: string;
        district: string;
        slug: string;
        is_active: boolean;
        sort_order: number;
        created_at: string;
      }>;
      registration_requests: Table<{
        id: string;
        requested_role: UserRole;
        full_name: string;
        phone: string;
        email: string | null;
        location_id: string | null;
        note: string | null;
        status: RegistrationStatus;
        reviewed_by: string | null;
        reviewed_at: string | null;
        internal_note: string | null;
        created_user_id: string | null;
        created_at: string;
        updated_at: string;
      }>;
      profiles: Table<{
        id: string;
        role: UserRole;
        status: AccountStatus;
        must_change_password: boolean;
        full_name: string;
        email: string | null;
        location_id: string | null;
        bio: string | null;
        experience_level: string | null;
        crops: string[];
        available_from: string | null;
        availability_type: string | null;
        payment_preference: PaymentMode | null;
        accepts_lodging: boolean | null;
        operation_zone: string | null;
        cooperative_name: string | null;
        completed_campaigns: number;
        rating_average: number;
        rating_count: number;
        created_at: string;
        updated_at: string;
      }>;
      farms: Table<{
        id: string;
        owner_id: string;
        name: string;
        description: string | null;
        location_id: string;
        location_reference: string;
        main_crop: string;
        area_hectares: number | null;
        is_active: boolean;
        created_at: string;
        updated_at: string;
      }>;
      campaigns: Table<{
        id: string;
        farm_id: string;
        slug: string;
        title: string;
        description: string;
        location_id: string;
        start_date: string;
        end_date: string;
        workers_needed: number;
        work_type: WorkType;
        payment_mode: PaymentMode;
        payment_amount: number;
        payment_unit_label: string | null;
        includes_food: boolean;
        includes_lodging: boolean;
        transport_provided: boolean;
        safety_note: string;
        status: CampaignStatus;
        moderation_note: string | null;
        published_at: string | null;
        closed_at: string | null;
        created_at: string;
        updated_at: string;
      }>;
      applications: Table<{
        id: string;
        campaign_id: string;
        worker_id: string;
        message: string | null;
        status: ApplicationStatus;
        decided_at: string | null;
        created_at: string;
        updated_at: string;
      }>;
      assignments: Table<{
        id: string;
        campaign_id: string;
        worker_id: string;
        application_id: string | null;
        status: AssignmentStatus;
        completed_at: string | null;
        created_at: string;
      }>;
      ratings: Table<{
        id: string;
        assignment_id: string;
        campaign_id: string;
        rater_id: string;
        rated_user_id: string;
        score: number;
        comment: string | null;
        status: RatingStatus;
        moderated_by: string | null;
        moderated_at: string | null;
        created_at: string;
      }>;
      reports: Table<{
        id: string;
        reporter_id: string;
        reported_user_id: string | null;
        campaign_id: string | null;
        type: string;
        description: string;
        evidence_path: string | null;
        status: ReportStatus;
        assigned_to: string | null;
        resolution_note: string | null;
        resolved_at: string | null;
        created_at: string;
        updated_at: string;
      }>;
      moderation_events: Table<{
        id: string;
        admin_id: string;
        entity_type: string;
        entity_id: string;
        action: string;
        note: string | null;
        created_at: string;
      }>;
      contact_events: Table<{
        id: string;
        application_id: string;
        actor_id: string;
        channel: string;
        created_at: string;
      }>;
      analytics_events: Table<{
        id: string;
        event_name: string;
        actor_id: string | null;
        entity_id: string | null;
        metadata: Json;
        created_at: string;
      }>;
    };
    Views: Record<string, never>;
    Functions: {
      accept_application: { Args: { target_application_id: string }; Returns: Database["public"]["Tables"]["applications"]["Row"] };
      complete_assignment: { Args: { target_assignment_id: string }; Returns: Database["public"]["Tables"]["assignments"]["Row"] };
      reject_application: { Args: { target_application_id: string }; Returns: Database["public"]["Tables"]["applications"]["Row"] };
      withdraw_application: { Args: { target_application_id: string }; Returns: Database["public"]["Tables"]["applications"]["Row"] };
    };
    Enums: {
      user_role: UserRole;
      account_status: AccountStatus;
      registration_status: RegistrationStatus;
      campaign_status: CampaignStatus;
      application_status: ApplicationStatus;
      assignment_status: AssignmentStatus;
      rating_status: RatingStatus;
      report_status: ReportStatus;
      work_type: WorkType;
      payment_mode: PaymentMode;
    };
    CompositeTypes: Record<string, never>;
  };
};
