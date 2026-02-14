import { baseApi } from './baseApi';
import { authApi } from './authApi';

export interface Gym {
  gymId: number;
  name: string;
  address: string | null;
  phone: string | null;
  fingerprintUsername: string | null;
  fingerprintPassword: string | null;
  terminalSerial: string | null;
  logoUrl: string | null;
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
  }),
});

export const {
  useGetGymProfileQuery,
  useUpdateGymProfileMutation,
} = gymApi;
