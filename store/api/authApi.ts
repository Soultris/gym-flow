import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '..';


export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  roleId?: number;
  gymId?: number;
}

export interface User {
  userId: number;
  email: string;
  name: string;
  roleId: number;
  gymId?: number;
  gymName?: string;
  gymLogoUrl?: string | null;
  features: string[];
  role?: {
    roleId: number;
    name: string;
  };
}

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_API_URL}/auth`,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['User'],
  endpoints: (builder) => ({
    getMe: builder.query<User, void>({
      query: () => '/me',
      providesTags: ['User'],
    }),
    login: builder.mutation<{ user: User; token: string }, LoginRequest>({
      query: (credentials) => ({
        url: '/login',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['User'],
    }),
    register: builder.mutation<{ user: User; token: string }, RegisterRequest>({
      query: (userData) => ({
        url: '/register',
        method: 'POST',
        body: userData,
      }),
      invalidatesTags: ['User'],
    }),
  }),
});

export const { useGetMeQuery, useLoginMutation, useRegisterMutation } = authApi;
