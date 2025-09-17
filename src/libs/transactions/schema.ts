import { ReturnsDealStats } from '../returns/schema';

/** Shared primitives */
export type ISODateString = string; // e.g. "2025-07-14T00:00:00+00:00"

export type RampCurrencyAmount = {
  amount: number;
  currency_code: string; // e.g. "USD"
};

/** Accounting fields */
export type RampCategoryInfoType =
  | 'GL_ACCOUNT'
  | 'OTHER' // Ramp uses OTHER for non-GL dimensions (Department/Project/etc.)
  | (string & {}); // allow forward-compat

export type RampCategoryInfo = {
  external_id: string; // e.g. "Category", "Department", "csegproject"
  id: string; // UUID
  name: string; // Human label, e.g. "Project"
  type: RampCategoryInfoType;
};

export type RampAccountingFieldSelection = {
  name: string; // Human value, e.g. "The Edison"
  external_id: string; // Value id/code in ERP, e.g. "1"
  id: string; // UUID for the mapping
  category_info: RampCategoryInfo;
  external_code: string | null; // Often same as external_id; null for some dims
};

/** Line items */
export type RampLineItem = {
  amount: RampCurrencyAmount;
  accounting_field_selections: RampAccountingFieldSelection[];
  memo: string | null;
};

/** RampVendor & contacts */
export type RampVendor = {
  name: string;
  type: 'BUSINESS' | 'INDIVIDUAL';
  remote_name: string | null;
  id: string; // UUID
  remote_id: string | null;
  remote_code: string | null;
};

export type RampBillOwner = {
  id: string;
  first_name: string;
  last_name: string;
};

/** RampPayment details */
export type RampBillPaymentDetails = {
  approval_status: string | null;
  vendor_account_id: string | null;
  source_bank_account_id: string | null;
  schema_type: string; // e.g. "VendorPaymentDetailsSchema"
};

export type RampPaymentMethod =
  | 'ACH'
  | 'AUTOMATIC_CARD_PAYMENT'
  | 'CARD'
  | 'CHECK'
  | 'DOMESTIC_WIRE'
  | 'INTERNATIONAL'
  | 'LOCAL_BANK_TRANSFER'
  | 'ONE_TIME_CARD'
  | 'ONE_TIME_CARD_DELIVERY'
  | 'PAID_MANUALLY'
  | 'SWIFT'
  | 'UNSPECIFIED'
  | 'VENDOR_CREDIT';

export type RampApprovalStatus =
  | 'APPROVED '
  | 'INITIALIZED'
  | 'PENDING '
  | 'REJECTED '
  | 'TERMINATED ';

export type RampPayment = {
  payment_date: ISODateString;
  payment_method: RampPaymentMethod;
  trace_id: string | null;
  details: RampBillPaymentDetails;
  amount: RampCurrencyAmount;
  effective_date: ISODateString;
};

export type RampBillStatus = 'PAID' | 'PENDING' | 'APPROVED' | string;

export type RampBill = {
  status: RampBillStatus;
  vendor_memo: string | null;
  line_items: RampLineItem[];
  created_at: ISODateString;
  deep_link_url: string;
  approval_status: RampApprovalStatus;
  sync_status: string;
  vendor: RampVendor;
  inventory_line_items: unknown[];
  invoice_urls: string[];
  invoice_number: string;
  paid_at: ISODateString | null;
  memo: string | null;
  accounting_date: ISODateString;
  payment: RampPayment;
  posting_date: ISODateString | null;
  fx_conversion_rate: string;
  issued_at: ISODateString;
  accounting_field_selections: RampAccountingFieldSelection[];
  entity_id: string; // UUID for entity/business
  vendor_contact_id: string; // UUID
  amount: RampCurrencyAmount;
  archived_at: ISODateString | null;
  due_at: ISODateString;
  bill_owner: RampBillOwner;
  purchase_order_id: string | null;
  id: string; // Bill UUID
  remote_id: string;
};

export interface Bill {
  id: string;
  memo: string;
  paymentMethod: RampPaymentMethod;
  project: {
    id: number;
    name: string;
  };
  amount: number;
  currency: string;
  paymentDate: ISODateString | null;
  status: RampBillStatus;
  approvalStatus: RampApprovalStatus;
  financingType: 'equity' | 'debt';
}

export type RampTokenClaims = {
  scope: 'transactions:read'; // Just read for now.
  token: string;
  sub?: string;
};

export type DealStatsPosition = Omit<ReturnsDealStats, 'project'>;

export type PositionsByProject = {
  [key: number]: { equity: DealStatsPosition[]; debt: DealStatsPosition[] };
};

export type BillPayment = Omit<Bill, 'project'>;

export type FinanceBreakdown = {
  payments: BillPayment[];
  positions: DealStatsPosition[];
};

export type ProjectFinanceBreakdown = {
  project: { id: number; name: string };
  debt: FinanceBreakdown;
  equity: FinanceBreakdown;
};

export type ProjectFinanceBreakdownByProjectId = Record<
  number,
  ProjectFinanceBreakdown
>;
