import { baseApi } from './baseApi';

export interface SyncStatusResponse {
  hasPendingSyncs: boolean;
  pendingCount: number;
}

export interface SyncOperationResponse {
  message: string;
  state?: string;
  summary?: {
    totalAttempted: number;
    succeeded: number;
    failed: number;
  };
}

export const syncApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getSyncStatus: builder.query<SyncStatusResponse, void>({
      query: () => '/sync/status',
      providesTags: ['SyncStatus'],
    }),
    syncAllPendingOrFailed: builder.mutation<SyncOperationResponse, void>({
      query: () => ({
        url: '/sync/retry-all',
        method: 'POST',
      }),
      invalidatesTags: ['SyncStatus', 'Members', 'Member', 'Trainers', 'Trainer'],
    }),
    syncMember: builder.mutation<SyncOperationResponse, number | string>({
      query: (id) => ({
        url: `/sync/member/${id}`,
        method: 'POST',
      }),
      invalidatesTags: ['SyncStatus', 'Members', 'Member'],
    }),
    syncTrainer: builder.mutation<SyncOperationResponse, number | string>({
      query: (id) => ({
        url: `/sync/trainer/${id}`,
        method: 'POST',
      }),
      invalidatesTags: ['SyncStatus', 'Trainers', 'Trainer'],
    }),
  }),
});

export const {
  useGetSyncStatusQuery,
  useSyncAllPendingOrFailedMutation,
  useSyncMemberMutation,
  useSyncTrainerMutation,
} = syncApi;
