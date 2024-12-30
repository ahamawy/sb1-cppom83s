export interface Entity {
  id: string;
  entity_uuid: string;
  entity_legal_name: string;
  entity_type: string;
  country_residence_or_incorporation?: string;
  email1?: string;
  email2?: string;
  address?: string;
  created_at?: string;
  updated_at?: string;
}

export const ENTITY_TYPES = [
  'Individual Investor',
  'Company Investor',
  'Partner',
  'EquiTie Company',
  'Investee Company'
] as const;

export type EntityType = typeof ENTITY_TYPES[number];