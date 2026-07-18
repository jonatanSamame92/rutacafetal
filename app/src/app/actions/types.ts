export type ActionState = {
  ok: boolean;
  message: string;
};

export type ApprovalState = ActionState & {
  credentials?: { fullName: string; phone: string; temporaryPassword: string };
};

export const initialActionState: ActionState = { ok: false, message: "" };
