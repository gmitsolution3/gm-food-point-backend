import { TSettings } from "./settings.model";

export type TUpdateSettingsPayload = Partial<
  Omit<
    TSettings,
    | "_id"
    | "createdAt"
    | "updatedAt"
    | "currency"
  >
>;