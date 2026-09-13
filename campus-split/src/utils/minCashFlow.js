// src/utils/minCashFlow.js

export function calculateOptimizedSettlements(expenses, members) {
  const netBalances = {};
  members.forEach(m => { netBalances[m.name] = 0; });

  const rawEdges = [];
  const activeExpenses = expenses.filter(exp => !exp.isSettled);

  activeExpenses.forEach(exp => {
    const payer = exp.paidBy;
    const amount = parseFloat(exp.amount) || 0;

    if (exp.splitType === 'exact' && exp.customSplits) {
      netBalances[payer] = (netBalances[payer] || 0) + amount;
      Object.entries(exp.customSplits).forEach(([person, personShare]) => {
        const share = parseFloat(personShare) || 0;
        netBalances[person] = (netBalances[person] || 0) - share;
        if (person !== payer && share > 0) {
          rawEdges.push({ from: person, to: payer, amount: share.toFixed(2), title: exp.description });
        }
      });
    } else {
      const splits = exp.splitAmong || [];
      if (splits.length === 0) return;
      const splitAmount = amount / splits.length;

      netBalances[payer] = (netBalances[payer] || 0) + amount;
      splits.forEach(person => {
        netBalances[person] = (netBalances[person] || 0) - splitAmount;
        if (person !== payer && splitAmount > 0) {
          rawEdges.push({ from: person, to: payer, amount: splitAmount.toFixed(2), title: exp.description });
        }
      });
    }
  });

  const debtors = [];
  const creditors = [];

  Object.entries(netBalances).forEach(([person, balance]) => {
    const rounded = Math.round(balance * 100) / 100;
    if (rounded < -0.01) {
      debtors.push({ person, amount: -rounded });
    } else if (rounded > 0.01) {
      creditors.push({ person, amount: rounded });
    }
  });

  debtors.sort((a, b) => b.amount - a.amount);
  creditors.sort((a, b) => b.amount - a.amount);

  const settlements = [];
  let i = 0;
  let j = 0;

  while (i < debtors.length && j < creditors.length) {
    const minAmount = Math.min(debtors[i].amount, creditors[j].amount);

    settlements.push({
      id: `${debtors[i].person}-${creditors[j].person}-${Date.now()}-${i}-${j}`,
      from: debtors[i].person,
      to: creditors[j].person,
      amount: minAmount.toFixed(2)
    });

    debtors[i].amount -= minAmount;
    creditors[j].amount -= minAmount;

    if (debtors[i].amount < 0.01) i++;
    if (creditors[j].amount < 0.01) j++;
  }

  return { netBalances, settlements, rawEdges, activeExpensesCount: activeExpenses.length };
}