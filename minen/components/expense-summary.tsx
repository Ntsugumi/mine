import { Card } from "@/components/ui/card";

interface Expense {
  id: string;
  date: string;
  amount: number;
  category: string;
}

interface ExpenseSummaryProps {
  expenses: Expense[];
}

export function ExpenseSummary({ expenses }: ExpenseSummaryProps) {
  // 今月の支出をフィルター
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const currentMonthExpenses = expenses.filter((expense) => {
    const expenseDate = new Date(expense.date);
    return (
      expenseDate.getMonth() === currentMonth &&
      expenseDate.getFullYear() === currentYear
    );
  });

  // カテゴリごとに集計
  const categoryTotals = currentMonthExpenses.reduce(
    (acc, expense) => {
      if (!acc[expense.category]) {
        acc[expense.category] = 0;
      }
      acc[expense.category] += expense.amount;
      return acc;
    },
    {} as Record<string, number>
  );

  // カテゴリを金額の多い順にソート
  const sortedCategories = Object.entries(categoryTotals).sort(
    ([, a], [, b]) => b - a
  );

  const total = currentMonthExpenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );

  if (currentMonthExpenses.length === 0) {
    return (
      <Card className="p-6">
        <h2 className="font-bold text-xl mb-4">今月の集計</h2>
        <p className="text-muted-foreground text-center py-8">
          今月の支出がまだ登録されていません
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h2 className="font-bold text-xl mb-4">今月の集計</h2>

      <div className="mb-6 p-4 bg-primary/5 rounded-lg">
        <div className="text-sm text-muted-foreground mb-1">合計</div>
        <div className="text-3xl font-bold">
          ¥{total.toLocaleString()}
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="font-semibold text-sm text-muted-foreground">
          カテゴリ別
        </h3>
        {sortedCategories.map(([category, amount]) => {
          const percentage = (amount / total) * 100;
          return (
            <div key={category} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span>{category}</span>
                <span className="font-semibold">
                  ¥{amount.toLocaleString()}
                </span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all"
                  style={{ width: `${percentage}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
