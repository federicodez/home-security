insert into public.positions (station, x, y)
select 'O', x, y
from public.positions
where station in ('O2', '02')
order by case station when 'O2' then 0 else 1 end
limit 1
on conflict (station) do update
set
  x = excluded.x,
  y = excluded.y;

delete from public.assignments
where station in ('O1', '01');

update public.assignments
set station = 'O'
where station in ('O2', '02');

delete from public.position_preferences
where station in ('O1', '01');

insert into public.position_preferences (user_id, station, rank)
select user_id, 'O', min(rank)
from public.position_preferences
where station in ('O2', '02')
group by user_id
on conflict (user_id, station) do update
set rank = least(public.position_preferences.rank, excluded.rank);

delete from public.position_preferences
where station in ('O2', '02');

delete from public.positions
where station in ('O1', '01', 'O2', '02');
