import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '../schemas/authSchema';
import { loginRequest } from '../api/authApi';
import { getApiErrorMessage } from '../api/axios';

export default function LoginPage() {
  const [apiError, setApiError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  });

  const onSubmit = async (data) => {
    setApiError('');

    try {
      const response = await loginRequest(data);
      localStorage.setItem('accessToken', response.accessToken);
      localStorage.setItem('tokenType', response.tokenType || 'Bearer');
      window.location.href = '/persons';
    } catch (error) {
      setApiError(getApiErrorMessage(error, 'Login failed. Please check your credentials.'));
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md space-y-5 rounded-2xl border border-slate-200 bg-white p-8 shadow-xl"
      >
        <div>
          <h1 className="text-2xl font-bold text-slate-900">HRMS</h1>
          <p className="mt-1 text-sm text-slate-500">Sign in to your HR management system</p>
        </div>

        {apiError && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {apiError}
          </div>
        )}

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Email</label>
          <input
            {...register('email')}
            type="email"
            autoComplete="email"
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            placeholder="name@example.com"
          />
          {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-slate-700">Password</label>
          <input
            {...register('password')}
            type="password"
            autoComplete="current-password"
            className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            placeholder="••••••••"
          />
          {errors.password && <p className="mt-1 text-xs text-red-600">{errors.password.message}</p>}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-lg bg-indigo-600 py-2.5 font-medium text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? 'Signing in...' : 'Sign In'}
        </button>
      </form>
    </div>
  );
}
