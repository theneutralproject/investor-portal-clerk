import { Bill, RampBill } from './schema';

export const mapRampBill = (bill: RampBill): Bill => {
  let project = bill.line_items[0]?.accounting_field_selections?.find(
    item => item.category_info.name === 'Project'
  );

  if (!project) {
    project = bill.accounting_field_selections?.find(
      item => item.category_info.name === 'Project'
    );
  }
  return {
    id: bill.id,
    amount: bill.amount?.amount,
    currency: bill.amount?.currency_code,
    approvalStatus: bill.approval_status,
    memo: bill.memo || '',
    payment_date: bill.payment?.payment_date,
    paymentMethod: bill.payment?.payment_method,
    project: {
      id: parseInt(project?.external_id || '', 0),
      name: project?.name || '',
    },
    status: bill.status,
    financingType: 'debt', // TODO: Determine when a ramp is equity, for now all should be 'debt'
  };
};

export const mapRampBills = (bills: RampBill[]): Bill[] =>
  bills.map(mapRampBill);

export const RAMP_TOKEN_COOKIE = 'x-ramp-token';
