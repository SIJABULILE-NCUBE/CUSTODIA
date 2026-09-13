-- i run this in the supabase SQL editor to add some starter data
-- this gives the booking dropdown and programmes page something to actually show

insert into public.facilities (name, type, capacity, description) values
  ('Main Hall', 'room', 80, 'the big multipurpose room, good for events and meetings'),
  ('Meeting Room A', 'room', 10, 'small meeting room, has a whiteboard'),
  ('Gym Floor', 'gym', 20, 'the main gym space'),
  ('Table Tennis Table', 'equipment', 4, 'one table, first come first served');

insert into public.programmes (name, description, capacity, schedule) values
  ('After School Coding Club', 'basic coding for ages 10 to 15, no experience needed', 15, 'Tuesdays and Thursdays 3pm to 4:30pm'),
  ('Youth Football', 'weekly football training and matches', 22, 'Saturdays 9am to 11am'),
  ('Homework Help', 'quiet study space with a volunteer tutor on hand', 12, 'Weekdays 4pm to 6pm');
