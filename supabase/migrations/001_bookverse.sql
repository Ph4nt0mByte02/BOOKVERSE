create extension if not exists "uuid-ossp";

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  role text not null default 'customer' check (role in ('customer', 'admin')),
  created_at timestamptz not null default now()
);

create table if not exists public.books (
  id text primary key,
  title text not null,
  author text not null,
  editorial text,
  isbn text,
  description text,
  genre text,
  genre_label text,
  formats text[] not null default array['physical', 'ebook'],
  price_cop numeric(12, 2) not null check (price_cop >= 0),
  price_usd numeric(10, 2) not null check (price_usd >= 0),
  stock integer not null default 0 check (stock >= 0),
  cover text,
  rating numeric(3, 2) default 0,
  reviews_count integer not null default 0,
  featured boolean not null default false,
  published_year integer,
  sample_content text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default uuid_generate_v4(),
  order_number text unique not null,
  customer_id uuid references auth.users(id) on delete set null,
  customer_name text not null,
  customer_email text not null,
  delivery_method text,
  delivery_address text,
  total_cop numeric(12, 2) not null check (total_cop >= 0),
  status text not null default 'pending',
  created_at timestamptz not null default now()
);

create table if not exists public.order_items (
  id uuid primary key default uuid_generate_v4(),
  order_id uuid not null references public.orders(id) on delete cascade,
  book_id text references public.books(id) on delete set null,
  title text not null,
  format text not null,
  quantity integer not null check (quantity > 0),
  unit_price_cop numeric(12, 2) not null check (unit_price_cop >= 0)
);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

alter table public.profiles enable row level security;
alter table public.books enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

create policy "Profiles can read their own profile"
  on public.profiles for select using (id = auth.uid() or public.is_admin());
create policy "Public can read books"
  on public.books for select using (true);
create policy "Admins can manage books"
  on public.books for all using (public.is_admin()) with check (public.is_admin());
create policy "Customers can create orders"
  on public.orders for insert with check (customer_id = auth.uid() or customer_id is null);
create policy "Customers can read own orders"
  on public.orders for select using (customer_id = auth.uid() or public.is_admin());
create policy "Customers can read their order items"
  on public.order_items for select using (
    exists (
      select 1 from public.orders
      where orders.id = order_items.order_id
      and (orders.customer_id = auth.uid() or public.is_admin())
    )
  );

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'name', new.email));
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
