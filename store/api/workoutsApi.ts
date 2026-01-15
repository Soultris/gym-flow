import { baseApi } from './baseApi';

export interface WorkoutRow {
  name: string;
  reps: string;
}

export interface WorkoutTemplate {
  templateId: number;
  name: string;
  description: string | null;
  rows: Array<{
    templateRowId: number;
    name: string;
    reps: string;
  }>;
}

export interface AssignedWorkout {
  assignedWorkoutId: number;
  memberId: number;
  name: string;
  dayNumber: number;
  startDate: string;
  endDate: string;
  assignedDate: string;
  member?: {
    memberId: number;
    name: string;
    email: string;
  };
  rows: Array<{
    assignedWorkoutRowId: number;
    name: string;
    reps: string;
  }>;
}

interface CreateTemplateRequest {
  name: string;
  description?: string;
  rows?: WorkoutRow[];
}

interface AssignWorkoutRequest {
  memberId: number;
  name: string;
  dayNumber: number;
  startDate: string;
  endDate: string;
  rows?: WorkoutRow[];
}

export const workoutsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // Workout Templates
    getWorkoutTemplates: builder.query<WorkoutTemplate[], void>({
      query: () => '/workout-templates',
      providesTags: ['WorkoutTemplates'],
    }),
    getWorkoutTemplateById: builder.query<WorkoutTemplate, number>({
      query: (id) => `/workout-templates/${id}`,
      providesTags: (_result, _error, id) => [{ type: 'WorkoutTemplate', id }],
    }),
    createWorkoutTemplate: builder.mutation<WorkoutTemplate, CreateTemplateRequest>({
      query: (data) => ({
        url: '/workout-templates',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['WorkoutTemplates'],
    }),
    updateWorkoutTemplate: builder.mutation<WorkoutTemplate, { id: number; data: Partial<CreateTemplateRequest> }>({
      query: ({ id, data }) => ({
        url: `/workout-templates/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (_result, _error, { id }) => ['WorkoutTemplates', { type: 'WorkoutTemplate', id }],
    }),
    deleteWorkoutTemplate: builder.mutation<{ message: string }, number>({
      query: (id) => ({
        url: `/workout-templates/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['WorkoutTemplates'],
    }),

    // Assigned Workouts
    getAssignedWorkouts: builder.query<AssignedWorkout[], { memberId?: number } | void>({
      query: (params) => ({
        url: '/assigned-workouts',
        params: params || {},
      }),
      providesTags: ['AssignedWorkouts'],
    }),
    assignWorkout: builder.mutation<AssignedWorkout, AssignWorkoutRequest>({
      query: (data) => ({
        url: '/assigned-workouts',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['AssignedWorkouts'],
    }),
    removeAssignedWorkout: builder.mutation<{ message: string }, number>({
      query: (id) => ({
        url: `/assigned-workouts/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['AssignedWorkouts'],
    }),
  }),
});

export const {
  useGetWorkoutTemplatesQuery,
  useGetWorkoutTemplateByIdQuery,
  useCreateWorkoutTemplateMutation,
  useUpdateWorkoutTemplateMutation,
  useDeleteWorkoutTemplateMutation,
  useGetAssignedWorkoutsQuery,
  useAssignWorkoutMutation,
  useRemoveAssignedWorkoutMutation,
} = workoutsApi;
