import React, { FC, Fragment, useEffect, useState } from "react";
import { createRoot } from 'react-dom/client';
import { createApi } from "unsplash-js";
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
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
            <Card style={{ width: '18rem' }}>
                <Card.Img variant="top" src={urls.regular} />
                <Card.Body>
                    <Card.Title>
                        <a
                            className="credit"
                            target="_blank"
                            href={`https://unsplash.com/@${user.username}`}
                        >
                            {user.name}
                        </a>
                    </Card.Title>
                </Card.Body>
            </Card>
        </Fragment>
    );
};

const Body: React.FC<{ queryStr: string, orientationStr: string }> = ({ queryStr, orientationStr }) => {
    const [data, setPhotosResponse] = useState(null);

    useEffect(() => {
        api.search
            .getPhotos({ query: queryStr, orientation: orientationStr, per_page: 30, order_by: "relevant" })
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
    const mainModal = document.getElementById("mainModal");

    mainModal.style.display = "none";

    displayTitle.innerText = category.value + " (Unsplash)";
    dbDisplayTitle.innerText = category.value + " (User Submitted Reference Content)";
    bodyDiv.replaceChildren(); // Remove all the body content

    // Create a react element: Body FC with its parameters and add the child to the bodyDiv (parent)
    const body = createRoot(bodyDiv);
    body.render(<Body queryStr={ category.value as string } orientationStr="landscape" />);
}

function showImages(jsonData: string) {
    const dataObject: MyDataThree[] = JSON.parse(jsonData);

    clearUlListUR();

    if (dataObject.length >= 1) {
        for (let i = 0; i < dataObject.length; i++) {
            const ulListUR = document.querySelector(".ulListUR");
            const li = document.createElement("li");

            const div = document.createElement("div");
            const img = document.createElement("img");
            const div2 = document.createElement("div");
            const div3 = document.createElement("div");
            const p = document.createElement("p");

            li.classList.add("liUR");
            div.classList.add("card");
            img.classList.add("card-img-top");
            div2.classList.add("card-body");
            div3.classList.add("card-title", "h5");
            p.classList.add("credit");

            img.src = "https://localhost:7035/" + dataObject[i]["filePath"].toString();
            if (dataObject[i]["middleName"] === null) {
                p.innerText = dataObject[i]["firstName"].toString() + " " + dataObject[i]["lastName"].toString();
            } else {
                p.innerText = dataObject[i]["firstName"].toString() + " " + dataObject[i]["middleName"].toString() + " " + dataObject[i]["lastName"].toString();
            }

            ulListUR.append(li);
            li.append(div);
            div.append(img, div2);
            div2.append(div3);
            div3.append(p);
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

function hideUnhideModal() {
    const mainModal = document.getElementById("mainModal");
    const display = mainModal.style.display;

    if (display == "block") {
        mainModal.style.display = "none";
    } else {
        mainModal.style.display = "block";
    }
}

const AppContent: FC = () => {
    useEffect(() => {
        const navbar = document.querySelector(".me-auto.navbar-nav");
        const button = document.createElement("button");
        button.innerText = "Hide/Unhide Tool";
        button.classList.add("btn", "btn-secondary");
        navbar.append(button);

        button.addEventListener("click", hideUnhideModal);

        const forms = document.querySelectorAll(".contentForm");
        forms.forEach(form => {
            form.addEventListener("submit", function (event) {
                event.preventDefault();
                updateBodyDiv();

                // Store the form data as a FormData object then turn it into a string (JsonElement)
                const formData = new FormData(event.target as HTMLFormElement);
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
        });

    }, []);

    return (
        <>
            <div id="mainModal">
                <h1>Art Reference Tool</h1>
                {/* <img src="https://localhost:7035/wwwroot/References/a03b2059-33b5-4127-a876-209af3a11187.png"></img> */}
                <div className="centerDiv columnDiv">
                    <div className="tabContainer">
                        <Tabs defaultActiveKey="humanAnatomy" id="tabsContent" className="mb-3">
                            <Tab eventKey="humanAnatomy" title="Human Anatomy">
                                <h3>Human Anatomy</h3>
                                <div className="centerDiv">
                                    <div className="formSize homeForm">
                                        <Form id="contentForm" className="contentForm">
                                            <Form.Group className="mb-3" controlId="category">
                                                <Form.Label>Category</Form.Label>
                                                <Form.Select name="category" aria-label="Select a category" required>
                                                    <option value="Eyes">Eyes</option>
                                                    <option value="Feet">Feet</option>
                                                    <option value="Hands">Hands</option>
                                                    <option value="Human Body Pose">Human Body Pose</option>
                                                    <option value="Human Face Expressions">Human Face Expressions</option>
                                                    <option value="Human Hair">Human Hair</option>
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
                            <Tab eventKey="backgrounds" title="Backgrounds">
                                <h3>Backgrounds</h3>
                                <div className="centerDiv">
                                    <div className="formSize homeForm">
                                        <Form id="contentForm" className="contentForm">
                                            <Form.Group className="mb-3" controlId="category">
                                                <Form.Label>Category</Form.Label>
                                                <Form.Select name="category" aria-label="Select a category" required>
                                                    <option value="Beach">Beach</option>
                                                    <option value="Buildings">Buildings</option>
                                                    <option value="Landscapes">Landscapes</option>
                                                    <option value="Medieval">Medieval</option>
                                                    <option value="Mountain">Mountain</option>
                                                    <option value="Skyscrapers">Skyscrapers</option>
                                                    <option value="Space">Space</option>
                                                    <option value="Underwater">Underwater</option>
                                                </Form.Select>
                                            </Form.Group>
                                            <Form.Group>
                                                <Button variant="primary" type="submit" className="w-100">Submit</Button>
                                            </Form.Group>
                                        </Form>
                                    </div>
                                </div>
                            </Tab>
                            <Tab eventKey="stillLife" title="Still Life">
                                <h3>Still Life</h3>
                                <div className="centerDiv">
                                    <div className="formSize homeForm">
                                        <Form id="contentForm" className="contentForm">
                                            <Form.Group className="mb-3" controlId="category">
                                                <Form.Label>Category</Form.Label>
                                                <Form.Select name="category" aria-label="Select a category" required>
                                                    <option value="3D Shapes">3D Shapes</option>
                                                    <option value="Fabrics">Fabrics</option>
                                                    <option value="Flowers">Flowers</option>
                                                    <option value="Objects">Objects</option>
                                                    <option value="Paintings">Paintings</option>
                                                    <option value="Sculptures">Sculptures</option>
                                                </Form.Select>
                                            </Form.Group>
                                            <Form.Group>
                                                <Button variant="primary" type="submit" className="w-100">Submit</Button>
                                            </Form.Group>
                                        </Form>
                                    </div>
                                </div>
                            </Tab>
                            <Tab eventKey="artConcepts" title="Art Concepts">
                                <h3>Art Concepts</h3>
                                <div className="centerDiv">
                                    <div className="formSize homeForm">
                                        <Form id="contentForm" className="contentForm">
                                            <Form.Group className="mb-3" controlId="category">
                                                <Form.Label>Category</Form.Label>
                                                <Form.Select name="category" aria-label="Select a category" required>
                                                    <option value="Black and White">Black and White</option>
                                                    <option value="Color">Color</option>
                                                    <option value="Lighting">Dynamic Lighting</option>
                                                    <option value="Perspective">Perspective</option>
                                                </Form.Select>
                                            </Form.Group>
                                            <Form.Group>
                                                <Button variant="primary" type="submit" className="w-100">Submit</Button>
                                            </Form.Group>
                                        </Form>
                                    </div>
                                </div>
                            </Tab>
                            <Tab eventKey="animals" title="Animals">
                                <h3>Animals</h3>
                                <div className="centerDiv">
                                    <div className="formSize homeForm">
                                        <Form id="contentForm" className="contentForm">
                                            <Form.Group className="mb-3" controlId="category">
                                                <Form.Label>Category</Form.Label>
                                                <Form.Select name="category" aria-label="Select a category" required>
                                                    <option value="Animals">Animals</option>
                                                    <option value="Bird">Bird</option>
                                                    <option value="Bug">Bug</option>
                                                    <option value="Fish">Fish</option>
                                                    <option value="Mammal">Mammal</option>
                                                    <option value="Reptile">Reptile</option>
                                                </Form.Select>
                                            </Form.Group>
                                            <Form.Group>
                                                <Button variant="primary" type="submit" className="w-100">Submit</Button>
                                            </Form.Group>
                                        </Form>
                                    </div>
                                </div>
                            </Tab>
                        </Tabs>
                    </div>
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