const FinancialRecord = require('../models/FinancialRecord');

const getDashboardSummary = async (userId, startDate, endDate) => {
  const query = { user: userId, isDeleted: false };
  
  if (startDate || endDate) {
    query.date = {};
    if (startDate) query.date.$gte = new Date(startDate);
    if (endDate) query.date.$lte = new Date(endDate);
  }
  
  // Get all records for calculations
  const records = await FinancialRecord.find(query);
  
  // Calculate totals
  let totalIncome = 0;
  let totalExpenses = 0;
  const categoryTotals = {};
  
  records.forEach(record => {
    if (record.type === 'income') {
      totalIncome += record.amount;
    } else {
      totalExpenses += record.amount;
    }
    
    // Category-wise totals
    if (!categoryTotals[record.category]) {
      categoryTotals[record.category] = {
        income: 0,
        expense: 0,
        total: 0
      };
    }
    
    if (record.type === 'income') {
      categoryTotals[record.category].income += record.amount;
    } else {
      categoryTotals[record.category].expense += record.amount;
    }
    categoryTotals[record.category].total += record.amount;
  });
  
  const netBalance = totalIncome - totalExpenses;
  
  // Get recent transactions (last 10)
  const recentTransactions = await FinancialRecord.find(query)
    .sort({ date: -1, createdAt: -1 })
    .limit(10)
    .populate('user', 'name email');
  
  // Calculate monthly summary trends
  const monthlySummary = {};
  records.forEach(record => {
    const month = record.date.toISOString().slice(0, 7); // YYYY-MM
    if (!monthlySummary[month]) {
      monthlySummary[month] = {
        income: 0,
        expense: 0,
        net: 0
      };
    }
    
    if (record.type === 'income') {
      monthlySummary[month].income += record.amount;
    } else {
      monthlySummary[month].expense += record.amount;
    }
    monthlySummary[month].net = monthlySummary[month].income - monthlySummary[month].expense;
  });
  
  // Convert to array and sort by month
  const monthlyTrends = Object.entries(monthlySummary)
    .map(([month, data]) => ({ month, ...data }))
    .sort((a, b) => a.month.localeCompare(b.month));
  
  return {
    totalIncome,
    totalExpenses,
    netBalance,
    categoryTotals,
    recentTransactions,
    monthlyTrends,
    totalTransactions: records.length
  };
};

module.exports = { getDashboardSummary };
