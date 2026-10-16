export type QuantityCheck = {
  id: 'present' | 'finite' | 'whole' | 'range';
  question: string;
  pass: boolean | null;
  explanation: string;
};
export type Estimate = {
  raw: string;
  price: number;
  quantity: number | null;
  total: number | null;
  converted: number | null;
  checks: QuantityCheck[];
  correction: string | null;
};

/** Actual ordered checks used by both Mission 4 views; null means not reached. */
export function quote(raw: string, price: number): Estimate {
  const checks: QuantityCheck[] = [
    {
      id: 'present',
      question: 'Was anything entered?',
      pass: null,
      explanation: 'Spaces alone do not supply a quantity.',
    },
    {
      id: 'finite',
      question: 'Does it become a finite number?',
      pass: null,
      explanation: 'Text is converted with JavaScript Number. Words and Infinity are refused.',
    },
    {
      id: 'whole',
      question: 'Is it a whole number?',
      pass: null,
      explanation: 'This shop counts whole items, so half an item is outside its rule.',
    },
    {
      id: 'range',
      question: 'Is it between 0 and 20?',
      pass: null,
      explanation: 'Both ends are allowed. A number can still be outside the business rule.',
    },
  ];
  const result: Estimate = {
    raw,
    price,
    quantity: null,
    total: null,
    converted: null,
    checks,
    correction: null,
  };
  checks[0].pass = raw.trim() !== '';
  if (!checks[0].pass) {
    result.correction = 'Enter a quantity. Blank is missing information, not zero.';
    return result;
  }
  const quantity = Number(raw);
  checks[1].pass = Number.isFinite(quantity);
  // Non-finite values are not serialized as JSON numbers in saved evidence.
  result.converted = Number.isFinite(quantity) ? quantity : null;
  if (!checks[1].pass) {
    result.correction = 'Use a finite number, such as 2.';
    return result;
  }
  checks[2].pass = Number.isInteger(quantity);
  if (!checks[2].pass) {
    result.correction = 'Use a whole number of items, such as 2.';
    return result;
  }
  checks[3].pass = quantity >= 0 && quantity <= 20;
  if (!checks[3].pass) {
    result.correction = 'Use a quantity from 0 to 20, including either end.';
    return result;
  }
  result.quantity = quantity;
  result.total = quantity * price;
  return result;
}

export type EstimateMemory = {
  calls: number;
  lastAttempt: Estimate | null;
  lastSuccess: Estimate | null;
};
export const emptyEstimateMemory = (): EstimateMemory => ({
  calls: 0,
  lastAttempt: null,
  lastSuccess: null,
});
/** Only an explicit call updates this teaching example's remembered result. */
export function calculateEstimate(
  previous: EstimateMemory,
  raw: string,
  price: number,
): EstimateMemory {
  const next = quote(raw, price);
  return {
    calls: previous.calls + 1,
    lastAttempt: next,
    lastSuccess: next.total === null ? previous.lastSuccess : next,
  };
}
