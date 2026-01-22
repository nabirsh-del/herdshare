import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(cents: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(cents / 100);
}

export function formatWeight(lbs: number): string {
  return `${lbs.toLocaleString()} lbs`;
}

export function formatDate(date: Date | string): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(date));
}

export function formatDateTime(date: Date | string): string {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(date));
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    DRAFT: 'bg-gray-100 text-gray-800',
    CHECKOUT_STARTED: 'bg-yellow-100 text-yellow-800',
    PAID: 'bg-green-100 text-green-800',
    SCHEDULED: 'bg-blue-100 text-blue-800',
    PROCESSING: 'bg-purple-100 text-purple-800',
    SHIPPED: 'bg-indigo-100 text-indigo-800',
    COMPLETED: 'bg-green-100 text-green-800',
    CANCELED: 'bg-red-100 text-red-800',
    // Commitment statuses
    PROPOSED: 'bg-yellow-100 text-yellow-800',
    CONFIRMED: 'bg-green-100 text-green-800',
    FULFILLED: 'bg-blue-100 text-blue-800',
    // Checkpoint statuses
    PASS: 'bg-green-100 text-green-800',
    FAIL: 'bg-red-100 text-red-800',
    PENDING: 'bg-gray-100 text-gray-800',
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
}

export function getProductPlanLabel(plan: string): string {
  const labels: Record<string, string> = {
    WHOLE: 'Whole Beef (~400-500 lbs)',
    HALF: 'Half Beef (~200-250 lbs)',
    QUARTER: 'Quarter Beef (~100-125 lbs)',
    CUSTOM: 'Custom Bundle',
  };
  return labels[plan] || plan;
}

export function getEstimatedWeight(plan: string): { min: number; max: number } {
  const weights: Record<string, { min: number; max: number }> = {
    WHOLE: { min: 400, max: 500 },
    HALF: { min: 200, max: 250 },
    QUARTER: { min: 100, max: 125 },
    CUSTOM: { min: 50, max: 500 },
  };
  return weights[plan] || { min: 100, max: 125 };
}
