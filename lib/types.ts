export type AnswerType = 'textarea' | 'text' | 'number' | 'dropdown' | 'radio' | 'checkbox'

export interface InviteToken {
  id: number
  code: string
  client_name: string
  client_email: string
  created_at: string
  used: boolean
}

export interface Client {
  id: string
  invite_token_id: number
  first_name: string
  last_name: string
  email: string
  phone: string
  company_name: string
  address: string
  password_hash: string
  completed: boolean
  created_at: string
}

export interface Part {
  id: number
  name: string
  display_order: number
}

export interface Category {
  id: number
  part_id: number
  name: string
  display_order: number
  parts?: Part
}

export interface Question {
  id: number
  category_id: number
  label: string
  answer_type: AnswerType
  help_text: string | null
  required: boolean
  display_order: number
  options?: QuestionOption[]
}

export interface QuestionOption {
  id: number
  question_id: number
  label: string
  display_order: number
  follow_up_prompt: string | null
}

export interface Answer {
  client_id: string
  question_id: number
  answer_value: string | string[] | null
  created_at: string
}

export interface CategoryWithQuestions extends Category {
  parts: Part
  questions: Question[]
}

export interface ClientWithStatus extends Omit<Client, 'password_hash'> {
  invite_tokens: Pick<InviteToken, 'code' | 'created_at' | 'client_name'>
  status: 'invited' | 'in_progress' | 'completed'
}

export interface BudgetAuditItem {
  id: number
  client_id: string
  expense: string
  cost: number | null
  purpose: string
  action: 'Keep It' | 'Review It' | 'Trash It' | ''
  billing_frequency: string
  billing_date: string
  notes: string
  display_order: number
  created_at: string
  deleted_at: string | null
}

export interface TeamMember {
  id: number
  client_id: string
  team: string
  department: string
  role: string
  resource: string
  hours_per_week: number | null
  responsibilities: string
  software_used: string
  reports_to: string
  display_order: number
  created_at: string
  deleted_at: string | null
}

export interface TeamSkillRating {
  team_member_id: number
  skill_id: string
  proficiency: number
  interest: number
}

export interface ClientOrgChart {
  id: number
  client_id: string
  file_path: string
  file_name: string
  mime_type: string
  created_at: string
}
