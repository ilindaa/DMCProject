import React, { createElement, FC, Fragment, useEffect, useState } from "react";
import { createRoot } from 'react-dom/client';
import "./App.css";
import { createApi } from "unsplash-js";
import { Link } from "react-router-dom";

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

// Set the active tab when the tab is clicked
function activeTabs(tabName: string, event?: React.MouseEvent) {
    const tabLinks = document.getElementsByClassName("tabLinks");
    const tabContent = document.getElementsByClassName("tabContent");

    // Note: The number of tabs = the number of tab contents
    for (let i = 0; i < tabLinks.length; i++) {
        tabLinks[i].className = tabLinks[i].className.replace(" active", "");
        tabContent[i].style.display = "none";
    }

    document.getElementById(tabName).style.display = "block";

    if (event) {
        event.currentTarget.className += " active";
        event.preventDefault();
    }
}

function updateBodyDiv() {
    const contentForm = document.getElementById("contentForm");
    const category = document.getElementById("category") as HTMLSelectElement;

    const bodyDiv = document.getElementById("bodyDiv");
    bodyDiv.innerHTML = ""; // Remove all the body content

    // Create a react element: Body FC with its parameters and add the child to the bodyDiv (parent)
    const body = createRoot(bodyDiv);
    body.render(<Body queryStr={ category.value as string } orientationStr="landscape" />);

    contentForm.reset();
}

const AppContent: FC = () => {
    useEffect(() => {
        // Set the default tab and add the active class to it
        activeTabs("tab1");
        document.querySelector(".tabs").firstChild.firstChild.className += " active";

        const contentForm = document.getElementById("contentForm");
        contentForm.addEventListener("submit", function (event) {
            event.preventDefault();
            updateBodyDiv();
        });

    }, []);

    return (
        <>
            <h2>Art Reference Tool</h2>
            <Link to="add-content">Add Content</Link>
            <br /> {/* Line break here temporarily for now */}
            <Link to="login">Login</Link>
            <br /> {/* Line break here temporarily for now */}
            <Link to="sign-up">Sign Up</Link>
            <br /> {/* Line break here temporarily for now */}
            <br /> {/* Line break here temporarily for now */}

            <div className="tabContainer">
                <ul className="tabs">
                    <li className="tabItem">
                        <a href="" className="tabLinks" onClick={ (event) => activeTabs("tab1", event) }>Human Anatomy</a>
                    </li>
                    <li className="tabItem">
                        <a href="" className="tabLinks" onClick={ (event) => activeTabs("tab2", event) }>Tab 2</a>
                    </li>
                    <li className="tabItem">
                        <a href="" className="tabLinks" onClick={ (event) => activeTabs("tab3", event) }>Tab 3</a>
                    </li>
                </ul>
                {/* Tab Content */}
                <div id="tab1" className="tabContent">
                    <h3>Human Anatomy</h3>
                    <form id="contentForm">
                        <input type="hidden" value="1"></input>
                        <label htmlFor="category">Category</label>
                        <select name="category" id="category" required>
                            <option value="Full Body">Figure (Full Body)</option>
                            <option value="Hands">Hands</option>
                            <option value="Feet">Feet</option>
                            <option value="Portraits">Portraits</option>
                        </select>
                        <button type="submit">Submit</button>
                    </form>
                </div>
                <div id="tab2" className="tabContent">
                    <h3>Tab Content 2</h3>
                    <form>
                    </form>
                </div>
                <div id="tab3" className="tabContent">
                    <h3>Tab Content 3</h3>
                    <form>
                    </form>
                </div>
            </div>
        </>
    );
}

function App() {
    return (
        <main className="root">
            <AppContent />
            <div id="bodyDiv">
            </div>
        </main>
    );
}

export default App;