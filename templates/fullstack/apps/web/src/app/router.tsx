import { lazy, Suspense } from 'react';
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router';

import { Spinner } from '../components/ui/Spinner';
import { GuestOnly } from '../features/auth/guest-only';
import { RequireAuth } from '../features/auth/require-auth';
import { RequireRole } from '../features/auth/require-role';
import { RequireVerified } from '../features/auth/require-verified'; // add
import { RouteErrorPage } from '../pages/route-error-page';
import { RootLayout } from './root-layout';

const HomePage = lazy(() => import('../pages/home-page').then((m) => ({ default: m.HomePage })));
const LoginPage = lazy(() => import('../pages/login-page').then((m) => ({ default: m.LoginPage })));
const RegisterPage = lazy(() => import('../pages/register-page').then((m) => ({ default: m.RegisterPage })));
const VerifyEmailPage = lazy(() => import('../pages/verify-email-page').then((m) => ({ default: m.VerifyEmailPage }))); // add
const NotFoundPage = lazy(() => import('../pages/not-found-page').then((m) => ({ default: m.NotFoundPage })));
const AppHomePage = lazy(() => import('../pages/app-home-page').then((m) => ({ default: m.AppHomePage })));
const AdminPage = lazy(() => import('../pages/admin-page').then((m) => ({ default: m.AdminPage })));

function PageFallback() {
  return (
    <div className="flex items-center justify-center py-10">
      <Spinner />
    </div>
  );
}

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <RootLayout>
        <Suspense fallback={<PageFallback />}>
          <Outlet />
        </Suspense>
      </RootLayout>
    ),
    errorElement: <RouteErrorPage />,
    children: [
      { index: true, element: <HomePage /> },

      {
        path: 'login',
        element: (
          <GuestOnly>
            <LoginPage />
          </GuestOnly>
        ),
      },
      {
        path: 'register',
        element: (
          <GuestOnly>
            <RegisterPage />
          </GuestOnly>
        ),
      },

      { path: 'verify-email', element: <VerifyEmailPage /> },

      // authenticated + verified
      {
        element: <RequireAuth />,
        children: [
          {
            element: <RequireVerified />,
            children: [
              {
                path: 'app',
                children: [{ index: true, element: <AppHomePage /> }],
              },
              {
                path: 'admin',
                element: <RequireRole role="admin" />,
                children: [{ index: true, element: <AdminPage /> }],
              },
            ],
          },
        ],
      },

      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}