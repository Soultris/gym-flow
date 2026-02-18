import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '..';

export interface Gym {
  gymId: number;
  name: string;
  address: string | null;
  phone: string | null;
  createdAt: string;
  features: GymFeature[];
  users?: User[]; // Admin users
  subdomain?: string;
  logoUrl?: string | null;
  _count?: {
    members: number;
    trainers: number;
  };
  smsEmail?: string | null;
  smsSenderId?: string | null;
  smsApiKey?: string | null;
  fingerprintUsername?: string | null;
  fingerprintPassword?: string | null;
  terminals?: {
    terminalId: string;
    serial: string;
    name: string;
  }[];
}

export interface User {
  userId: number;
  email: string;
  name: string;
  roleId: number;
  isActive: boolean;
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
    createGym: builder.mutation<Gym, FormData>({
      query: (formData) => ({
        url: '/gyms',
        method: 'POST',
        body: formData,
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
    updateGym: builder.mutation<Gym, { id: number; data: FormData }>({
      query: ({ id, data }) => ({
        url: `/gyms/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Gym', id }, 'Gyms'],
    }),
    createGymAdmin: builder.mutation<User, { gymId: number; data: { email: string; password: string; name: string } }>({
      query: ({ gymId, data }) => ({
        url: `/gyms/${gymId}/admins`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: (result, error, { gymId }) => [{ type: 'Gym', id: gymId }],
    }),

    deleteGym: builder.mutation<void, number>({
        query: (id) => ({
            url: `/gyms/${id}`,
            method: 'DELETE',
        }),
        invalidatesTags: ['Gyms'],
    }),
    // Terminal Management for Super Admin
    addGymTerminal: builder.mutation<any, { gymId: number; data: { serial: string; name: string; alias?: string } }>({
        query: ({ gymId, data }) => ({
            url: `/gyms/${gymId}/terminals`,
            method: 'POST',
            body: data,
        }),
        invalidatesTags: (result, error, { gymId }) => [{ type: 'Gym', id: gymId }],
    }),
    deleteGymTerminal: builder.mutation<void, { gymId: number; terminalId: string }>({
        query: ({ gymId, terminalId }) => ({
            url: `/gyms/${gymId}/terminals/${terminalId}`,
            method: 'DELETE',
        }),
        invalidatesTags: (result, error, { gymId }) => [{ type: 'Gym', id: gymId }],
    }),
    // User Management for Super Admin
    removeGymAdmin: builder.mutation<void, { gymId: number; userId: number }>({
        query: ({ gymId, userId }) => ({
            url: `/gyms/${gymId}/admins/${userId}`,
            method: 'DELETE',
        }),
        invalidatesTags: (result, error, { gymId }) => [{ type: 'Gym', id: gymId }],
    }),
    resetGymAdminPassword: builder.mutation<void, { gymId: number; userId: number; password: string }>({
        query: ({ gymId, userId, password }) => ({
            url: `/gyms/${gymId}/admins/${userId}/reset-password`,
            method: 'POST',
            body: { password },
        }),
        // No invalidation needed as it doesn't change listed data
    }),
    // SMS Balance
    getGymSmsBalance: builder.query<{ balance: string; configured: boolean; email?: string; error?: string }, number>({
        query: (gymId) => `/gyms/${gymId}/sms-balance`,
        providesTags: (result, error, gymId) => [{ type: 'Gym', id: gymId }],
    }),
  }),
});

export const {
  useGetAllGymsQuery,
  useGetGymByIdQuery,
  useCreateGymMutation,
  useToggleFeatureMutation,
  useUpdateGymMutation,
  useCreateGymAdminMutation,
  useDeleteGymMutation,
  useAddGymTerminalMutation,
  useDeleteGymTerminalMutation,
  useRemoveGymAdminMutation,
  useResetGymAdminPasswordMutation,
  useGetGymSmsBalanceQuery,
} = adminApi;
