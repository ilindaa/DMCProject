import React, { FC, Fragment, useEffect, useState } from "react";
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

const Body: FC = () => {
    const [data, setPhotosResponse] = useState(null);

    useEffect(() => {
        api.search
            .getPhotos({ query: "pomeranian", orientation: "landscape" })
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

const AppContent: FC = () => {
    useEffect(() => {
        // Set the default tab and add the active class to it
        activeTabs("tab1");
        document.querySelector(".tabs").firstChild.firstChild.className += " active";
    }, []);

    return (
        <>
            <h2>Art Reference Tool</h2>
            <Link to="login">Login</Link>
            <br /> {/* Line break here temporarily for now */}
            <Link to="register">Register</Link>
            <br /> {/* Line break here temporarily for now */}
            <br /> {/* Line break here temporarily for now */}

            <div className="tabContainer">
                <ul className="tabs">
                    <li className="tabItem">
                        <a href="" className="tabLinks" onClick={ (event) => activeTabs("tab1", event) }>Tab 1</a>
                    </li>
                    <li className="tabItem">
                        <a href="" className="tabLinks" onClick={ (event) => activeTabs("tab2", event) }>Tab 2</a>
                    </li>
                </ul>
                {/* Tab Content */}
                <div id="tab1" className="tabContent">
                    <h3>Tab Content 1</h3>
                </div>
                <div id="tab2" className="tabContent">
                    <h3>Tab Content 2</h3>
                </div>
            </div>
        </>
    );
}

function App() {
    return (
        <main className="root">
            <AppContent />
            <Body />
        </main>
    );
}

export default App;