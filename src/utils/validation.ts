import { Project } from '../types/project';
import { Transaction } from '../types/transaction';
import { Fee } from '../types/fee';

export const validateEntityForm = (data: any) => {
  const errors: Record<string, string> = {};

  if (!data.entity_legal_name?.trim()) {
    errors.entity_legal_name = 'Legal name is required';
  }

  if (!data.entity_type?.trim()) {
    errors.entity_type = 'Entity type is required';
  }

  if (data.email1 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email1)) {
    errors.email1 = 'Invalid email format';
  }

  if (data.email2 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email2)) {
    errors.email2 = 'Invalid email format';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validateProjectForm = (data: Partial<Project>) => {
  const errors: Record<string, string> = {};

  if (!data.project_name?.trim()) {
    errors.project_name = 'Project name is required';
  }

  if (!data.project_type?.trim()) {
    errors.project_type = 'Project type is required';
  }

  if (data.project_committed_capital_usd && data.project_committed_capital_usd < 0) {
    errors.project_committed_capital_usd = 'Committed capital must be positive';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validateTransactionForm = (data: Partial<Transaction>) => {
  const errors: Record<string, string> = {};

  if (!data.transaction_date) {
    errors.transaction_date = 'Transaction date is required';
  }

  if (!data.transaction_type_id) {
    errors.transaction_type_id = 'Transaction type is required';
  }

  if (!data.no_of_units || data.no_of_units <= 0) {
    errors.no_of_units = 'Number of units must be positive';
  }

  if (!data.price_per_unit_usd || data.price_per_unit_usd <= 0) {
    errors.price_per_unit_usd = 'Price per unit must be positive';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validateFeeForm = (data: Partial<Fee>) => {
  const errors: Record<string, string> = {};

  if (!data.fee_type_id) {
    errors.fee_type_id = 'Fee type is required';
  }

  if (!data.fee_status) {
    errors.fee_status = 'Fee status is required';
  }

  if (!data.amount || data.amount <= 0) {
    errors.amount = 'Amount must be positive';
  }

  if (data.due_date && new Date(data.due_date) < new Date()) {
    errors.due_date = 'Due date cannot be in the past';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};