-- Shorten compound questionnaire labels and add help text.
-- Help text with a newline is shown as a ? popover; one-line help stays under the question.

update questions
set
  label = case id
    when 1 then $q$Give a high-level history of the company.$q$
    when 2 then $q$Which of the 5 Stages of Business is the company in today?$q$
    when 3 then $q$If we met two years from today and you were thrilled with the business, what would that look like?$q$
    when 4 then $q$How big do you ultimately want the company to get?$q$
    when 12 then $q$What is your Kolbe A-Index score?$q$
    when 14 then $q$Which technology or business processes depend on a specific person?$q$
    when 15 then $q$How well documented are your critical IT processes and systems?$q$
    when 17 then $q$Which tech processes or systems depend on a single vendor or platform?$q$
    when 19 then $q$What is the incident response plan for a major outage or security breach?$q$
    when 20 then $q$How do you monitor the performance and availability of critical systems?$q$
    when 21 then $q$Have you done recent vulnerability assessments or penetration testing?$q$
    when 22 then $q$How are security patches and updates evaluated and applied across your systems?$q$
    when 23 then $q$What encryption and security controls protect sensitive data?$q$
    when 24 then $q$What scenarios could shut down your ability to serve clients?$q$
    when 29 then $q$How are passwords managed, including any shared logins?$q$
    when 30 then $q$Do the right people have admin access to critical systems?$q$
    when 43 then $q$Are integrations between systems causing silos, duplicate data entry, or extra work?$q$
    when 47 then $q$Are technology limitations holding back sales, marketing, or customer service?$q$
    when 53 then $q$Do you have someone you trust to build and ship technical work who is also a good culture fit?$q$
    when 54 then $q$Do you have budget for the current tech team, and for additional talent if needed?$q$
    when 56 then $q$How should we receive access to core systems?$q$
    when 57 then $q$Does the company use any project management software?$q$
    when 63 then $q$What core platforms currently run the business?$q$
    when 64 then $q$What custom software or internal technology does the company own?$q$
    when 65 then $q$Are parts of your technology hard or expensive to change because of legacy systems or old decisions?$q$
    when 66 then $q$How are software changes tested, approved, deployed, and rolled back?$q$
    when 67 then $q$What volume or load do your most important systems handle today?$q$
    when 68 then $q$How can your major software platforms connect to other systems?$q$
    when 69 then $q$Has technology been heavily customized for specific customers, locations, or workflows?$q$
    when 70 then $q$How do you decide whether to build, customize, or buy technology?$q$
    when 80 then $q$If you could wave a magic wand, what 2–3 technology outcomes would you want in the next 90 days?$q$
    else label
  end,
  help_text = case id
    when 1 then $q$Who started it, why, and what has happened since then.$q$
    when 2 then $q$From 90 Day Year. If you are between two stages, pick the lower one — that is where growth is bottlenecked.

Start Up: proving the offer; still founder-dependent.
Build Up: the offer works; you are putting systems and a team in place.
Ramp Up: growth is stretching people and process.
Scale Up: the business can grow without the founder in every decision.
Leader Up: a leadership team runs day-to-day; you lead vision and direction.$q$
    when 3 then $q$Be specific: revenue, product/service mix, and what is different so we can track it. Example: we refactored our core platform, cut hosting costs, and a vendor partnership drove a 30% revenue increase.$q$
    when 4 then $q$Also say whether you are willing to do what it takes to get there.$q$
    when 9 then $q$A written plan covering direction, priorities, and how you will get there — not just a vision in your head.$q$
    when 11 then $q$Your Unique Ability is the work you are unusually good at, energized by, and that creates the most value — not a job title.

If you have a Strategic Coach Unique Ability statement, paste it here. Otherwise describe it in your own words.$q$
    when 12 then $q$A 4-digit score from kolbe.com (for example 7-3-3-4). Take the ~30 minute assessment if you have not already.$q$
    when 14 then $q$What breaks if that person is unavailable?$q$
    when 15 then $q$A rough sense is fine — from "it's in someone's head" to written runbooks.$q$
    when 17 then $q$What goes down if that vendor has an outage?$q$
    when 19 then $q$Include when it was last tested or updated.$q$
    when 20 then $q$What alerts notify you when something is wrong?$q$
    when 21 then $q$If yes, what were the key findings and how were they addressed?$q$
    when 22 then $q$How often, and is there a formal process?$q$
    when 23 then $q$Include data at rest (stored) and in transit (moving over the network).$q$
    when 24 then $q$For example a call center outage, email down, or the website going offline.$q$
    when 27 then $q$For example a second backup copy, offsite storage, or a different provider.$q$
    when 29 then $q$Which systems are shared, and who can access those passwords?$q$
    when 30 then $q$What policy, if any, governs who gets those rights?$q$
    when 32 then $q$For example a domain, hosting account, or SaaS tool in a contractor's or employee's personal account.$q$
    when 47 then $q$For example missing e-commerce, weak marketing automation, or a clunky support tool.$q$
    when 53 then $q$If yes, who are they — one person, a team, a freelancer, or an agency? This means people who write code or update the product/site, not a CTO title by itself, and not IT helpdesk or QA unless they also do that build work.$q$
    when 55 then $q$A written 90-day plan with priorities and owners, not just a list of meetings.$q$
    when 56 then $q$Do not paste passwords into this form. List the systems we need access to and how we should receive credentials (for example a 1Password vault or a scheduled handoff).$q$
    when 57 then $q$If yes, which tool (for example Asana, Jira, Monday, or ClickUp)?$q$
    when 63 then $q$Name the systems that run daily operations and which ones are most critical.

Examples: ERP (enterprise resource planning), CRM (customer relationships), WMS (warehouse), TMS (transportation), accounting, a customer portal, or software you built in-house.$q$
    when 64 then $q$Apps, databases, APIs, or other systems you built. Who maintains them, and how actively are they developed?$q$
    when 65 then $q$This is often called technical debt. Please give specific examples.$q$
    when 66 then $q$Include how development, testing, and production environments are set up, if you have them.$q$
    when 67 then $q$Transactions, users, data size, or peak traffic — and any capacity limits you know about.$q$
    when 68 then $q$For example APIs, webhooks, database access, or file exports — plus any vendor, license, or rate-limit restrictions.$q$
    when 69 then $q$How hard is it to maintain those variations as you grow?$q$
    when 70 then $q$Who is responsible for the long-term technical and business implications?$q$
    when 79 then $q$Cash: you record revenue when money arrives.
Accrual: you record it when it is earned, even if unpaid.
Choose Not sure if you do not know.$q$
    when 80 then $q$Make it specific enough that we would know it happened. Example: launch XYZ, or roll out ABC companywide.$q$
    else help_text
  end
where id in (
  1, 2, 3, 4, 9, 11, 12, 14, 15, 17, 19, 20, 21, 22, 23, 24, 27, 29, 30, 32,
  43, 47, 53, 54, 55, 56, 57, 63, 64, 65, 66, 67, 68, 69, 70, 79, 80
);
