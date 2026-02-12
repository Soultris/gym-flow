import { baseApi } from './baseApi';

export interface Member {
  memberId: number;
  packageId: number | null;
  isPending: boolean;
  name: string;
  email: string;
  phone: string;
  dob: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  nic: string;
  height: number;
  weight: number;
  address: string;
  joiningDate: string;
  imageUrl: string | null;
  status?: 'active' | 'expired' | 'pending';
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
      query: (params) => ({
        url: '/members',
        params: params || {},
      }),
      providesTags: ['Members'],
    }),
    getMemberById: builder.query<Member, number>({
      query: (id) => `/members/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Member', id }],
    }),
    createMember: builder.mutation<Member, CreateMemberRequest>({
      query: (data) => ({
        url: '/members',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Members'],
    }),
    updateMember: builder.mutation<Member, { id: number; data: Partial<CreateMemberRequest> }>({
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
      // Invalidate all member-related queries to force refetch
      invalidatesTags: (result, error, id) => {
        if (error) return [];
        return [
          'Members',
          { type: 'Member', id },
        ];
      },
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          // Invalidate both filters to ensure both tabs update
          dispatch(membersApi.util.invalidateTags(['Members']));
        } catch (error) {
          // Error handled by mutation
        }
      },
    }),
    reactivateMember: builder.mutation<Member, number>({
      query: (id) => ({
        url: `/members/${id}/reactivate`,
        method: 'PUT',
      }),
      // Invalidate all member-related queries to force refetch
      invalidatesTags: (result, error, id) => {
        if (error) return [];
        return [
          'Members',
          { type: 'Member', id },
        ];
      },
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          // Invalidate all Members queries to update both tabs
          dispatch(membersApi.util.invalidateTags(['Members']));
        } catch (error) {
          // Error handled by mutation
        }
      },
    }),
    getMemberAttendance: builder.query<Attendance[], { id: number; from?: string; to?: string }>({
      query: ({ id, ...params }) => ({
        url: `/members/${id}/attendance`,
        params,
      }),
    }),
    getMemberTransactions: builder.query<any[], number>({
      query: (id) => `/members/${id}/transactions`,
    }),
    getMemberWorkouts: builder.query<any[], number>({
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
  useReactivateMemberMutation,
  useGetMemberAttendanceQuery,
  useGetMemberTransactionsQuery,
  useGetMemberWorkoutsQuery,
} = membersApi;
