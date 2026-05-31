import { baseApi } from './baseApi';

export interface Transaction {
  transactionId: number;
  isGuest: boolean;
  memberId: number | null;
  guestName: string | null;
  guestEmail: string | null;
  guestPhone: string | null;
  transactionType: 'membership' | 'personal_training' | 'merchandise';
  packageId: number | null;
  trainerId: number | null;
  quantity: number;
  price: number;
  paymentMethod: 'cash' | 'card';
  paidAt: string;
  additionalMemberIds?: number[];
  member?: {
    memberId: number;
    name: string;
    email: string;
  };
  package?: {
    packageId: number;
    name: string;
    price: number;
  };
  products?: Array<{
    product: {
      productId: number;
      name: string;
      price: number;
    };
    quantity: number;
  }>;
}

interface TransactionsResponse {
  transactions: Transaction[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface TransactionsQueryParams {
  from?: string;
  to?: string;
  type?: string;
  page?: number;
  limit?: number;
}

interface CreateTransactionRequest {
  isGuest?: boolean;
  memberId?: number;
  guestName?: string;
  guestEmail?: string;
  guestPhone?: string;
  transactionType: 'membership' | 'personal_training' | 'merchandise';
  packageId?: number;
  trainerId?: number;
  quantity?: number;
  price: number;
  paymentMethod: 'cash' | 'card';
  sendReceipt?: boolean;
  products?: Array<{ productId: number; quantity?: number }>;
  additionalMemberIds?: number[];
}

export interface PendingPayment {
  memberId: number;
  name: string;
  memberName?: string;
  email?: string;
  package?: {
    name: string;
    price: number;
  };
  packageName?: string;
  expiryDate: string;
  amountDue: number;
  daysOverdue: number;
}

export const transactionsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTransactions: builder.query<TransactionsResponse, TransactionsQueryParams | void>({
      query: (params) => ({
        url: '/transactions',
        params: params || {},
      }),
      providesTags: ['Transactions'],
    }),
    getTransactionById: builder.query<Transaction, number>({
      query: (id) => `/transactions/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Transaction', id }],
    }),
    createTransaction: builder.mutation<Transaction, CreateTransactionRequest>({
      query: (data) => ({
        url: '/transactions',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Transactions', 'Members'],
    }),
    getPendingPayments: builder.query<PendingPayment[], void>({
      query: () => '/transactions/pending',
      providesTags: ['Transactions'],
    }),
  }),
});

export const {
  useGetTransactionsQuery,
  useGetTransactionByIdQuery,
  useCreateTransactionMutation,
  useGetPendingPaymentsQuery,
} = transactionsApi;
