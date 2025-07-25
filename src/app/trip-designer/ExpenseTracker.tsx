import React, { useState } from 'react';

interface Expense {
  id: string;
  description: string;
  amount: number;
  paidBy: string; // user id
  splitBetween: string[]; // user ids
}

interface User {
  id: string;
  name: string;
  email: string;
}

interface ExpenseTrackerProps {
  expenses: Expense[];
  onAdd: (expense: Expense) => void;
  onRemove: (id: string) => void;
  travelers: User[];
}

const defaultNewExpense = {
  description: '',
  amount: 0,
  paidBy: '',
  splitBetween: [] as string[],
};

const ExpenseTracker: React.FC<ExpenseTrackerProps> = ({ expenses, onAdd, onRemove, travelers }) => {
  const [newExpense, setNewExpense] = useState<any>(defaultNewExpense);

  const handleAdd = () => {
    if (!newExpense.description || !newExpense.amount || !newExpense.paidBy || newExpense.splitBetween.length === 0) return;
    onAdd({
      ...newExpense,
      id: 'new-' + Date.now(),
      amount: parseFloat(newExpense.amount),
    });
    setNewExpense(defaultNewExpense);
  };

  return (
    <div className="border border-gray-700 rounded-xl p-4 mb-6 bg-gray-900/80 text-gray-100">
      <h3 className="text-lg font-semibold mb-2">Expenses</h3>
      <ul className="mb-4">
        {expenses.map((exp) => (
          <li key={exp.id} className="mb-2">
            <span className="text-gray-100">{exp.description}</span>: <span className="text-gray-300">${exp.amount}</span> <span className="text-gray-400">(Paid by: {travelers.find(t => t.id === exp.paidBy)?.name || exp.paidBy})</span><br />
            <em className="text-gray-400">Split between:</em> <span className="text-gray-300">{exp.splitBetween.map(uid => travelers.find(t => t.id === uid)?.name || uid).join(', ')}</span>
            <button className="ml-2 px-2 py-1 rounded bg-red-600 hover:bg-red-700 text-white text-xs" onClick={() => onRemove(exp.id)}>
              Remove
            </button>
          </li>
        ))}
      </ul>
      <div className="mt-4">
        <h4 className="font-semibold mb-1">Add New Expense</h4>
        <label className="block mb-1">
          Description:
          <input
            type="text"
            value={newExpense.description}
            onChange={e => setNewExpense({ ...newExpense, description: e.target.value })}
            className="ml-2 px-2 py-1 rounded bg-gray-800 border border-gray-700 text-white"
          />
        </label>
        <label className="block mb-1">
          Amount:
          <input
            type="number"
            value={newExpense.amount}
            onChange={e => setNewExpense({ ...newExpense, amount: e.target.value })}
            className="ml-2 px-2 py-1 rounded bg-gray-800 border border-gray-700 text-white w-20"
            min="0"
            step="0.01"
          />
        </label>
        <label className="block mb-1">
          Paid By:
          <select
            value={newExpense.paidBy}
            onChange={e => setNewExpense({ ...newExpense, paidBy: e.target.value })}
            className="ml-2 px-2 py-1 rounded bg-gray-800 border border-gray-700 text-white"
          >
            <option value="">Select...</option>
            {travelers.map(t => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
        </label>
        <label className="block mb-1">
          Split Between:
          <select
            multiple
            value={newExpense.splitBetween}
            onChange={e => {
              const options = Array.from(e.target.selectedOptions).map(o => o.value);
              setNewExpense({ ...newExpense, splitBetween: options });
            }}
            className="ml-2 px-2 py-1 rounded bg-gray-800 border border-gray-700 text-white min-w-[120px]"
          >
            {travelers.map(t => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
        </label>
        <button className="mt-2 px-3 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white text-sm" onClick={handleAdd}>
          Add Expense
        </button>
      </div>
    </div>
  );
};

export default ExpenseTracker; 