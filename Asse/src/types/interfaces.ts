export interface Transaction {
    id: string;
    beneficiaryName: string;
    date: string;
    direction: string;
    amount: number;
    description: string;
    currency: string;
    mcc?: number;
    kind: string;
  }
  
  export interface TransactionFilters {
    [key: string]: string | number | undefined;
    transactionKind?: string;
    startDate?: string;
    endDate?: string;
    page: number;
    pageSize?: number;
    sortBy?: string;
    sortOrder: 'asc' | 'desc';
  }
  