"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function addExpense(data: {
  date: string;
  amount: number;
  category: string;
}) {
  const supabase = await createClient();

  // ログインユーザーを取得
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("認証が必要です");
  }

  // 支出を追加
  const { error } = await supabase.from("expenses").insert({
    user_id: user.id,
    date: data.date,
    amount: data.amount,
    category: data.category,
  });

  if (error) {
    console.error("Error adding expense:", error);
    throw new Error("支出の登録に失敗しました");
  }

  // ページを再検証してデータを更新
  revalidatePath("/protected");
  revalidatePath("/");

  return { success: true };
}

export async function getExpenses() {
  const supabase = await createClient();

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error("認証が必要です");
  }

  const { data, error } = await supabase
    .from("expenses")
    .select("*")
    .eq("user_id", user.id)
    .order("date", { ascending: false });

  if (error) {
    console.error("Error fetching expenses:", error);
    throw new Error("支出の取得に失敗しました");
  }

  return data;
}
