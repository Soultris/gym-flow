import { baseApi } from './baseApi';
import { Attendance } from './attendanceApi';
import { Transaction } from './transactionsApi';
import { AssignedWorkout } from './workoutsApi';

export interface Member {
  memberId: number;
  packageId: number | null;
  isPending: boolean;
  name: string;
  email: string;
  phone: string;
  phoneVerified?: boolean;
  dob: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  nic: string;
  height: number;
  weight: number;
  address: string;
  joiningDate: string;
  imageUrl: string | null;
  status?: 'active' | 'expired' | 'pending' | 'deactivated';
  package?: {
    packageId: number;
    name: string;
    price: number;
  };
  memberPackages?: Array<{
    memberPackageId: number;
    packageId: number;
    purchasedAt: string;
    expiresAt: string;
    package?: {
      name: string;
      price: number;
    };
  }>;
}

interface MembersResponse {
  members: Member[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface CreateMemberRequest {
  name: string;
  email: string;
  phone: string;
  dob: string;
  gender: 'male' | 'female' | 'other';
  nic: string;
  height: number;
  weight: number;
  address: string;
  joiningDate?: string;
  packageId?: number;
  imageUrl?: string;
}

interface MembersQueryParams {
  status?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export const membersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMembers: builder.query<MembersResponse, MembersQueryParams | void>({
      query: (params) => {
        // Build query parameters
        const queryParams: Record<string, string | number> = {};
        if (params) {
          if (params.status) queryParams.status = params.status;
          if (params.search) queryParams.search = params.search;
          if (params.page) queryParams.page = params.page;
          if (params.limit) queryParams.limit = params.limit;
        }
        return {
          url: '/members',
          params: queryParams,
        };
      },
      providesTags: ['Members'],
    }),
    getMemberById: builder.query<Member, number>({
      query: (id) => `/members/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Member', id }],
    }),
    createMember: builder.mutation<Member, CreateMemberRequest | FormData>({
      query: (data) => ({
        url: '/members',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Members'],
    }),
    requestMembership: builder.mutation<Member, FormData>({
      query: (formData) => ({
        url: '/members/request',
        method: 'POST',
        body: formData,
      }),
    }),
    updateMember: builder.mutation<Member, { id: number; data: Partial<CreateMemberRequest> | FormData }>({
      query: ({ id, data }) => ({
        url: `/members/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => ['Members', { type: 'Member', id }],
    }),
    deleteMember: builder.mutation<{ message: string }, number>({
      query: (id) => ({
        url: `/members/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Members'],
    }),
    approveMember: builder.mutation<Member, { id: number; packageId?: number }>({
      query: ({ id, packageId }) => ({
        url: `/members/${id}/approve`,
        method: 'PUT',
        body: { packageId },
      }),
      invalidatesTags: (_result, _error, { id }) => ['Members', { type: 'Member', id }],
    }),
    deactivateMember: builder.mutation<Member, number>({
      query: (id) => ({
        url: `/members/${id}/deactivate`,
        method: 'PUT',
      }),
      invalidatesTags: (_result, _error, id) => ['Members', { type: 'Member', id }],
    }),
    getMemberAttendance: builder.query<Attendance[], { id: number; from?: string; to?: string }>({
      query: ({ id, ...params }) => ({
        url: `/members/${id}/attendance`,
        params,
      }),
    }),
    getMemberTransactions: builder.query<Transaction[], number>({
      query: (id) => `/members/${id}/transactions`,
    }),
    getMemberWorkouts: builder.query<AssignedWorkout[], number>({
      query: (id) => `/members/${id}/workouts`,
    }),
  }),
});

export const {
  useGetMembersQuery,
  useGetMemberByIdQuery,
  useCreateMemberMutation,
  useUpdateMemberMutation,
  useDeleteMemberMutation,
  useApproveMemberMutation,
  useDeactivateMemberMutation,
  useGetMemberAttendanceQuery,
  useGetMemberTransactionsQuery,
  useGetMemberWorkoutsQuery,
  useRequestMembershipMutation,
} = membersApi;
