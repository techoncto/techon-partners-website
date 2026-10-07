-- Hide questionnaire structure without destroying answers already on file.
-- Client forms only show rows where deleted_at is null. Admin submission
-- history still joins answers to these rows, including completed questionnaires.

alter table parts
  add column if not exists deleted_at timestamptz;

alter table categories
  add column if not exists deleted_at timestamptz;

alter table questions
  add column if not exists deleted_at timestamptz;

alter table question_options
  add column if not exists deleted_at timestamptz;

create index if not exists idx_parts_active
  on parts (display_order)
  where deleted_at is null;

create index if not exists idx_categories_active
  on categories (part_id, display_order)
  where deleted_at is null;

create index if not exists idx_questions_active
  on questions (category_id, display_order)
  where deleted_at is null;

create index if not exists idx_question_options_active
  on question_options (question_id, display_order)
  where deleted_at is null;
