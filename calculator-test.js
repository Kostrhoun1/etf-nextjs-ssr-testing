// Test script for Emergency Fund Calculator logic
const { calculateEmergencyFund } = require('./src/utils/emergencyFundCalculations.ts');

// Test 1: Basic stable employment scenario
console.log("=== TEST 1: Basic Stable Employment ===");
const testParams1 = {
  monthlyExpenses: 40000,
  jobStability: 'stable',
  familySize: 2,
  hasSecondIncome: false,
  hasDebt: false,
  currentSavings: 50000,
  monthlySavingCapacity: 5000,
  contractType: 'permanent',
  ageGroup: 'middle',
  education: 'high_school',
  region: 'industrial'
};

try {
  const result1 = calculateEmergencyFund(testParams1);
  console.log("Recommended amount:", result1.recommendedAmount);
  console.log("Recommended months:", result1.recommendedMonths);
  console.log("Risk level:", result1.riskLevel);
  console.log("Shortfall:", result1.shortfall);
  console.log("Months to target:", result1.monthsToTarget);
} catch (error) {
  console.error("Error in test 1:", error.message);
}

// Test 2: High risk freelancer scenario
console.log("\n=== TEST 2: High Risk Freelancer ===");
const testParams2 = {
  monthlyExpenses: 60000,
  jobStability: 'unstable',
  familySize: 4,
  hasSecondIncome: false,
  hasDebt: true,
  currentSavings: 20000,
  monthlySavingCapacity: 3000,
  contractType: 'freelance',
  ageGroup: 'senior',
  education: 'basic',
  region: 'rural'
};

try {
  const result2 = calculateEmergencyFund(testParams2);
  console.log("Recommended amount:", result2.recommendedAmount);
  console.log("Recommended months:", result2.recommendedMonths);
  console.log("Risk level:", result2.riskLevel);
  console.log("Shortfall:", result2.shortfall);
  console.log("Months to target:", result2.monthsToTarget);
} catch (error) {
  console.error("Error in test 2:", error.message);
}

// Test 3: Edge cases - zero values
console.log("\n=== TEST 3: Edge Cases ===");
const testParams3 = {
  monthlyExpenses: 0, // Edge case
  jobStability: 'stable',
  familySize: 1,
  hasSecondIncome: true,
  hasDebt: false,
  currentSavings: 0,
  monthlySavingCapacity: 0,
  contractType: 'permanent',
  ageGroup: 'young',
  education: 'university',
  region: 'prague_brno'
};

try {
  const result3 = calculateEmergencyFund(testParams3);
  console.log("Recommended amount:", result3.recommendedAmount);
  console.log("Recommended months:", result3.recommendedMonths);
  console.log("Risk level:", result3.riskLevel);
  console.log("Current coverage:", result3.currentCoverage);
} catch (error) {
  console.error("Error in test 3:", error.message);
}

console.log("\n=== Emergency Fund Calculator Tests Complete ===");