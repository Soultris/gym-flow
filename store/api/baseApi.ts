import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../index';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: API_BASE_URL,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
    credentials: 'include',
  }),
  tagTypes: [
    'Members',
    'Member',
    'Trainers',
    'Trainer',
    'Packages',
    'Package',
    'Transactions',
    'Transaction',
    'Attendance',
    'Products',
    'Product',
    'WorkoutTemplates',
    'WorkoutTemplate',
    'AssignedWorkouts',
    'MessageTemplates',
    'BulkMessages',
    'Dashboard',
    'Activity',
    'Users',
    'User',
    'GymProfile',
  ],
  endpoints: () => ({}),
});
