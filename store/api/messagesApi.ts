import { baseApi } from './baseApi';

export interface MessageTemplate {
  templateId: number;
  name: string;
  category: 'offers' | 'member_alerts' | 'announcements';
  message: string;
  createdAt: string;
}

export interface BulkMessage {
  bulkMessageId: number;
  message: string;
  scheduledTime: string | null;
  schedulingType: 'once' | 'weekly' | 'monthly' | 'yearly';
  recurringTime: string | null;
  occurrences: Array<{
    messageOccurrenceId: number;
    occurrenceTimestamp: string;
    status: 'sent' | 'failed' | 'scheduled' | 'removed';
    _count?: { recipients: number };
  }>;
}

interface CreateTemplateRequest {
  name: string;
  category: 'offers' | 'member_alerts' | 'announcements';
  message: string;
}

interface CreateBulkMessageRequest {
  message: string;
  scheduledTime?: string;
  schedulingType: 'once' | 'weekly' | 'monthly' | 'yearly';
  recurringTime?: string;
  recurringFrequency?: number;
  recurringDayOfWeek?: number;
  recurringDayOfMonth?: number;
  recurringMonth?: number;
  startDate?: string;
  endDate?: string;
  memberIds?: number[];
}

export const messagesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Message Templates
    getMessageTemplates: builder.query<MessageTemplate[], { category?: string } | void>({
      query: (params) => ({
        url: '/message-templates',
        params: params || {},
      }),
      providesTags: ['MessageTemplates'],
    }),
    createMessageTemplate: builder.mutation<MessageTemplate, CreateTemplateRequest>({
      query: (data) => ({
        url: '/message-templates',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['MessageTemplates'],
    }),
    updateMessageTemplate: builder.mutation<MessageTemplate, { id: number; data: Partial<CreateTemplateRequest> }>({
      query: ({ id, data }) => ({
        url: `/message-templates/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['MessageTemplates'],
    }),
    deleteMessageTemplate: builder.mutation<{ message: string }, number>({
      query: (id) => ({
        url: `/message-templates/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['MessageTemplates'],
    }),

    // Bulk Messages
    getBulkMessages: builder.query<BulkMessage[], void>({
      query: () => '/bulk-messages',
      providesTags: ['BulkMessages'],
    }),
    createBulkMessage: builder.mutation<BulkMessage, CreateBulkMessageRequest>({
      query: (data) => ({
        url: '/bulk-messages',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['BulkMessages'],
    }),
    getMessageHistory: builder.query<any[], void>({
      query: () => '/bulk-messages/history',
      providesTags: ['BulkMessages'],
    }),
    getScheduledMessages: builder.query<any[], void>({
      query: () => '/bulk-messages/scheduled',
      providesTags: ['BulkMessages'],
    }),
    cancelBulkMessage: builder.mutation<{ message: string }, number>({
      query: (id) => ({
        url: `/bulk-messages/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['BulkMessages'],
    }),
  }),
});

export const {
  useGetMessageTemplatesQuery,
  useCreateMessageTemplateMutation,
  useUpdateMessageTemplateMutation,
  useDeleteMessageTemplateMutation,
  useGetBulkMessagesQuery,
  useCreateBulkMessageMutation,
  useGetMessageHistoryQuery,
  useGetScheduledMessagesQuery,
  useCancelBulkMessageMutation,
} = messagesApi;
