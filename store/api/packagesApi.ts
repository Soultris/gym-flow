import { baseApi } from './baseApi';

export interface Package {
  packageId: number;
  name: string;
  price: number;
  duration: number;
  durationType: 'days' | 'weeks' | 'months';
  features: string[];
  maxMembers: number;
  _count?: {
    members: number;
  };
}

export interface CreatePackageRequest {
  name: string;
  price: number;
  duration: number;
  durationType: 'days' | 'weeks' | 'months';
  features?: string[];
  maxMembers: number;
}

export const packagesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPackages: builder.query<Package[], void>({
      query: () => '/packages',
      providesTags: ['Packages'],
    }),
    getPackageById: builder.query<Package, number>({
      query: (id) => `/packages/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Package', id }],
    }),
    createPackage: builder.mutation<Package, CreatePackageRequest>({
      query: (data) => ({
        url: '/packages',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Packages'],
    }),
    updatePackage: builder.mutation<Package, { id: number; data: Partial<CreatePackageRequest> }>({
      query: ({ id, data }) => ({
        url: `/packages/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => ['Packages', { type: 'Package', id }],
    }),
    deletePackage: builder.mutation<{ message: string }, number>({
      query: (id) => ({
        url: `/packages/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Packages'],
    }),
  }),
});

export const {
  useGetPackagesQuery,
  useGetPackageByIdQuery,
  useCreatePackageMutation,
  useUpdatePackageMutation,
  useDeletePackageMutation,
} = packagesApi;
