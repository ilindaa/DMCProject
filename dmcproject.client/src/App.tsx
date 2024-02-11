/*import React, { FC, Fragment, useEffect, useState } from "react";*/
import "./App.css";
/*import { createApi } from "unsplash-js";*/
import { Link } from "react-router-dom";
/*import * as dotenv from "dotenv";

const test = dotenv.config({ path: "../../.env" });
console.log(test);
console.log(process.env.REACT_APP_UNSPLASH_API_KEY);

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
    accessKey: `${process.env.REACT_APP_UNSPLASH_API_KEY}`,
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
*/
function App() {
    return (
        <main className="root">
            <h2>Testing Unsplash API</h2>
            <Link to="login">Login</Link>
            <br/> {/* Line break here temporarily for now */}
            <Link to="register">Register</Link>
            {/*<Body />*/}
        </main>
    );
}

export default App;