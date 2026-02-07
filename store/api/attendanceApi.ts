import { baseApi } from './baseApi';

export interface Attendance {
  attendanceId: number;
  memberId: number;
  timestamp: string;
  member?: {
    memberId: number;
    name: string;
    email: string;
    phone: string;
    imageUrl: string | null;
  };
}

interface AttendanceResponse {
  attendance: Attendance[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface TodayAttendanceResponse {
  date: string;
  count: number;
  attendance: Attendance[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface AttendanceQueryParams {
  from?: string;
  to?: string;
  memberId?: number;
  page?: number;
  limit?: number;
}

export const attendanceApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getAttendance: builder.query<AttendanceResponse, AttendanceQueryParams | void>({
      query: (params) => ({
        url: '/attendance',
        params: params || {},
      }),
      providesTags: ['Attendance'],
    }),
    getTodayAttendance: builder.query<TodayAttendanceResponse, void>({
      query: () => '/attendance/today',
      providesTags: ['Attendance'],
    }),
    recordCheckIn: builder.mutation<Attendance, { memberId: number }>({
      query: (data) => ({
        url: '/attendance',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Attendance'],
    }),
    syncAttendance: builder.mutation<{ syncedCount: number; message: string }, void>({
      query: () => ({
        url: '/attendance/sync',
        method: 'POST',
      }),
      invalidatesTags: ['Attendance'],
    }),
  }),
});

export const {
  useGetAttendanceQuery,
  useGetTodayAttendanceQuery,
  useRecordCheckInMutation,
  useSyncAttendanceMutation,
} = attendanceApi;
