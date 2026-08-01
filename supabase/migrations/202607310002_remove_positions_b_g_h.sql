delete from public.assignments
where station in ('B', 'G', 'H', 'b', 'g', 'h');

delete from public.position_preferences
where station in ('B', 'G', 'H', 'b', 'g', 'h');

delete from public.positions
where station in ('B', 'G', 'H', 'b', 'g', 'h');
