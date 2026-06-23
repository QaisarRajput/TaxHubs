import type { TaxRegimeType } from '@tax/schema';

export type SlabTaxRow = {
  slabLabel: string;
  slabMin: number;
  slabMax: number | null;
  rate: number;
  taxableAmountInSlab: number;
  taxInSlab: number;
  monthlyTaxInSlab: number;
};

export type TaxFigures = {
  grossIncome: number;
  standardDeduction: number;
  taxableIncome: number;
  incomeTax: number;
  surcharge: number;
  cess: number;
  totalTax: number;
  takeHome: number;
};

export type TaxCalculationResult = {
  annual: TaxFigures;
  monthly: TaxFigures;
  slabBreakdown: SlabTaxRow[];
  effectiveRate: number;
  surcharge: number;
  cess: number;
};

export function monthlyFromAnnual(annualSalary: number): number {
  return annualSalary / 12;
}

export function annualFromMonthly(monthlySalary: number): number {
  return monthlySalary * 12;
}

function clampToZero(value: number): number {
  return value < 0 ? 0 : value;
}

function surchargeAmount(taxBeforeSurcharge: number, taxableIncome: number, regime: TaxRegimeType): number {
  if (regime.surcharge.length === 0) {
    return 0;
  }

  let selectedRate = 0;
  for (const band of regime.surcharge) {
    if (taxableIncome > band.threshold && band.rate > selectedRate) {
      selectedRate = band.rate;
    }
  }

  return taxBeforeSurcharge * selectedRate;
}

export function calculateTax(annualIncome: number, regime: TaxRegimeType): TaxCalculationResult {
  const grossIncome = clampToZero(annualIncome);
  const standardDeduction = regime.standardDeduction ?? 0;
  const taxableIncome = clampToZero(grossIncome - standardDeduction);

  const slabBreakdown: SlabTaxRow[] = [];
  let incomeTax = 0;
  let activeSlab:
    | {
        slabMin: number;
        slabMax: number | null;
        rate: number;
        fixedAmount: number;
        taxableAmountInSlab: number;
      }
    | null = null;

  for (const slab of regime.slabs) {
    const upper = slab.max ?? Number.POSITIVE_INFINITY;
    const taxableAmountInSlab = clampToZero(Math.min(taxableIncome, upper) - slab.min);
    const isActive = taxableIncome > slab.min && taxableIncome <= upper;

    if (taxableAmountInSlab <= 0) {
      slabBreakdown.push({
        slabLabel: `${slab.min}-${slab.max ?? 'above'}`,
        slabMin: slab.min,
        slabMax: slab.max,
        rate: slab.rate,
        taxableAmountInSlab: 0,
        taxInSlab: 0,
        monthlyTaxInSlab: 0,
      });
      continue;
    }

    const computedTax = taxableAmountInSlab * slab.rate;
    incomeTax += computedTax;

    if (isActive) {
      activeSlab = {
        slabMin: slab.min,
        slabMax: slab.max,
        rate: slab.rate,
        fixedAmount: slab.fixedAmount,
        taxableAmountInSlab,
      };
    }

    slabBreakdown.push({
      slabLabel: `${slab.min}-${slab.max ?? 'above'}`,
      slabMin: slab.min,
      slabMax: slab.max,
      rate: slab.rate,
      taxableAmountInSlab,
      taxInSlab: computedTax,
      monthlyTaxInSlab: monthlyFromAnnual(computedTax),
    });
  }

  if (activeSlab && activeSlab.fixedAmount > 0) {
    incomeTax = activeSlab.fixedAmount + activeSlab.taxableAmountInSlab * activeSlab.rate;
  }

  if (regime.rebate87A && taxableIncome <= regime.rebate87A.maxIncome) {
    incomeTax = clampToZero(incomeTax - Math.min(incomeTax, regime.rebate87A.amount));
  }

  const surcharge = surchargeAmount(incomeTax, taxableIncome, regime);
  const cess = (incomeTax + surcharge) * regime.cess;
  const totalTax = incomeTax + surcharge + cess;

  const annual: TaxFigures = {
    grossIncome,
    standardDeduction,
    taxableIncome,
    incomeTax,
    surcharge,
    cess,
    totalTax,
    takeHome: grossIncome - totalTax,
  };

  const monthly: TaxFigures = {
    grossIncome: monthlyFromAnnual(annual.grossIncome),
    standardDeduction: monthlyFromAnnual(annual.standardDeduction),
    taxableIncome: monthlyFromAnnual(annual.taxableIncome),
    incomeTax: monthlyFromAnnual(annual.incomeTax),
    surcharge: monthlyFromAnnual(annual.surcharge),
    cess: monthlyFromAnnual(annual.cess),
    totalTax: monthlyFromAnnual(annual.totalTax),
    takeHome: monthlyFromAnnual(annual.takeHome),
  };

  return {
    annual,
    monthly,
    slabBreakdown,
    effectiveRate: grossIncome > 0 ? totalTax / grossIncome : 0,
    surcharge,
    cess,
  };
}

export function calculateFromMonthlySalary(
  monthlySalary: number,
  regime: TaxRegimeType,
): TaxCalculationResult {
  return calculateTax(annualFromMonthly(monthlySalary), regime);
}
