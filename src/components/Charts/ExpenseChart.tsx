import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Transaction } from '../../lib/supabase';

ChartJS.register(ArcElement, Tooltip, Legend);

interface ExpenseChartProps {
  transactions: Transaction[];
}

const CATEGORY_COLORS: Record<string, string> = {
  'Food & Dining': '#ef4444',
  'Transportation': '#f59e0b',
  'Shopping': '#8b5cf6',
  'Entertainment': '#ec4899',
  'Bills & Utilities': '#3b82f6',
  'Healthcare': '#10b981',
  'Education': '#06b6d4',
  'Travel': '#6366f1',
  'Other Expense': '#6b7280',
};

export function ExpenseChart({ transactions }: ExpenseChartProps) {
  const expenses = transactions.filter(t => t.type === 'expense');

  const categoryTotals = expenses.reduce((acc, transaction) => {
    acc[transaction.category] = (acc[transaction.category] || 0) + transaction.amount;
    return acc;
  }, {} as Record<string, number>);

  const sortedCategories = Object.entries(categoryTotals)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 8);

  const data = {
    labels: sortedCategories.map(([category]) => category),
    datasets: [
      {
        label: 'Expenses by Category',
        data: sortedCategories.map(([, amount]) => amount),
        backgroundColor: sortedCategories.map(([category]) =>
          CATEGORY_COLORS[category] || '#6b7280'
        ),
        borderWidth: 2,
        borderColor: '#ffffff',
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 15,
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: function(context: any) {
            const label = context.label || '';
            const value = context.parsed || 0;
            const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
            const percentage = ((value / total) * 100).toFixed(1);
            return `${label}: $${value.toFixed(2)} (${percentage}%)`;
          },
        },
      },
    },
  };

  if (expenses.length === 0) {
    return (
      <div className="flex items-center justify-center h-[300px] text-gray-400">
        <p>No expense data available</p>
      </div>
    );
  }

  return (
    <div className="h-[300px]">
      <Pie data={data} options={options} />
    </div>
  );
}
