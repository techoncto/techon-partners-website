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
  initiated_at     timestamptz,
  revoked_at       timestamptz,
  revoked          boolean not null default false
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
  id                int primary key generated always as identity,
  question_id       int not null references questions(id) on delete cascade,
  label             text not null,
  display_order     int not null,
  follow_up_prompt  text
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
  (1,  1, 'What is a high-level history of the company? Who started it, why, and what has happened since?',
       'textarea', null, true, 1),

  (2,  1, 'Which of the 5 Stages of Business is the company in today? If you are between two stages, pick the lower one.',
       'dropdown',
       E'From Todd Herman’s 90 Day Year. Read the full article at https://www.90dayyear.com/the-five-stages-of-business/\n\nStart Up: validating the offer, audience, pricing, and business model.\nRamp Up: customers have started, but sales are still inconsistent. Focus on marketing and sales systems.\nBuild Up: revenue is consistent. Build operational systems and get work off your plate.\nScale Up: the business can grow without breaking. Develop leaders, team, and culture.\nLeader Up: you are a market leader. Protect the position through leadership, innovation, and acquisitions.',
       true, 2),

  (3,  1, 'If we met two years from today and you were thrilled with the business — personally and professionally — what would that look like? Be specific about revenue, product/service mix, and what is different.',
       'textarea',
       'Example: We refactored our core software platform, improving performance by 50% while reducing hosting costs. We built a strategic partnership with a key vendor, driving a 30% revenue increase.',
       true, 3),

  (4,  1, 'How big do you ultimately want the company to get, and are you willing to do what it takes to get there?',
       'textarea', null, true, 4),

  (5,  1, 'What''s your plan to grow the company? (Check all that apply)',
       'checkbox', null, false, 5),

  -- Part 1: CEO's Life (category 2)
  (6,  2, 'Preferred method of communication — General',          'dropdown', null, false, 1),
  (7,  2, 'Preferred method of communication — Urgent matters',   'dropdown', null, false, 2),
  (8,  2, 'Preferred method of communication — Non-urgent matters','dropdown', null, false, 3),

  (9,  2, 'Do you have a strategic plan for the business?',       'radio',    'A written plan covering direction, priorities, and how you will get there — not just a vision in your head.', true,  4),
  (10, 2, 'How many hours a week are you working?',               'number',   null, false, 5),
  (11, 2, 'What is your Unique Ability?',                         'textarea',
       E'Your Unique Ability is the work you are unusually good at, energized by, and that creates the most value — not a job title.\n\nIf you have a Strategic Coach Unique Ability statement, paste it here. Otherwise describe it in your own words.',
       false, 6),

  (12, 2, 'What is your Kolbe A-Index score? (4-digit score from kolbe.com)',
       'text', 'Take the 30-min Kolbe A-Index assessment at kolbe.com if you haven''t already.', false, 7),

  (13, 2, 'What business and/or networking groups are you a part of? (e.g. Genius Network, Abundance 360, EO)',
       'text', null, false, 8),

  -- Part 2: Key Person Risk (category 3)
  (14, 3, 'Which technology or business processes depend on a specific person? What breaks if that person is unavailable?',
       'textarea', null, false, 1),

  (15, 3, 'How well-documented are your critical IT processes and systems?',
       'textarea', 'A rough sense is fine — from "it''s in someone''s head" to written runbooks.', false, 2),

  (16, 3, 'Do you have a succession plan in place for key technology roles?',
       'textarea', null, false, 3),

  -- Part 2: Systems Risk (category 4)
  (17, 4, 'Which tech processes or systems depend on a single vendor or platform? What goes down if that vendor has an outage?',
       'textarea', null, false, 1),

  (18, 4, 'How do you evaluate the reliability and security of third-party providers before integrating them into your tech stack?',
       'textarea', null, false, 2),

  (19, 4, 'What is the incident response plan for a major outage or security breach, and when was it last tested or updated?',
       'textarea', null, false, 3),

  (20, 4, 'How do you monitor performance and availability of critical systems, and what alerts notify you when something is wrong?',
       'textarea', null, false, 4),

  (21, 4, 'Have you done recent vulnerability assessments or penetration testing? If so, what were the key findings and how were they addressed?',
       'textarea', null, false, 5),

  (22, 4, 'How are security patches and updates evaluated and applied, and how often?',
       'textarea', null, false, 6),

  (23, 4, 'What encryption and security controls protect sensitive data, both at rest and in transit?',
       'textarea', null, false, 7),

  -- Part 2: Operational Risk (category 5)
  (24, 5, 'What scenarios could shut down your ability to serve clients? (e.g. call center outage, email server down, website outage)',
       'textarea', null, false, 1),

  (25, 5, 'How is data backed up for key systems like email, website(s), and databases?',
       'textarea', null, false, 2),

  (26, 5, 'What is the recovery process and time required if a system fails?',
       'textarea', null, false, 3),

  (27, 5, 'What levels of redundancy exist in your backups?',
       'textarea', 'For example a second backup copy, offsite storage, or a different provider.', false, 4),

  (28, 5, 'Who has login credentials for all key accounts?',
       'textarea', null, false, 5),

  (29, 5, 'How are passwords managed? Do you use shared logins, and if so for which systems and who can access those passwords?',
       'textarea', null, false, 6),

  (30, 5, 'Do the right people have admin access to critical systems, and what policy governs that?',
       'textarea', null, false, 7),

  (31, 5, 'Are any key accounts (e.g. hosting, domains, project management software) owned by individuals, versus the company?',
       'textarea', null, false, 8),

  (32, 5, 'Are there any accounts outside of the company''s control?',
       'textarea', 'For example a domain, hosting account, or SaaS tool in a contractor''s or employee''s personal account.', false, 9);

-- Sync identity sequence
select setval(pg_get_serial_sequence('questions', 'id'), 32);

-- ── Seed: Question Options ────────────────────────────────────

insert into question_options (question_id, label, display_order, follow_up_prompt) values
  -- Q2: 5 Stages of Business
  (2, 'Start Up',  1, null),
  (2, 'Ramp Up',   2, null),
  (2, 'Build Up',  3, null),
  (2, 'Scale Up',  4, null),
  (2, 'Leader Up', 5, null),

  -- Q5: Growth plan
  (5, 'Acquiring/buying competitors',                                 1, 'What kind of businesses are you looking for and what is your timeline to acquire them?'),
  (5, 'Being acquired',                                              2, 'By whom?'),
  (5, 'Create a lifestyle business to generate high stable revenue',  3, null),

  -- Q6: Communication — General
  (6, 'Call',     1, null), (6, 'Text', 2, null), (6, 'Email', 3, null), (6, 'WhatsApp', 4, null),
  (6, 'Other',    5, 'Please specify:'),

  -- Q7: Communication — Urgent
  (7, 'Call',     1, null), (7, 'Text', 2, null), (7, 'Email', 3, null), (7, 'WhatsApp', 4, null),
  (7, 'Other',    5, 'Please specify:'),

  -- Q8: Communication — Non-urgent
  (8, 'Call',     1, null), (8, 'Text', 2, null), (8, 'Email', 3, null), (8, 'WhatsApp', 4, null),
  (8, 'Other',    5, 'Please specify:'),

  -- Q9: Strategic plan
  (9, 'Yes', 1, null), (9, 'No', 2, null);

-- ── Additional Part 2: De-Risk categories ─────────────────────

insert into categories (id, part_id, name, display_order)
overriding system value values
  (6, 2, 'Technology Systems Audit',   8),
  (7, 2, 'Market and Regulatory Risk', 6),
  (8, 2, 'Billing & Financial Risk',   7);

select setval(pg_get_serial_sequence('categories', 'id'), 8);

-- ── Part 3: Unclog ────────────────────────────────────────────

insert into parts (id, name, display_order)
overriding system value values
  (3, 'Part 3: Unclog', 3);

select setval(pg_get_serial_sequence('parts', 'id'), 3);

insert into categories (id, part_id, name, display_order)
overriding system value values
  (9,  3, 'Technology Constraints', 9),
  (10, 3, 'Operations',              10),
  (11, 3, 'Customers and Stakeholders', 11),
  (12, 3, 'Expertise',                  12),
  (13, 3, 'Current Efforts',            13);

select setval(pg_get_serial_sequence('categories', 'id'), 13);

insert into questions (id, category_id, label, answer_type, help_text, required, display_order)
overriding system value values
  (33, 6,
   'Do you have processes in place to audit licenses and cancel subscriptions you''re no longer using? If so, please describe them.',
   'textarea', null, false, 1),

  (34, 6,
   'Do you feel like there''s something you''re paying for that you''re not getting a return from?',
   'textarea', null, false, 2),

  (35, 6,
   'What is the most expensive line item in your tech spend?',
   'textarea', null, false, 3),

  -- Part 2: Market and Regulatory Risk (category 7)
  (36, 7, 'What market conditions or regulations could disrupt the business?',
   'textarea', null, false, 1),

  (37, 7, 'Are there any upcoming regulatory changes that could impact your technology systems or processes?',
   'textarea', null, false, 2),

  (38, 7, 'How do you stay informed about market and regulatory developments affecting your industry?',
   'textarea', null, false, 3),

  -- Part 2: Billing & Financial Risk (category 8)
  (39, 8, 'How do you ensure continuous operation of critical systems in the event of a billing issue or credit card expiration?',
   'textarea', null, false, 1),

  (40, 8, 'What financial controls and oversight are in place for technology-related expenses and subscriptions?',
   'textarea', null, false, 2),

  (41, 8, 'How often do you review and optimize your technology spend?',
   'textarea', null, false, 3),

  -- Part 3: Unclog — Technology Constraints (category 9)
  (42, 9, 'What manual processes are you currently doing that you''d like to automate as the company grows?',
   'textarea', null, false, 1),

  (43, 9, 'Are integration issues between systems causing data silos, duplicate data entry, or extra work?',
   'textarea', null, false, 2),

  (44, 9, 'Describe some of the technology challenges you anticipate as your customer base expands (e.g., invoicing, support, onboarding).',
   'textarea', null, false, 3),

  (45, 9, 'What are some examples of problems or limitations you''re currently facing due to gaps in your technology stack?',
   'textarea', null, false, 4),

  (46, 9, 'What are the most common complaints or pain points from end-users regarding the current technology tools and systems?',
   'textarea', null, false, 5),

  (47, 9, 'Are technology limitations holding back sales, marketing, or customer service (e.g. e-commerce, marketing automation, or support tools)?',
   'textarea', null, false, 6),

  (48, 9, 'How do you currently handle data synchronization and consistency across different departments and systems?',
   'textarea', null, false, 7),

  (49, 9, 'Are there any areas where you are still heavily reliant on spreadsheets or other manual workarounds due to gaps in your current technology stack?',
   'textarea', null, false, 8),

  (50, 9, 'Please walk me through an expensive or time-consuming workflow that you believe could be streamlined with better technology.',
   'textarea', null, false, 9),

  -- Part 3: Unclog — Operations (category 10)
  -- Org chart, roster, and skills matrix are collected on /onboard/team
  (53, 10,
   'Do you have someone you trust to build and ship technical work who is also a good culture fit? If yes, who are they — one person, a team, a freelancer, or an agency?',
   'textarea',
   'This is about people who write code or update the product/site, not a CTO title by itself, and not IT helpdesk or QA unless they also do that build work.',
   false, 1),

  (54, 10,
   'Do you have a budget for the current tech team, and for additional talent if needed?',
   'textarea', null, false, 2),

  (55, 10,
   'Do you have a quarterly plan?',
   'textarea', 'A written 90-day plan with priorities and owners, not just a list of meetings.', false, 3),

  (56, 10,
   'How should we receive access to core systems?',
   'textarea',
   'Do not paste passwords into this form. List the systems we need access to and how we should receive credentials (for example a 1Password vault or a scheduled handoff).',
   false, 4),

  (57, 10,
   'Does the company use any project management software, and if so which one?',
   'textarea', 'For example Asana, Jira, Monday, or ClickUp.', false, 5),

  (58, 10,
   'Do you have confidence in the current technology your company uses, or are you worried about scaling/growing?',
   'textarea', null, false, 6),

  (59, 10,
   'Are you looking to add or remove new team members? If so, whom, when and why?',
   'textarea', null, false, 7),

  -- Part 3: Unclog — Customers and Stakeholders (category 11)
  (60, 11, 'Who are your customers? How does technology affect their experience with your company?',
   'textarea', null, false, 1),

  (61, 11, 'Who else is serviced by technology systems (e.g. investors, employees, vendors)?',
   'textarea', null, false, 2),

  -- Part 3: Unclog — Expertise (category 12)
  (62, 12, 'As the business grows, which systems do you consider mission-critical today, and where do you see those systems starting to become a bottleneck?',
   'textarea', null, false, 1),

  (63, 12, 'What core platforms currently run the business (ERP, CRM, WMS, TMS, accounting, customer portal, or software you built), and which are most critical to daily operations?',
   'textarea',
   E'ERP: enterprise resource planning, the system that runs core operations.\nCRM: customer relationships.\nWMS: warehouse management.\nTMS: transportation / logistics.',
   false, 2),

  (64, 12, 'What custom software, internal apps, databases, APIs, or other technology does the company own? Who maintains them, and how actively are they developed?',
   'textarea', null, false, 3),

  (65, 12, 'Are parts of your technology hard or expensive to change because of technical debt, legacy code, heavy customization, or old decisions? Please give specific examples.',
   'textarea', null, false, 4),

  (66, 12, 'How are development, testing, and production set up? How are software changes tested, approved, deployed, and rolled back?',
   'textarea', null, false, 5),

  (67, 12, 'What volume or load do your most important systems handle today (transactions, users, data, or peak traffic), and do you know their capacity limits as you grow?',
   'textarea', null, false, 6),

  (68, 12, 'How can your major platforms integrate with other systems (APIs, webhooks, database access, or files), and are there vendor, license, or rate-limit restrictions?',
   'textarea', null, false, 7),

  (69, 12, 'Has technology been heavily customized for specific customers, locations, departments, or workflows? How hard is that to maintain as you grow?',
   'textarea', null, false, 8),

  (70, 12, 'How do you decide whether to build, customize, or buy technology, and who owns the long-term implications of those decisions?',
   'textarea', null, false, 9),

  (71, 12, 'What major technology investments or architectural decisions do you expect the company will need to make over the next 12 to 24 months in order to support its growth plans?',
   'textarea', null, false, 10),

  -- Part 3: Unclog — Current Efforts (category 13)
  (72, 13, 'What''s your biggest frustration in the business in general?',
   'textarea', null, false, 1),

  (73, 13, 'What''s your biggest frustration in the business related to tech?',
   'textarea', null, false, 2),

  (74, 13, 'How''s the company culture?',
   'textarea', null, false, 3),

  (75, 13, 'What are the current business initiatives? Where is the focus in the business today?',
   'textarea', null, false, 4),

  (76, 13, 'In your eyes, what are the biggest potential opportunities for the business to grow?',
   'textarea', null, false, 5),

  (77, 13, 'What are your company''s strengths in the marketplace?',
   'textarea', null, false, 6),

  (78, 13, 'Are there any looming dangers that we should know about? Any potential for bankruptcy, litigation, or other factors that could change what the company could do?',
   'textarea', null, false, 7),

  (79, 13, 'Does the company operate cash-based or accrual-based?',
   'radio',
   E'Cash: you record revenue when money arrives.\nAccrual: you record it when it is earned, even if unpaid.\nChoose Not sure if you do not know.',
   false, 8),

  (80, 13, 'If you could wave a magic wand, what 2–3 technology outcomes would you want in the next 90 days? Be specific and make it photographable.',
   'textarea',
   'Example: Launch XYZ project, or implement ABC system companywide.',
   false, 9);

select setval(pg_get_serial_sequence('questions', 'id'), 80);

insert into question_options (question_id, label, display_order, follow_up_prompt) values
  (79, 'Cash-based',    1, null),
  (79, 'Accrual-based', 2, null),
  (79, 'Not sure',      3, null);

-- ── Budget Audit Items table ──────────────────────────────────

create table if not exists budget_audit_items (
  id               int primary key generated always as identity,
  client_id        uuid not null references clients(id) on delete cascade,
  expense          text not null default '',
  cost             numeric(12,2),
  purpose          text not null default '',
  action           text check (action in ('Keep It', 'Review It', 'Trash It', '')),
  billing_frequency text not null default '',
  billing_date     text not null default '',
  notes            text not null default '',
  display_order    int not null default 0,
  created_at       timestamptz not null default now(),
  deleted_at       timestamptz
);

create index if not exists idx_budget_audit_client on budget_audit_items(client_id);
create index if not exists idx_budget_audit_client_active
  on budget_audit_items(client_id)
  where deleted_at is null;

-- ── Team Resources + Skills ───────────────────────────────────

create table if not exists team_members (
  id               int primary key generated always as identity,
  client_id        uuid not null references clients(id) on delete cascade,
  team             text not null default '',
  department       text not null default '',
  role             text not null default '',
  resource         text not null default '',
  hours_per_week   numeric(6,2),
  responsibilities  text not null default '',
  software_used    text not null default '',
  reports_to       text not null default '',
  display_order    int not null default 0,
  created_at       timestamptz not null default now(),
  deleted_at       timestamptz
);

create index if not exists idx_team_members_client on team_members(client_id);
create index if not exists idx_team_members_client_active
  on team_members(client_id)
  where deleted_at is null;

create table if not exists team_skill_ratings (
  id              int primary key generated always as identity,
  team_member_id  int not null references team_members(id) on delete cascade,
  skill_id        text not null,
  proficiency     smallint not null default 0 check (proficiency between 0 and 2),
  interest        smallint not null default 0 check (interest between 0 and 2),
  unique (team_member_id, skill_id)
);

create index if not exists idx_team_skill_ratings_member on team_skill_ratings(team_member_id);

create table if not exists client_org_charts (
  id          int primary key generated always as identity,
  client_id   uuid not null unique references clients(id) on delete cascade,
  file_path   text not null,
  file_name   text not null,
  mime_type   text not null,
  created_at  timestamptz not null default now()
);
