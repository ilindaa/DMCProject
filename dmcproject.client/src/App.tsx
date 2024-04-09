import React, { FC, Fragment, useEffect, useState } from "react";
import { createRoot } from 'react-dom/client';
import { createApi } from "unsplash-js";
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
            .getPhotos({ query: queryStr, orientation: orientationStr, per_page: 30, order_by: "latest" })
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
    const dbDisplayTitle = document.getElementById("dbDisplayTitle");
    const bodyDiv = document.getElementById("bodyDiv");

    displayTitle.innerText = category.value + " (Unsplash)";
    dbDisplayTitle.innerText = category.value + " (User Submitted Reference Content)";
    bodyDiv.replaceChildren(); // Remove all the body content

    // Create a react element: Body FC with its parameters and add the child to the bodyDiv (parent)
    const body = createRoot(bodyDiv);
    body.render(<Body queryStr={ category.value as string } orientationStr="landscape" />);
}

function showImages(jsonData: string) {
    const dataObject: MyDataThree[] = JSON.parse(jsonData);
    const dbDiv = document.getElementById("dbDiv");

    clearUlListUR();

    if (dataObject.length >= 1) {
        for (let i = 0; i < dataObject.length; i++) {
            const ulListUR = document.querySelector(".ulListUR");
            const li = document.createElement("li");
            const img = document.createElement("img");
            const p = document.createElement("p");

            li.classList.add("liUR");
            img.src = "https://localhost:7035/" + dataObject[i]["filePath"].toString();
            if (dataObject[i]["middleName"] === null) {
                p.innerText = dataObject[i]["firstName"].toString() + " " + dataObject[i]["lastName"].toString();
            } else {
                p.innerText = dataObject[i]["firstName"].toString() + " " + dataObject[i]["middleName"].toString() + " " + dataObject[i]["lastName"].toString();
            }

            ulListUR.append(li);
            li.append(img, p);
        }
    } else {
        const ulListUR = document.querySelector(".ulListUR");
        const p = document.createElement("p");
        p.innerText = "There is no user submitted reference content yet. Please check again later!";

        ulListUR.append(p);
    }
}

function clearUlListUR() {
    const ulListUR = document.querySelector(".ulListUR");
    ulListUR.replaceChildren();

    console.log("Cleared!");
}

const AppContent: FC = () => {
    useEffect(() => {
        const contentForm = document.getElementById("contentForm");
        contentForm.addEventListener("submit", function (event) {
            event.preventDefault();
            updateBodyDiv();

            // Store the form data as a FormData object then turn it into a string (JsonElement)
            const formData = new FormData(contentForm);
            console.log("formData: " + formData);

            const jsonData = JSON.stringify(Object.fromEntries(formData.entries()));
            console.log(jsonData);
            // Fetch the data to the server and send it to be handled in UserRefContentController.cs
            try {
                fetch("https://localhost:7035/api/UserRefContent/ImageContent", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: jsonData
                }).then(response => {
                    console.log(response);
                    return response.text();
                }).then(data => {
                    console.log(data);
                    showImages(data);
                })
            } catch (error) {
                console.log(error);
            }
            console.log("Submitted!");
        });

    }, []);

    return (
        <>
            <h1>Art Reference Tool</h1>
            {/* <img src="https://localhost:7035/wwwroot/References/a03b2059-33b5-4127-a876-209af3a11187.png"></img> */}
            <div className="centerDiv columnDiv">
                <div className="tabContainer">
                    <Tabs defaultActiveKey="humanAnatomy" id="tabsContent" className="mb-3">
                        <Tab eventKey="humanAnatomy" title="Human Anatomy">
                            <h3>Human Anatomy</h3>
                            <div className="centerDiv">
                                <div className="formSize homeForm">
                                    <Form id="contentForm">
                                        <Form.Control type="hidden" value="1"></Form.Control>
                                        <Form.Group className="mb-3" controlId="category">
                                            <Form.Label>Category</Form.Label>
                                            <Form.Select name="category" aria-label="Select a category" required>
                                                <option value="Figure">Figure (Full Body)</option>
                                                <option value="Hands">Hands</option>
                                                <option value="Feet">Feet</option>
                                                <option value="Portraits">Portraits</option>
                                            </Form.Select>
                                        </Form.Group>
                                        <Form.Group>
                                            <Button variant="primary" type="submit" className="w-100">Submit</Button>
                                        </Form.Group>
                                    </Form>
                                </div>
                            </div>
                        </Tab>
                        <Tab eventKey="tab2" title="Tab 2">
                            Tab content for Tab 2
                        </Tab>
                        <Tab eventKey="tab3" title="Tab 3">
                            Tab content for Tab 3
                        </Tab>
                        <Tab eventKey="tab4" title="Tab 4">
                            Tab content for Tab 4
                        </Tab>
                        <Tab eventKey="tab5" title="Tab 5">
                            Tab content for Tab 5
                        </Tab>
                        <Tab eventKey="tab6" title="Tab 6">
                            Tab content for Tab 6
                        </Tab>
                    </Tabs>
                </div>
            </div>
        </>
    );
}

interface MyDataThree {
    firstName: string;
    middleName: string;
    lastName: string;
    filePath: string;
}

function App() {
    return (
        <main className="root">
            <AppContent />
            <h1 id="displayTitle"></h1>
            <div id="bodyDiv">
            </div>
            <h1 id="dbDisplayTitle"></h1>
            <div id="dbDiv">
                <ul className="ulListUR"></ul>
            </div>
        </main>
    );
}

export default App;