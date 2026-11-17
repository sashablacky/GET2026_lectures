import { ContactPage } from './ContactPage';
import { ThankYouPage } from './ThankYouPage';
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom';

const myRouterTree = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="contact" />, // statechange to the BrowserURL state
  },
  {
    path: 'contact',
    element: <ContactPage />,
    //  action: ContactPageAction, // lets you declare 'ActionMethods'
  },
  {
    path: '/thank-you/:name',
    element: <ThankYouPage />,
  },
]);

export function App() {
  return <RouterProvider router={myRouterTree} />;
}
