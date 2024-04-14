import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './App.tsx';
import Login from './Login.tsx';
import SignUp from './SignUp.tsx';
import ErrorPage from './ErrorPage.tsx';
import AddURContent from './AddURContent.tsx';
import ApproveURContent from './ApproveURContent.tsx';
import EditURContent from './EditURContent.tsx';
import DeleteURContent from './DeleteURContent.tsx';
import AdminPage from './AdminPage.tsx';

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
        {
            path: 'approve-content',
            element: <ApproveURContent />,
        },
        {
            path: 'edit-content',
            element: <EditURContent />,
        },
        {
            path: 'delete-content',
            element: <DeleteURContent />,
        },
    ])
    return <RouterProvider router={router} />;
}

export default Router;