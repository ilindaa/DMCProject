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

function App() {
    return (
        <main className="root">
            <h2>Art Reference Tool</h2>
            <Link to="login">Login</Link>
            <br/> {/* Line break here temporarily for now */}
            <Link to="register">Register</Link>
            <br /> {/* Line break here temporarily for now */}
            <br /> {/* Line break here temporarily for now */}
            <div className="tab">
                <button className="tabLinks">Content 1</button>
                <button className="tabLinks">Content 2</button>
                <button className="tabLinks">Content 3</button>
            </div>

            <div id="Content1" className="tabContent">
                <h3>Content 1</h3>
                <p>Form about Content 1.</p>
            </div>

            <div id="Content2" className="tabContent">
                <h3>Content 2</h3>
                <p>Form about Content 2.</p>
            </div>

            <div id="Content3" className="tabContent">
                <h3>Content 3</h3>
                <p>Form about Content 3.</p>
            </div>
            <Body />
        </main>
    );
}

export default App;