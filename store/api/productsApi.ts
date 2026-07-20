import { baseApi } from './baseApi';

export interface Product {
  productId: number;
  name: string;
  price: number;
  category: string;
  imageUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

interface CreateProductRequest {
  name: string;
  price: number;
  category: string;
  imageUrl?: string;
}

interface ProductsResponse {
  data: Product[];
  meta: {
    total: number;
    page: number;
    last_page: number;
    limit: number;
  };
}

interface ProductsQueryParams {
  category?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export const productsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getProducts: builder.query<ProductsResponse, ProductsQueryParams | void>({
      query: (params) => ({
        url: '/products',
        params: params || {},
      }),
      providesTags: ['Products'],
    }),
    getProductById: builder.query<Product, number>({
      query: (id) => `/products/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'Product', id }],
    }),
    createProduct: builder.mutation<Product, CreateProductRequest | FormData>({
      query: (data) => ({
        url: '/products',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Products'],
    }),
    updateProduct: builder.mutation<Product, { id: number; data: Partial<CreateProductRequest> | FormData }>({
      query: ({ id, data }) => ({
        url: `/products/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => ['Products', { type: 'Product', id }],
    }),
    deleteProduct: builder.mutation<{ message: string }, number>({
      query: (id) => ({
        url: `/products/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Products'],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductByIdQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
} = productsApi;
