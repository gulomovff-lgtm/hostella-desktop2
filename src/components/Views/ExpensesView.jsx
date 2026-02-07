import React from 'react';

/**
 * Expenses View Component
 * Displays and manages expense records
 */
const ExpensesView = ({ expenses, onAddExpense }) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-800">Расходы</h2>
        <button
          onClick={onAddExpense}
          className="px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700"
        >
          + Добавить расход
        </button>
      </div>
      {/* Expenses list would go here */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-300 p-5">
        {expenses && expenses.length > 0 ? (
          <div className="space-y-3">
            {expenses.map(expense => (
              <div key={expense.id} className="flex justify-between items-center p-3 border-b last:border-b-0">
                <div>
                  <p className="font-medium text-slate-800">{expense.category}</p>
                  <p className="text-sm text-slate-500">{expense.description}</p>
                </div>
                <span className="font-bold text-red-600">{expense.amount} сум</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-slate-500 py-8">Расходов пока нет</p>
        )}
      </div>
    </div>
  );
};

export { ExpensesView };
export default ExpensesView;
