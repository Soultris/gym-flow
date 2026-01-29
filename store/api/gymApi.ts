import { baseApi } from './baseApi';

export interface Gym {
  gymId: number;
  name: string;
  address: string | null;
  phone: string | null;
  fingerprintUsername: string | null;
  fingerprintPassword: string | null;
  terminalSerial: string | null;
}

export interface UpdateGymProfileRequest {
  name: string;
  address: string;
  phone: string;
  fingerprintUsername?: string;
  fingerprintPassword?: string;
  terminalSerial?: string;
}

export const gymApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getGymProfile: builder.query<Gym, void>({
      query: () => '/gym/profile',
      providesTags: ['GymProfile'],
    }),
    updateGymProfile: builder.mutation<Gym, UpdateGymProfileRequest>({
      query: (data) => ({
        url: '/gym/profile',
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['GymProfile'],
    }),
  }),
});

export const {
  useGetGymProfileQuery,
  useUpdateGymProfileMutation,
} = gymApi;
