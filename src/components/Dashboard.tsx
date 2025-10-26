import { useState } from 'react';
import { PlusCircle, Wallet, TrendingUp, TrendingDown } from 'lucide-react';
import { useTransactions } from '../hooks/useTransactions';
import { TransactionForm } from './TransactionForm';
import { TransactionTable } from './TransactionTable';
import { ExpenseChart } from './Charts/ExpenseChart';
import { IncomeExpenseChart } from './Charts/IncomeExpenseChart';

export function Dashboard() {
  const [showForm, setShowForm] = useState(false);
  const { transactions, loading, addTransaction, deleteTransaction } = useTransactions();

  const totalIncome = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpense;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center space-x-2 px-6 py-3 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 focus:ring-4 focus:ring-emerald-200 transition-all shadow-lg shadow-emerald-600/30"
        >
          <PlusCircle className="w-5 h-5" />
          <span>Add Transaction</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white bg-opacity-20 rounded-lg">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>
          <h3 className="text-emerald-100 text-sm font-medium mb-1">Total Income</h3>
          <p className="text-3xl font-bold">{formatCurrency(totalIncome)}</p>
        </div>

        <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-xl shadow-lg p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white bg-opacity-20 rounded-lg">
              <TrendingDown className="w-6 h-6" />
            </div>
          </div>
          <h3 className="text-red-100 text-sm font-medium mb-1">Total Expenses</h3>
          <p className="text-3xl font-bold">{formatCurrency(totalExpense)}</p>
        </div>

        <div className={`bg-gradient-to-br ${balance >= 0 ? 'from-blue-500 to-blue-600' : 'from-orange-500 to-orange-600'} rounded-xl shadow-lg p-6 text-white`}>
          <div className="flex items-center justify-between mb-4">
            <div className="p-3 bg-white bg-opacity-20 rounded-lg">
              <Wallet className="w-6 h-6" />
            </div>
          </div>
          <h3 className={`${balance >= 0 ? 'text-blue-100' : 'text-orange-100'} text-sm font-medium mb-1`}>Balance</h3>
          <p className="text-3xl font-bold">{formatCurrency(balance)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Income vs Expenses (Last 30 Days)</h2>
          <IncomeExpenseChart transactions={transactions} />
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Expenses by Category</h2>
          <ExpenseChart transactions={transactions} />
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Transactions</h2>
        <TransactionTable transactions={transactions} onDelete={deleteTransaction} />
      </div>

      {showForm && (
        <TransactionForm
          onSubmit={addTransaction}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  );
}
