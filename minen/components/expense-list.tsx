import { Card } from "@/components/ui/card";

interface Expense {
  id: string;
  date: string;
  amount: number;
  category: string;
}

interface ExpenseListProps {
  expenses: Expense[];
}

export function ExpenseList({ expenses }: ExpenseListProps) {
  if (expenses.length === 0) {
    return (
      <Card className="p-6">
        <h2 className="font-bold text-xl mb-4">支出一覧</h2>
        <p className="text-muted-foreground text-center py-8">
          まだ支出が登録されていません
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <h2 className="font-bold text-xl mb-4">支出一覧</h2>
      <div className="space-y-2">
        {expenses.map((expense) => (
          <div
            key={expense.id}
            className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent/50 transition-colors"
          >
            <div className="flex gap-3 items-center">
              <div className="text-sm text-muted-foreground">
                {new Date(expense.date).toLocaleDateString("ja-JP")}
              </div>
              <div className="px-2 py-1 bg-primary/10 text-primary text-xs rounded-full">
                {expense.category}
              </div>
            </div>
            <div className="font-semibold">
              ¥{expense.amount.toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
