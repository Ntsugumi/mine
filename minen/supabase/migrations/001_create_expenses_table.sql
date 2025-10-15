-- 支出テーブルの作成
create table public.expenses (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users not null,
  date date not null,
  amount integer not null,
  category text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- RLS (Row Level Security) の有効化
alter table public.expenses enable row level security;

-- ユーザーは自分の支出のみ閲覧可能
create policy "Users can view their own expenses"
  on public.expenses for select
  using (auth.uid() = user_id);

-- ユーザーは自分の支出のみ追加可能
create policy "Users can insert their own expenses"
  on public.expenses for insert
  with check (auth.uid() = user_id);

-- ユーザーは自分の支出のみ更新可能
create policy "Users can update their own expenses"
  on public.expenses for update
  using (auth.uid() = user_id);

-- ユーザーは自分の支出のみ削除可能
create policy "Users can delete their own expenses"
  on public.expenses for delete
  using (auth.uid() = user_id);

-- インデックスの作成（検索を高速化）
create index expenses_user_id_idx on public.expenses(user_id);
create index expenses_date_idx on public.expenses(date);
create index expenses_category_idx on public.expenses(category);
