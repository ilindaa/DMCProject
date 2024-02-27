import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App.tsx';
import Login from './Login.tsx';
import SignUp from './SignUp.tsx';
import ErrorPage from './ErrorPage.tsx';
import AddURContent from './AddURContent.tsx';

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
            path: 'sign-up',
            element: <SignUp />,
        },
        {
            path: 'add-content',
            element: <AddURContent />,
        },
    ])
    return <RouterProvider router={router} />;
}

export default Router;