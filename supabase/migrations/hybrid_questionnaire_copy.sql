-- Keep clearer wording, but put extra asks back in the question label.
-- Help text is only for jargon, examples, and safety notes.

update questions
set
  label = case id
    when 1 then $q$What is a high-level history of the company? Who started it, why, and what has happened since?$q$
    when 2 then $q$Which of the 5 Stages of Business is the company in today? If you are between two stages, pick the lower one.$q$
    when 3 then $q$If we met two years from today and you were thrilled with the business — personally and professionally — what would that look like? Be specific about revenue, product/service mix, and what is different.$q$
    when 4 then $q$How big do you ultimately want the company to get, and are you willing to do what it takes to get there?$q$
    when 12 then $q$What is your Kolbe A-Index score? (4-digit score from kolbe.com)$q$
    when 14 then $q$Which technology or business processes depend on a specific person? What breaks if that person is unavailable?$q$
    when 15 then $q$How well-documented are your critical IT processes and systems?$q$
    when 17 then $q$Which tech processes or systems depend on a single vendor or platform? What goes down if that vendor has an outage?$q$
    when 19 then $q$What is the incident response plan for a major outage or security breach, and when was it last tested or updated?$q$
    when 20 then $q$How do you monitor performance and availability of critical systems, and what alerts notify you when something is wrong?$q$
    when 21 then $q$Have you done recent vulnerability assessments or penetration testing? If so, what were the key findings and how were they addressed?$q$
    when 22 then $q$How are security patches and updates evaluated and applied, and how often?$q$
    when 23 then $q$What encryption and security controls protect sensitive data, both at rest and in transit?$q$
    when 24 then $q$What scenarios could shut down your ability to serve clients? (e.g. call center outage, email server down, website outage)$q$
    when 29 then $q$How are passwords managed? Do you use shared logins, and if so for which systems and who can access those passwords?$q$
    when 30 then $q$Do the right people have admin access to critical systems, and what policy governs that?$q$
    when 43 then $q$Are integration issues between systems causing data silos, duplicate data entry, or extra work?$q$
    when 47 then $q$Are technology limitations holding back sales, marketing, or customer service (e.g. e-commerce, marketing automation, or support tools)?$q$
    when 53 then $q$Do you have someone you trust to build and ship technical work who is also a good culture fit? If yes, who are they — one person, a team, a freelancer, or an agency?$q$
    when 54 then $q$Do you have a budget for the current tech team, and for additional talent if needed?$q$
    when 57 then $q$Does the company use any project management software, and if so which one?$q$
    when 63 then $q$What core platforms currently run the business (ERP, CRM, WMS, TMS, accounting, customer portal, or software you built), and which are most critical to daily operations?$q$
    when 64 then $q$What custom software, internal apps, databases, APIs, or other technology does the company own? Who maintains them, and how actively are they developed?$q$
    when 65 then $q$Are parts of your technology hard or expensive to change because of technical debt, legacy code, heavy customization, or old decisions? Please give specific examples.$q$
    when 66 then $q$How are development, testing, and production set up? How are software changes tested, approved, deployed, and rolled back?$q$
    when 67 then $q$What volume or load do your most important systems handle today (transactions, users, data, or peak traffic), and do you know their capacity limits as you grow?$q$
    when 68 then $q$How can your major platforms integrate with other systems (APIs, webhooks, database access, or files), and are there vendor, license, or rate-limit restrictions?$q$
    when 69 then $q$Has technology been heavily customized for specific customers, locations, departments, or workflows? How hard is that to maintain as you grow?$q$
    when 70 then $q$How do you decide whether to build, customize, or buy technology, and who owns the long-term implications of those decisions?$q$
    when 80 then $q$If you could wave a magic wand, what 2–3 technology outcomes would you want in the next 90 days? Be specific and make it photographable.$q$
    else label
  end,
  help_text = case id
    when 1 then null
    when 2 then $q$From 90 Day Year. The lower stage is where growth is bottlenecked.

Start Up: proving the offer; still founder-dependent.
Build Up: the offer works; you are putting systems and a team in place.
Ramp Up: growth is stretching people and process.
Scale Up: the business can grow without the founder in every decision.
Leader Up: a leadership team runs day-to-day; you lead vision and direction.$q$
    when 3 then $q$Example: We refactored our core software platform, improving performance by 50% while reducing hosting costs. We built a strategic partnership with a key vendor, driving a 30% revenue increase.$q$
    when 4 then null
    when 12 then $q$Take the 30-min Kolbe A-Index assessment at kolbe.com if you haven't already.$q$
    when 14 then null
    when 17 then null
    when 19 then null
    when 20 then null
    when 21 then null
    when 22 then null
    when 23 then null
    when 24 then null
    when 29 then null
    when 30 then null
    when 43 then null
    when 47 then null
    when 53 then $q$This is about people who write code or update the product/site, not a CTO title by itself, and not IT helpdesk or QA unless they also do that build work.$q$
    when 54 then null
    when 57 then $q$For example Asana, Jira, Monday, or ClickUp.$q$
    when 63 then $q$ERP: enterprise resource planning, the system that runs core operations.
CRM: customer relationships.
WMS: warehouse management.
TMS: transportation / logistics.$q$
    when 64 then null
    when 65 then null
    when 66 then null
    when 67 then null
    when 68 then null
    when 69 then null
    when 70 then null
    when 80 then $q$Example: Launch XYZ project, or implement ABC system companywide.$q$
    else help_text
  end
where id in (
  1, 2, 3, 4, 12, 14, 15, 17, 19, 20, 21, 22, 23, 24, 29, 30, 43, 47,
  53, 54, 57, 63, 64, 65, 66, 67, 68, 69, 70, 80
);
