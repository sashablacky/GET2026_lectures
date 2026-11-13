import { ContactPage, contactPageAction } from './ContactPage';
import { ThankYouPage } from './ThankYouPage';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';

const myRouterTree = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="contact" />,
  },
  {
    path: 'contact',
    element: <ContactPage />,
    action: contactPageAction,
  },
  {
    path: '/thank-you/:name',
    element: <ThankYouPage />,
  },
]);
export function App() {
  return <RouterProvider router={myRouterTree} />;
}
