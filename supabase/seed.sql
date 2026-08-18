-- ============================================================
-- Techon Partners Onboarding Portal — Database Schema + Seed
-- Run this in the Supabase SQL Editor
-- ============================================================

-- Enable UUID extension
create extension if not exists "pgcrypto";

-- ── Tables ────────────────────────────────────────────────────

create table if not exists invite_tokens (
  id               int primary key generated always as identity,
  code             text unique not null,
  client_name      text not null,
  client_email     text not null,
  created_at       timestamptz not null default now(),
  used             boolean not null default false,
  email_sent_at    timestamptz,
  resend_email_id  text,
  email_status     text not null default 'not_sent',
  initiated_at     timestamptz
);

create table if not exists clients (
  id               uuid primary key default gen_random_uuid(),
  invite_token_id  int not null references invite_tokens(id) on delete cascade,
  first_name    text not null,
  last_name     text not null,
  email         text not null unique,
  phone         text,
  company_name  text,
  address       text,
  address2      text,
  city          text not null default '',
  state         text not null default '',
  zip           text not null default '',
  country       text not null default 'US',
  password_hash text not null,
  completed     boolean not null default false,
  created_at    timestamptz not null default now()
);

create table if not exists parts (
  id            int primary key generated always as identity,
  name          text not null,
  display_order int not null
);

create table if not exists categories (
  id            int primary key generated always as identity,
  part_id       int not null references parts(id) on delete cascade,
  name          text not null,
  display_order int not null
);

create table if not exists questions (
  id            int primary key generated always as identity,
  category_id   int not null references categories(id) on delete cascade,
  label         text not null,
  answer_type   text not null check (answer_type in ('textarea','text','number','dropdown','radio','checkbox')),
  help_text     text,
  required      boolean not null default false,
  display_order int not null
);

create table if not exists question_options (
  id            int primary key generated always as identity,
  question_id   int not null references questions(id) on delete cascade,
  label         text not null,
  display_order int not null
);

create table if not exists answers (
  client_id     uuid not null references clients(id) on delete cascade,
  question_id   int not null references questions(id) on delete cascade,
  answer_value  jsonb,
  created_at    timestamptz not null default now(),
  primary key (client_id, question_id)
);

-- ── Indexes ───────────────────────────────────────────────────

create index if not exists idx_answers_client_id   on answers(client_id);
create index if not exists idx_answers_question_id  on answers(question_id);
create index if not exists idx_questions_category   on questions(category_id);
create index if not exists idx_categories_part      on categories(part_id);
create index if not exists idx_clients_invite_token on clients(invite_token_id);

-- ── Seed: Parts ───────────────────────────────────────────────

insert into parts (id, name, display_order)
overriding system value values
  (1, 'Part 1: Vision',    1),
  (2, 'Part 2: De-Risk',   2);

select setval(pg_get_serial_sequence('parts', 'id'), 2);

-- ── Seed: Categories ──────────────────────────────────────────

insert into categories (id, part_id, name, display_order)
overriding system value values
  (1, 1, 'Company Past, Present, and Future', 1),
  (2, 1, 'CEO''s Life',                        2),
  (3, 2, 'Key Person Risk',                   3),
  (4, 2, 'Systems Risk',                      4),
  (5, 2, 'Operational Risk',                  5);

select setval(pg_get_serial_sequence('categories', 'id'), 5);

-- ── Seed: Questions ───────────────────────────────────────────

insert into questions (id, category_id, label, answer_type, help_text, required, display_order)
overriding system value values

  -- Part 1: Company Past, Present, and Future (category 1)
  (1,  1, 'What is a high-level history of the company? Who started it and why? What''s happened since its inception?',
       'textarea', null, true, 1),

  (2,  1, 'Which of the 5 Stages of Business is the company currently in, per 90 Day Year? If you think you''re between two stages, pick the lower stage as that defines where the bottleneck is for your business growth.',
       'dropdown', null, true, 2),

  (3,  1, 'If we were to meet two years from today and you were thrilled with the success you made both personally and professionally in your business, what would that look like? Paint a crystal clear picture of 2 years from today. What is different in the business? Be as specific as possible, with revenue and product/service mix defined so we can track success.',
       'textarea',
       'Example: We refactored our core software platform, improving performance by 50% while reducing hosting costs. We built a strategic partnership with a key vendor, driving a 30% revenue increase.',
       true, 3),

  (4,  1, 'How big do you ultimately want the company to get? Are you willing to do what it takes to get there?',
       'textarea', null, true, 4),

  (5,  1, 'What''s your plan to grow the company? (Check all that apply)',
       'checkbox', null, false, 5),

  -- Part 1: CEO's Life (category 2)
  (6,  2, 'Preferred method of communication — General',          'dropdown', null, false, 1),
  (7,  2, 'Preferred method of communication — Urgent matters',   'dropdown', null, false, 2),
  (8,  2, 'Preferred method of communication — Non-urgent matters','dropdown', null, false, 3),

  (9,  2, 'Do you have a strategic plan for the business?',       'radio',    null, true,  4),
  (10, 2, 'How many hours a week are you working?',               'number',   null, false, 5),
  (11, 2, 'What is your Unique Ability?',                         'textarea', null, false, 6),

  (12, 2, 'What is your Kolbe A-Index score? (4-digit score from kolbe.com)',
       'text', 'Take the 30-min Kolbe A-Index assessment at kolbe.com if you haven''t already.', false, 7),

  (13, 2, 'What business and/or networking groups are you a part of? (e.g. Genius Network, Abundance 360, EO)',
       'text', null, false, 8),

  -- Part 2: Key Person Risk (category 3)
  (14, 3, 'Please identify any technology processes and business processes that are dependent on specific individuals. What processes break if a certain person in the organization is unavailable?',
       'textarea', null, false, 1),

  (15, 3, 'How well-documented are your critical IT processes and systems?',
       'textarea', null, false, 2),

  (16, 3, 'Do you have a succession plan in place for key technology roles?',
       'textarea', null, false, 3),

  -- Part 2: Systems Risk (category 4)
  (17, 4, 'Please identify tech processes or systems dependent on a specific provider or system. What goes down if a vendor has an outage?',
       'textarea', null, false, 1),

  (18, 4, 'How do you evaluate the reliability and security of third-party providers before integrating them into your tech stack?',
       'textarea', null, false, 2),

  (19, 4, 'What is your company''s incident response plan in the event of a major outage or security breach? When was this plan last tested or updated?',
       'textarea', null, false, 3),

  (20, 4, 'How do you monitor the performance and availability of critical systems? What alerts or notifications are in place to quickly detect issues?',
       'textarea', null, false, 4),

  (21, 4, 'Have you conducted any recent vulnerability assessments or penetration testing on your technology infrastructure? If so, what were the key findings and how were they addressed?',
       'textarea', null, false, 5),

  (22, 4, 'Do you have a formal process for evaluating and implementing security patches and updates across your systems? How often are these performed?',
       'textarea', null, false, 6),

  (23, 4, 'What encryption and security controls are in place to protect sensitive data, both at rest and in transit?',
       'textarea', null, false, 7),

  -- Part 2: Operational Risk (category 5)
  (24, 5, 'What scenarios could shut down your ability to serve clients? (e.g. call center outage, email server down, website outage)',
       'textarea', null, false, 1),

  (25, 5, 'How is data backed up for key systems like email, website(s), and databases?',
       'textarea', null, false, 2),

  (26, 5, 'What is the recovery process and time required if a system fails?',
       'textarea', null, false, 3),

  (27, 5, 'What levels of redundancy exist in your backups?',
       'textarea', null, false, 4),

  (28, 5, 'Who has login credentials for all key accounts?',
       'textarea', null, false, 5),

  (29, 5, 'How are passwords managed? Do you use any shared logins? If so, for which systems? How is access to these passwords managed?',
       'textarea', null, false, 6),

  (30, 5, 'Do the right people in the organization have administrative access to critical systems? What policies are in place for this?',
       'textarea', null, false, 7),

  (31, 5, 'Are any key accounts (e.g. hosting, domains, project management software) owned by individuals, versus the company?',
       'textarea', null, false, 8),

  (32, 5, 'Are there any accounts outside of the company''s control?',
       'textarea', null, false, 9);

-- Sync identity sequence
select setval(pg_get_serial_sequence('questions', 'id'), 32);

-- ── Seed: Question Options ────────────────────────────────────

insert into question_options (question_id, label, display_order) values
  -- Q2: 5 Stages of Business
  (2, 'Start Up',  1),
  (2, 'Build Up',  2),
  (2, 'Ramp Up',   3),
  (2, 'Scale Up',  4),
  (2, 'Leader Up', 5),

  -- Q5: Growth plan
  (5, 'Acquiring/buying competitors',                                 1),
  (5, 'Being acquired',                                              2),
  (5, 'Create a lifestyle business to generate high stable revenue',  3),

  -- Q6: Communication — General
  (6, 'Call',     1), (6, 'Text', 2), (6, 'Email', 3), (6, 'WhatsApp', 4),

  -- Q7: Communication — Urgent
  (7, 'Call',     1), (7, 'Text', 2), (7, 'Email', 3), (7, 'WhatsApp', 4),

  -- Q8: Communication — Non-urgent
  (8, 'Call',     1), (8, 'Text', 2), (8, 'Email', 3), (8, 'WhatsApp', 4),

  -- Q9: Strategic plan
  (9, 'Yes', 1), (9, 'No', 2);
