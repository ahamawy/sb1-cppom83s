// Utility functions for transaction calculations
export const calculatePricePerUnit = (netCommitment: number, numberOfUnits: number): number => {
  if (numberOfUnits === 0) return 0;
  return netCommitment / numberOfUnits;
};

export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};