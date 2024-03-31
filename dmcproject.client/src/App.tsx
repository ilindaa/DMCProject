import React, { FC, Fragment, useEffect, useState } from "react";
import { createRoot } from 'react-dom/client';
/*import "./App.css";*/
import { createApi } from "unsplash-js";
import { Link } from "react-router-dom";
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';

// DEMO CODE FROM UNSPLASH API FOR TESTING PURPOSES

type Photo = {
    id: number;
    width: number;
    height: number;
    urls: { large: string; regular: string; raw: string; small: string };
    color: string | null;
    user: {
        username: string;
        name: string;
    };
};

const api = createApi({
    // Don't forget to set your access token here!
    // See https://unsplash.com/developers
    accessKey: `${import.meta.env.VITE_UNSPLASH_API_KEY}`, // Access key in .env file
});

const PhotoComp: React.FC<{ photo: Photo }> = ({ photo }) => {
    const { user, urls } = photo;

    return (
        <Fragment>
            <img className="img" src={urls.regular} />
            <a
                className="credit"
                target="_blank"
                href={`https://unsplash.com/@${user.username}`}
            >
                {user.name}
            </a>
        </Fragment>
    );
};

const Body: React.FC<{ queryStr: string, orientationStr: string }> = ({ queryStr, orientationStr }) => {
    const [data, setPhotosResponse] = useState(null);

    useEffect(() => {
        api.search
            .getPhotos({ query: queryStr, orientation: orientationStr })
            .then(result => {
                setPhotosResponse(result);
            })
            .catch(() => {
                console.log("something went wrong!");
            });
    }, []);

    if (data === null) {
        return <div>Loading...</div>;
    } else if (data.errors) {
        return (
            <div>
                <div>{data.errors[0]}</div>
                <div>PS: Make sure to set your access token!</div>
            </div>
        );
    } else {
        return (
            <div className="feed">
                <ul className="columnUl">
                    {data.response.results.map(photo => (
                        <li key={photo.id} className="li">
                            <PhotoComp photo={photo} />
                        </li>
                    ))}
                </ul>
            </div>
        );
    }
};

function updateBodyDiv() {
    const category = document.getElementById("category") as HTMLSelectElement;
    const displayTitle = document.getElementById("displayTitle");
    const bodyDiv = document.getElementById("bodyDiv");

    displayTitle.innerText = category.value + " (Unsplash)";
    bodyDiv.replaceChildren(); // Remove all the body content

    // Create a react element: Body FC with its parameters and add the child to the bodyDiv (parent)
    const body = createRoot(bodyDiv);
    body.render(<Body queryStr={ category.value as string } orientationStr="landscape" />);
}

const AppContent: FC = () => {
    useEffect(() => {
        const contentForm = document.getElementById("contentForm");
        contentForm.addEventListener("submit", function (event) {
            event.preventDefault();
            updateBodyDiv();
        });

    }, []);

    return (
        <>
            {/* Line breaks below temporarily for now */}
            <h2>Art Reference Tool</h2>
            <Link to="add-content">Add Content</Link>
            <br />
            <Link to="login">Login</Link>
            <br />
            <Link to="sign-up">Sign Up</Link>
            <br /> 
            <Link to="admin-page">Admin</Link>
            <br />
            <br />

            <div className="tabContainer">
                <Tabs defaultActiveKey="humanAnatomy" id="tabsContent" className="mb-3">
                    <Tab eventKey="humanAnatomy" title="Human Anatomy">
                        <h3>Human Anatomy</h3>
                        <Form id="contentForm">
                            <Form.Control type="hidden" value="1"></Form.Control>
                            <Form.Group className="mb-3" controlId="category">
                                <Form.Label>Category</Form.Label>
                                <Form.Select name="category" aria-label="Select a category" required>
                                    <option value="Full Body">Figure (Full Body)</option>
                                    <option value="Hands">Hands</option>
                                    <option value="Feet">Feet</option>
                                    <option value="Portraits">Portraits</option>
                                </Form.Select>
                            </Form.Group>
                            <Form.Group>
                                <Button variant="primary" type="submit">Submit</Button>
                            </Form.Group>
                        </Form>
                    </Tab>
                    <Tab eventKey="tab2" title="Tab 2">
                        Tab content for Tab 2
                    </Tab>
                    <Tab eventKey="tab3" title="Tab 3">
                        Tab content for Tab 3
                    </Tab>
                </Tabs>
            </div>
        </>
    );
}

function App() {
    return (
        <main className="root">
            <AppContent />
            <h1 id="displayTitle"></h1>
            <div id="bodyDiv">
            </div>
        </main>
    );
}

export default App;