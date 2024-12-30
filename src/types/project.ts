export interface Project {
  id: string;
  project_id: string;
  project_name: string;
  project_type: ProjectType;
  project_seller?: string;
  project_description?: string;
  project_committed_capital_usd?: number;
  created_at?: string;
  updated_at?: string;
}

export const PROJECT_TYPES = [
  'Investment',
  'Advisory',
  'Advisory Shares'
] as const;

export type ProjectType = typeof PROJECT_TYPES[number];