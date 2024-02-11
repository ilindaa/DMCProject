import { Link } from "react-router-dom";

const ErrorPage = () => {
    return (
        <>
            <h1>Error: This page does not exist!</h1>
        <Link to="/">Back</Link>
        </>
    )
}

export default ErrorPage;