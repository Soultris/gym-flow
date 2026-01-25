import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '..';

export interface Gym {
  gymId: number;
  name: string;
  address: string | null;
  phone: string | null;
  createdAt: string;
  features: GymFeature[];
  _count?: {
    members: number;
    trainers: number;
  };
}

export interface GymFeature {
  featureId: number;
  code: string;
  name: string;
  description: string | null;
}

export const adminApi = createApi({
  reducerPath: 'adminApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_API_URL}/admin`,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Gyms', 'Gym'],
  endpoints: (builder) => ({
    getAllGyms: builder.query<Gym[], void>({
      query: () => '/gyms',
      providesTags: ['Gyms'],
    }),
    getGymById: builder.query<Gym, number>({
      query: (id) => `/gyms/${id}`,
      providesTags: (result, error, id) => [{ type: 'Gym', id }],
    }),
    createGym: builder.mutation<Gym, Partial<Gym>>({
      query: (body) => ({
        url: '/gyms',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Gyms'],
    }),
    toggleFeature: builder.mutation<void, { gymId: number; featureCode: string; enabled: boolean }>({
      query: ({ gymId, featureCode, enabled }) => ({
        url: `/gyms/${gymId}/features`,
        method: 'POST',
        body: { featureCode, enabled },
      }),
      invalidatesTags: (result, error, { gymId }) => [{ type: 'Gym', id: gymId }],
    }),
  }),
});

export const {
  useGetAllGymsQuery,
  useGetGymByIdQuery,
  useCreateGymMutation,
  useToggleFeatureMutation,
} = adminApi;
