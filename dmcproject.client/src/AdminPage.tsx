import { Link } from "react-router-dom";
/*import { FC, useEffect } from "react";*/

function AdminPage() {
    return (<>
        <h1>Admin Page</h1>
        {/* Temporary line breaks below for now */}
        <Link to="/">Back</Link>
        <br />
        <Link to="../approve-content">Approve Content</Link>
        <br />
        <Link to="../add-content">Add Content</Link>
        <br />
        <Link to="../edit-content">Edit Content</Link>
        <br />
        <Link to="../delete-content">Delete Content</Link>
        <br />
    </>);
}

export default AdminPage;