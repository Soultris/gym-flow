import { baseApi } from './baseApi';
import { authApi } from './authApi';

export interface GymTerminal {
  terminalId: string;
  gymId: number;
  name: string;
  serial: string;
  createdAt: string;
}

export interface Gym {
  gymId: number;
  name: string;
  subdomain: string;
  address?: string;
  phone?: string;
  logoUrl?: string;
  membershipFee: number;
  fingerprintUsername?: string;
  fingerprintPassword?: string;
  terminalSerial?: string; // Kept for backward compatibility if needed
  terminals?: GymTerminal[];
  smsEmail?: string;
  smsSenderId?: string;
  smsApiKey?: string;
}

export const gymApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getGymProfile: builder.query<Gym, void>({
      query: () => '/gym/profile',
      providesTags: ['GymProfile'],
    }),
    updateGymProfile: builder.mutation<Gym, FormData>({
      query: (formData) => ({
        url: '/gym/profile',
        method: 'PUT',
        body: formData,
      }),
      invalidatesTags: ['GymProfile'],
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          // Cross-API invalidation: refetch getMe so sidebar updates
          dispatch(authApi.util.invalidateTags(['User']));
        } catch {
          // ignore
        }
      },
    }),
    getGymBySubdomain: builder.query<Gym, string>({
      query: (subdomain) => `/gym/public/${subdomain}`,
    }),
    getSmsBalance: builder.query<{ balance: string; configured: boolean; email?: string }, void>({
      query: () => '/gym/sms-balance',
      providesTags: ['GymProfile'], // Invalidate when profile updates
    }),
    addTerminal: builder.mutation<GymTerminal, { serial: string; name: string; alias?: string }>({
      query: (data) => ({
        url: '/gyms/terminals',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['GymProfile'],
    }),
    deleteTerminal: builder.mutation<void, string>({
      query: (terminalId) => ({
        url: `/gyms/terminals/${terminalId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['GymProfile'],
    }),
  }),
});

export const {
  useGetGymProfileQuery,
  useUpdateGymProfileMutation,
  useGetGymBySubdomainQuery,
  useGetSmsBalanceQuery,
  useAddTerminalMutation,
  useDeleteTerminalMutation,
} = gymApi;
