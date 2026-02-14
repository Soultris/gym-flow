import { baseApi } from './baseApi';

interface SendOtpRequest {
  phone: string;
  type: 'member' | 'trainer';
  id: number;
}

interface VerifyOtpRequest {
  phone: string;
  type: 'member' | 'trainer';
  id: number;
  otp: string;
}

interface OtpResponse {
  success: boolean;
  message?: string;
  verified?: boolean;
  error?: string;
  retryAfter?: number;
}

export const otpApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    sendOtp: builder.mutation<OtpResponse, SendOtpRequest>({
      query: (data) => ({
        url: '/otp/send',
        method: 'POST',
        body: data,
      }),
    }),
    verifyOtp: builder.mutation<OtpResponse, VerifyOtpRequest>({
      query: (data) => ({
        url: '/otp/verify',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: (_result, _error, { type, id }) => [
        type === 'member'
          ? { type: 'Member' as const, id }
          : { type: 'Trainer' as const, id },
      ],
    }),
  }),
});

export const { useSendOtpMutation, useVerifyOtpMutation } = otpApi;
