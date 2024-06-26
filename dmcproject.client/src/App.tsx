import React, { FC, Fragment, useEffect, useState } from "react";
import { createRoot } from 'react-dom/client';
import { createApi } from "unsplash-js";
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import CloseButton from 'react-bootstrap/CloseButton';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';
import TopButton from './topButton.tsx';

// DEMO CODE FROM UNSPLASH API DOCS

type Photo = {
    id: number;
    width: number;
    height: number;
    urls: { large: string; regular: string; raw: string; small: string };
    color: string | null;
    description: string | null;
    links: {
        html: string;
    };
    user: {
        username: string;
        name: string;
    };
};

enum SearchOrderBy {
    relevant = "relevant",
    latest = "latest",
}

const api = createApi({
    // Don't forget to set your access token here!
    // See https://unsplash.com/developers
    accessKey: `${import.meta.env.VITE_UNSPLASH_API_KEY}`, // Access key in .env file
});

const PhotoComp: React.FC<{ photo: Photo }> = ({ photo }) => {
    const { description, links, user, urls } = photo;

    return (
        <Fragment>
            <Card style={{ width: '18rem' }}>
                <div className="imgWrap">
                    <Card.Img variant="top" src={urls.regular} onClick={(event: React.MouseEvent) => handleImageModal(event)} />
                </div>
                <Card.Body>
                    <Card.Title>
                        {user.name}
                    </Card.Title>
                    <Card.Text>
                        {description}
                    </Card.Text>
                </Card.Body>
                <Card.Footer className="text-muted">
                    <Card.Link target="_blank" href={links.html}>
                        <small>Source</small>
                    </Card.Link>
                    <Card.Link target="_blank" href={`https://unsplash.com/@${user.username}`}>
                        <small>@{user.username}</small>
                    </Card.Link>
                </Card.Footer>
            </Card>
        </Fragment>
    );
};

function handleImageModal(event: React.MouseEvent) {
    const imgSrc = (event.target as HTMLImageElement).src;
    const imgModal = document.getElementById("imgModal");
    const imgModalBg = document.getElementById("imgModalBg");
    const zoomedImg = document.getElementById("zoomedImg");

    imgModal.style.display = "block";
    imgModalBg.style.display = "block";
    zoomedImg.src = imgSrc;

    console.log("Clicked!" + imgSrc);
}

function hideImageModal() {
    const imgModal = document.getElementById("imgModal");
    const imgModalBg = document.getElementById("imgModalBg");

    imgModal.style.display = "none";
    imgModalBg.style.display = "none";
}

const Body: React.FC<{ queryStr: string, orderByStr: string }> = ({ queryStr, orderByStr }) => {
    const [data, setPhotosResponse] = useState(null);

    useEffect(() => {
        api.search
            .getPhotos({ query: queryStr, perPage: 30, orderBy: orderByStr as SearchOrderBy })
            .then(result => {
                setPhotosResponse(result);
            })
            .catch(() => {
                console.log("Something went wrong!");
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

/* Get the specific form and then get the category and checkedOrderBy value */
function updateBodyDiv(formId: string) {
    const inputs = document.getElementById(formId).elements;
    const category = inputs[0].value;
    let checkedOrderBy = null;
    if (inputs[1].checked) {
        checkedOrderBy = inputs[1].value;
    } else {
        checkedOrderBy = inputs[2].value;
    }
    console.log("checkOrderBy: " + checkedOrderBy);
    const displayTitle = document.getElementById("displayTitle");
    const dbDisplayTitle = document.getElementById("dbDisplayTitle");
    const bodyDiv = document.getElementById("bodyDiv");
    const mainModal = document.getElementById("mainModal");
    const button = document.querySelector(".newSearch");

    mainModal.style.display = "none";
    button.innerText = "Show Search";

    displayTitle.classList.add("underNav");
    dbDisplayTitle.classList.add("underNav");

    displayTitle.innerText = category + " (Unsplash)";
    dbDisplayTitle.innerText = category + " (User Submissions)";
    bodyDiv.replaceChildren(); // Remove all the body content

    // Create a react element: Body FC with its parameters and add the child to the bodyDiv (parent)
    const body = createRoot(bodyDiv);
    body.render(<Body queryStr={category as string} orderByStr={checkedOrderBy as SearchOrderBy} />);
}

/* Shows the images in the database, handles the creating elements and etc. */
function showImages(jsonData: string) {
    const dataObject: MyDataThree[] = JSON.parse(jsonData);

    for (let i = 0; i < dataObject.length; i++) {
        const ulListUR = document.querySelector(".ulListUR");
        const li = document.createElement("li");

        const div = document.createElement("div");
        const div4 = document.createElement("div");
        const img = document.createElement("img");
        const div2 = document.createElement("div");
        const div3 = document.createElement("div");

        li.classList.add("liUR");
        div.classList.add("card");
        div4.classList.add("imgWrap");
        img.classList.add("card-img-top");
        div2.classList.add("card-body");
        div3.classList.add("card-title", "h5");

        img.src = "https://localhost:7035/" + dataObject[i]["filePath"].toString();
        img.addEventListener("click", function (event: React.MouseEvent) {
            handleImageModal(event);
        });

        if (dataObject[i]["middleName"] === null) {
            div3.innerText = dataObject[i]["firstName"].toString() + " " + dataObject[i]["lastName"].toString();
        } else {
            div3.innerText = dataObject[i]["firstName"].toString() + " " + dataObject[i]["middleName"].toString() + " " + dataObject[i]["lastName"].toString();
        }

        ulListUR.append(li);
        li.append(div);
        div.append(div4, div2);
        div4.append(img);
        div2.append(div3);
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
    const button = document.querySelector(".newSearch");

    if (display == "block") {
        mainModal.style.display = "none";
        button.innerText = "Show Search";
    } else {
        mainModal.style.display = "block";
        button.innerText = "Hide Search";
    }
}

const AppContent: FC = () => {
    useEffect(() => {
        const navbar = document.querySelector(".me-auto.navbar-nav");
        const button = document.createElement("button");
        const zoomedImg = document.getElementById("zoomedImg");
        const imgModalBg = document.getElementById("imgModalBg");
        const xButton = document.getElementById("xButton");

        /* Image pop up modal */
        zoomedImg.addEventListener("click", function (event) {
            console.log("Stop Propagation");
            event.stopPropagation();
        })
        imgModalBg.addEventListener("click", hideImageModal);
        xButton.addEventListener("click", hideImageModal);

        /* Art Ref. Tool modal */
        button.innerText = "Hide Search";
        button.classList.add("btn", "btn-secondary", "newSearch");
        navbar.append(button);

        button.addEventListener("click", hideUnhideModal);

        const forms = document.querySelectorAll(".contentForm");

        for (let i = 0; i < forms.length; i++) {
            forms[i].addEventListener("submit", function (event) {
                const formId = "contentForm" + i;
                console.log(formId);
                const form = document.getElementById(formId);
                console.log(form);

                updateBodyDiv(formId);
                event.preventDefault();

                // Store the form data as a FormData object then turn it into a string (JsonElement)
                const formData = new FormData(form);
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
                        // Clear the area where the images or placeholder text may go
                        clearUlListUR();
                        if (data != "[]") {
                            showImages(data);
                        } else {
                            const ulListUR = document.querySelector(".ulListUR");
                            const p = document.createElement("p");
                            p.classList.add("placeholderText");
                            p.innerText = "There are no approved user submissions yet. Please check again later!";

                            ulListUR.append(p);
                        }
                    })
                } catch (error) {
                    console.log(error);
                }
                console.log("Submitted!");
            });
        }

    }, []);

    return (
        <>
            {/* Note: The forms and their inputs have the different ids but the same name since they
                use the same fetch GET and I get the form and their inputs by their index */}
            <div id="imgModalBg">
                <Modal.Dialog id="imgModal">
                    <Modal.Header data-bs-theme="dark">
                        <CloseButton id="xButton" aria-label="Hide" />
                    </Modal.Header>
                    <img src="" id="zoomedImg"></img>
                </Modal.Dialog>
            </div>
            <div id="mainModal">
                <h1 className="underNav">Art Reference Tool</h1>
                <div className="centerDiv columnDiv">
                    <div className="tabContainer">
                        <Tabs defaultActiveKey="humanAnatomy" id="tabsContent" className="mb-3">
                            <Tab eventKey="humanAnatomy" title="Human Anatomy">
                                <h3>Human Anatomy</h3>
                                <div className="centerDiv">
                                    <div className="formSize homeForm">
                                        <Form id="contentForm0" className="contentForm">
                                            <Form.Group className="mb-3" controlId="category0">
                                                <Form.Label>Category</Form.Label>
                                                {/* Select Update: AddURContent.tsx, EditURContent.tsx, App.tsx */}
                                                <Form.Select name="category" aria-label="Select a category" required>
                                                    <option value="Human Eyes">Eyes</option>
                                                    <option value="Human Feet">Feet</option>
                                                    <option value="Human Hands">Hands</option>
                                                    <option value="Human Body Pose">Body Pose</option>
                                                    <option value="Human Face Expressions">Face Expressions</option>
                                                    <option value="Human Hair">Hair</option>
                                                    <option value="Human Portraits">Portraits</option>
                                                </Form.Select>
                                            </Form.Group>
                                            <Form.Group className="mb-3">
                                                <p className="imgOrderBy">Image Order By</p>
                                                <Form.Group controlId="relevant0">
                                                    <Form.Check type="radio" label="Relevant" name="orderBy" value="relevant" defaultChecked required />
                                                </Form.Group>
                                                <Form.Group controlId="latest0">
                                                    <Form.Check type="radio" label="Latest" name="orderBy" value="latest" />
                                                </Form.Group>
                                            </Form.Group>
                                            <Form.Group>
                                                <Button variant="primary" type="submit" className="w-100">Search</Button>
                                            </Form.Group>
                                        </Form>
                                    </div>
                                </div>
                            </Tab>
                            <Tab eventKey="backgrounds" title="Backgrounds">
                                <h3>Backgrounds</h3>
                                <div className="centerDiv">
                                    <div className="formSize homeForm">
                                        <Form id="contentForm1" className="contentForm">
                                            <Form.Group className="mb-3" controlId="category1">
                                                <Form.Label>Category</Form.Label>
                                                {/* Select Update: AddURContent.tsx, EditURContent.tsx, App.tsx */}
                                                <Form.Select name="category" aria-label="Select a category" required>
                                                    <option value="Beach">Beach</option>
                                                    <option value="Buildings">Buildings</option>
                                                    <option value="Forest">Forest</option>
                                                    <option value="Landscapes">Landscapes</option>
                                                    <option value="Medieval">Medieval</option>
                                                    <option value="Mountain">Mountain</option>
                                                    <option value="Sky">Sky</option>
                                                    <option value="Skyscrapers">Skyscrapers</option>
                                                    <option value="Space">Space</option>
                                                    <option value="Underwater">Underwater</option>
                                                </Form.Select>
                                            </Form.Group>
                                            <Form.Group className="mb-3">
                                                <p className="imgOrderBy">Image Order By</p>
                                                <Form.Group controlId="relevant1">
                                                    <Form.Check type="radio" label="Relevant" name="orderBy" value="relevant" defaultChecked required />
                                                </Form.Group>
                                                <Form.Group controlId="latest1">
                                                    <Form.Check type="radio" label="Latest" name="orderBy" value="latest" />
                                                </Form.Group>
                                            </Form.Group>
                                            <Form.Group>
                                                <Button variant="primary" type="submit" className="w-100">Search</Button>
                                            </Form.Group>
                                        </Form>
                                    </div>
                                </div>
                            </Tab>
                            <Tab eventKey="stillLife" title="Still Life">
                                <h3>Still Life</h3>
                                <div className="centerDiv">
                                    <div className="formSize homeForm">
                                        <Form id="contentForm2" className="contentForm">
                                            <Form.Group className="mb-3" controlId="category2">
                                                <Form.Label>Category</Form.Label>
                                                {/* Select Update: AddURContent.tsx, EditURContent.tsx, App.tsx */}
                                                <Form.Select name="category" aria-label="Select a category" required>
                                                    <option value="Action Figure">Action Figure</option>
                                                    <option value="Clothing">Clothing</option>
                                                    <option value="Fabrics">Fabrics</option>
                                                    <option value="Food">Food</option>
                                                    <option value="Flowers">Flowers</option>
                                                    <option value="Instruments">Instruments</option>
                                                    <option value="Objects">Objects</option>
                                                    <option value="Paintings">Paintings</option>
                                                    <option value="Sculptures">Sculptures</option>
                                                    <option value="Shapes">Shapes</option>
                                                </Form.Select>
                                            </Form.Group>
                                            <Form.Group className="mb-3">
                                                <p className="imgOrderBy">Image Order By</p>
                                                <Form.Group controlId="relevant2">
                                                    <Form.Check type="radio" label="Relevant" name="orderBy" value="relevant" defaultChecked required />
                                                </Form.Group>
                                                <Form.Group controlId="latest2">
                                                    <Form.Check type="radio" label="Latest" name="orderBy" value="latest" />
                                                </Form.Group>
                                            </Form.Group>
                                            <Form.Group>
                                                <Button variant="primary" type="submit" className="w-100">Search</Button>
                                            </Form.Group>
                                        </Form>
                                    </div>
                                </div>
                            </Tab>
                            <Tab eventKey="artConcepts" title="Art Concepts">
                                <h3>Art Concepts</h3>
                                <div className="centerDiv">
                                    <div className="formSize homeForm">
                                        <Form id="contentForm3" className="contentForm">
                                            <Form.Group className="mb-3" controlId="category3">
                                                <Form.Label>Category</Form.Label>
                                                {/* Select Update: AddURContent.tsx, EditURContent.tsx, App.tsx */}
                                                <Form.Select name="category" aria-label="Select a category" required>
                                                    <option value="Black and White">Black and White</option>
                                                    <option value="Color">Color</option>
                                                    <option value="Composition">Composition</option>
                                                    <option value="Design">Design</option>
                                                    <option value="Dramatic Lighting">Dramatic Lighting</option>
                                                    <option value="Illustration">Illustration</option>
                                                    <option value="Perspective">Perspective</option>
                                                </Form.Select>
                                            </Form.Group>
                                            <Form.Group className="mb-3">
                                                <p className="imgOrderBy">Image Order By</p>
                                                <Form.Group controlId="relevant3">
                                                    <Form.Check type="radio" label="Relevant" name="orderBy" value="relevant" defaultChecked required />
                                                </Form.Group>
                                                <Form.Group controlId="latest3">
                                                    <Form.Check type="radio" label="Latest" name="orderBy" value="latest" />
                                                </Form.Group>
                                            </Form.Group>
                                            <Form.Group>
                                                <Button variant="primary" type="submit" className="w-100">Search</Button>
                                            </Form.Group>
                                        </Form>
                                    </div>
                                </div>
                            </Tab>
                            <Tab eventKey="animals" title="Animals">
                                <h3>Animals</h3>
                                <div className="centerDiv">
                                    <div className="formSize homeForm">
                                        <Form id="contentForm4" className="contentForm">
                                            <Form.Group className="mb-3" controlId="category4">
                                                <Form.Label>Category</Form.Label>
                                                {/* Select Update: AddURContent.tsx, EditURContent.tsx, App.tsx */}
                                                <Form.Select name="category" aria-label="Select a category" required>
                                                    <option value="Animals">Animals</option>
                                                    <option value="Amphibians">Amphibians</option>
                                                    <option value="Birds">Birds</option>
                                                    <option value="Bugs">Bugs</option>
                                                    <option value="Fish">Fish</option>
                                                    <option value="Mammals">Mammals</option>
                                                    <option value="Reptiles">Reptiles</option>
                                                </Form.Select>
                                            </Form.Group>
                                            <Form.Group className="mb-3">
                                                <p className="imgOrderBy">Image Order By</p>
                                                <Form.Group controlId="relevant4">
                                                    <Form.Check type="radio" label="Relevant" name="orderBy" value="relevant" defaultChecked required />
                                                </Form.Group>
                                                <Form.Group controlId="latest4">
                                                    <Form.Check type="radio" label="Latest" name="orderBy" value="latest" />
                                                </Form.Group>
                                            </Form.Group>
                                            <Form.Group>
                                                <Button variant="primary" type="submit" className="w-100">Search</Button>
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
            <TopButton />
        </main>
    );
}

export default App;