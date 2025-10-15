"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

const CATEGORIES = [
  "食費",
  "交通費",
  "光熱費",
  "娯楽費",
  "日用品",
  "医療費",
  "その他",
];

interface ExpenseFormProps {
  onSubmit: (expense: {
    date: string;
    amount: number;
    category: string;
  }) => Promise<{ success: boolean }>;
}

export function ExpenseForm({ onSubmit }: ExpenseFormProps) {
  const [date, setDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!amount || parseFloat(amount) <= 0) {
      alert("金額を入力してください");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        date,
        amount: parseFloat(amount),
        category,
      });

      // フォームをリセット
      setAmount("");
      setDate(new Date().toISOString().split("T")[0]);
      setCategory(CATEGORIES[0]);
    } catch (error) {
      console.error("Error submitting expense:", error);
      alert("支出の登録に失敗しました");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="p-6">
      <h2 className="font-bold text-xl mb-4">支出を記録</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="date">日付</Label>
          <Input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="amount">金額（円）</Label>
          <Input
            id="amount"
            type="number"
            min="0"
            step="1"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="1000"
            required
            className="mt-1"
          />
        </div>

        <div>
          <Label htmlFor="category">カテゴリ</Label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            required
          >
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? "登録中..." : "登録"}
        </Button>
      </form>
    </Card>
  );
}
