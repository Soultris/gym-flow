import { baseApi } from './baseApi';

export interface DashboardStats {
  totalMembers: number;
  activeMembers: number;
  expiringSoon: number;
  checkInsToday: number;
  pendingPayments: number;
  totalRevenue: number;
  monthlyRevenue: number;
}

export interface Activity {
  activityId: number;
  userId: number;
  action: string;
  timestamp: string;
  type: 'transaction' | 'workout' | 'user' | 'member';
  user?: {
    userId: number;
    name: string;
  };
  member?: {
    memberId: number;
    name: string;
  };
}

interface RevenueDataPoint {
  month?: number;
  monthName?: string;
  date?: string;
  revenue: number;
}

interface RevenueChartResponse {
  period: string;
  year: number;
  data: RevenueDataPoint[];
}

interface DailyInvoiceResponse {
  summary: {
    date: string;
    totalTransactions: number;
    totalRevenue: number;
    byType: Record<string, any[]>;
    byPaymentMethod: Record<string, any[]>;
  };
  transactions: any[];
}

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardStats: builder.query<DashboardStats, void>({
      query: () => '/dashboard/stats',
      providesTags: ['Dashboard'],
    }),
    getActivityFeed: builder.query<Activity[], { limit?: number } | void>({
      query: (params) => ({
        url: '/dashboard/activity',
        params: params || {},
      }),
      providesTags: ['Activity'],
    }),
    getDailyInvoiceReport: builder.query<DailyInvoiceResponse, { date?: string } | void>({
      query: (params) => ({
        url: '/reports/daily-invoice',
        params: params || {},
      }),
    }),
    getAttendanceReport: builder.query<any, { from?: string; to?: string } | void>({
      query: (params) => ({
        url: '/reports/attendance',
        params: params || {},
      }),
    }),
    getMembershipReport: builder.query<any, void>({
      query: () => '/reports/membership',
    }),
    getRevenueChartData: builder.query<RevenueChartResponse, { period?: string; year?: number } | void>({
      query: (params) => ({
        url: '/reports/revenue',
        params: params || {},
      }),
    }),
  }),
});

export const {
  useGetDashboardStatsQuery,
  useGetActivityFeedQuery,
  useGetDailyInvoiceReportQuery,
  useGetAttendanceReportQuery,
  useGetMembershipReportQuery,
  useGetRevenueChartDataQuery,
} = dashboardApi;
