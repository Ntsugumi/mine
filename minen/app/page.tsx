import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { ExpenseForm } from "@/components/expense-form";
import { ExpenseList } from "@/components/expense-list";
import { ExpenseSummary } from "@/components/expense-summary";
import { addExpense, getExpenses } from "./actions";

export default async function HomePage() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.getClaims();
  if (error || !data?.claims) {
    redirect("/auth/login");
  }

  // 支出データを取得
  const expenses = await getExpenses();

  return (
    <div className="flex-1 w-full flex flex-col gap-8 py-8">
      <div className="w-full">
        <h1 className="font-bold text-3xl mb-2">家計簿</h1>
        <p className="text-muted-foreground">
          支出を記録して、お金の流れを把握しましょう
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* 左側: 入力フォームと一覧 */}
        <div className="space-y-6">
          <ExpenseForm onSubmit={addExpense} />
          <ExpenseList expenses={expenses} />
        </div>

        {/* 右側: 集計 */}
        <div>
          <ExpenseSummary expenses={expenses} />
        </div>
      </div>
    </div>
  );
}
