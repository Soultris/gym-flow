import { baseApi } from './baseApi';

export interface Trainer {
  trainerId: number;
  name: string;
  phone: string;
  phoneVerified?: boolean;
  specialization: string;
  isPending: boolean;
  strikePoints: number;
  imageUrl?: string;
  dob?: string | null;
  age?: number | null;
  gender?: string | null;
  nic?: string | null;
  address?: string | null;
  _count?: {
    transactions: number;
  };
}

interface CreateTrainerRequest {
  name: string;
  phone: string;
  specialization: string;
}

export const trainersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getTrainers: builder.query<Trainer[], void>({
      query: () => '/trainers',
      providesTags: ['Trainers'],
    }),
    getTrainerById: builder.query<Trainer, number>({
      query: (id) => `/trainers/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Trainer', id }],
    }),
    createTrainer: builder.mutation<Trainer, CreateTrainerRequest | FormData>({
      query: (data) => ({
        url: '/trainers',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Trainers'],
    }),
    updateTrainer: builder.mutation<Trainer, { id: number; data: Partial<CreateTrainerRequest> | FormData }>({
      query: ({ id, data }) => ({
        url: `/trainers/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => ['Trainers', { type: 'Trainer', id }],
    }),
    deleteTrainer: builder.mutation<{ message: string }, number>({
      query: (id) => ({
        url: `/trainers/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Trainers'],
    }),
    approveTrainer: builder.mutation<Trainer, number>({
      query: (id) => ({
        url: `/trainers/${id}/approve`,
        method: 'PUT',
      }),
      invalidatesTags: (_result, _error, id) => ['Trainers', { type: 'Trainer', id }],
    }),
    signupTrainer: builder.mutation<{ message: string; trainer: Trainer }, {
      email: string;
      password: string;
      name: string;
      phone: string;
      specialization: string;
      subdomain: string;
      imageUrl?: File | string;
    } | FormData>({
      query: (data) => ({
        url: '/trainers/signup',
        method: 'POST',
        body: data,
      }),
    }),
    updateStrikePoints: builder.mutation<{ message: string; trainer: Trainer }, { id: number; strikePoints: number }>({
      query: ({ id, strikePoints }) => ({
        url: `/trainers/${id}/strike`,
        method: 'PUT',
        body: { strikePoints },
      }),
      invalidatesTags: (_result, _error, { id }) => ['Trainers', { type: 'Trainer', id }],
    }),
  }),
});

export const {
  useGetTrainersQuery,
  useGetTrainerByIdQuery,
  useCreateTrainerMutation,
  useUpdateTrainerMutation,
  useDeleteTrainerMutation,
  useApproveTrainerMutation,
  useSignupTrainerMutation,
  useUpdateStrikePointsMutation,
} = trainersApi;
