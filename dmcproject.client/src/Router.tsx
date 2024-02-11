import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App.tsx';
import Login from './Login.tsx';
import Register from './Register.tsx';
import ErrorPage from './ErrorPage.tsx';

const Router = () => {
    const router = createBrowserRouter([
        {
            path: '/',
            element: <App />,
            errorElement: <ErrorPage />,
        },
        {
            path: 'login',
            element: <Login />,
        },
        {
            path: 'register',
            element: <Register />,
        },
    ])
    return <RouterProvider router={router} />;
}

export default Router;