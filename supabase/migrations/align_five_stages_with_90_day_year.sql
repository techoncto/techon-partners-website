-- Align 5 Stages of Business copy and option order with Todd Herman / 90 Day Year:
-- Start Up, Ramp Up, Build Up, Scale Up, Leader Up.
-- https://www.90dayyear.com/the-five-stages-of-business/

update questions
set help_text = $q$From Todd Herman’s 90 Day Year. Read the full article at https://www.90dayyear.com/the-five-stages-of-business/

Start Up: validating the offer, audience, pricing, and business model.
Ramp Up: customers have started, but sales are still inconsistent. Focus on marketing and sales systems.
Build Up: revenue is consistent. Build operational systems and get work off your plate.
Scale Up: the business can grow without breaking. Develop leaders, team, and culture.
Leader Up: you are a market leader. Protect the position through leadership, innovation, and acquisitions.$q$
where id = 2;

update question_options
set display_order = case label
  when 'Start Up' then 1
  when 'Ramp Up' then 2
  when 'Build Up' then 3
  when 'Scale Up' then 4
  when 'Leader Up' then 5
  else display_order
end
where question_id = 2;
