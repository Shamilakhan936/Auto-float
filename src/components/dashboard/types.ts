export interface Bill {
  id: string;
  name: string;
  category: string;
  amount: number;
  due_date: string;
  status: string;
}

export interface Subscription {
  tier: "basic" | "plus" | "auto_plus";
  access_limit: number;
  access_used: number;
  is_active: boolean;
  next_settlement_date: string | null;
}

export interface Vehicle {
  is_verified: boolean;
  make: string | null;
  model: string | null;
  year: number | null;
  insurance_provider: string | null;
  insurance_verified: boolean;
  vin: string | null;
  license_plate: string | null;
}

export interface BankAccount {
  bank_name: string;
  account_last_four: string | null;
  is_connected: boolean;
}

export interface PaymentPlan {
  id: string;
  bill_id: string | null;
  total_amount: number;
  amount_paid: number;
  installment_amount: number;
  installments_total: number;
  installments_paid: number;
  status: string;
  next_payment_date: string | null;
}

export interface PaymentInstallment {
  id: string;
  payment_plan_id: string;
  amount: number;
  due_date: string;
  paid_at: string | null;
  status: string;
}


