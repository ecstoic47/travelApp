
import { Cancel, Room } from "@material-ui/icons";
import Axios from "../axios/axios"
import { useRef, useState } from "react";
import "./login.css";

export default function Login({ setShowLogin, setCurrentUserName, myStorage }) {
    const [error, setError] = useState(false);
    const usernameRef = useRef();
    const passwordRef = useRef();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const user = {
            username: usernameRef.current.value,
            password: passwordRef.current.value,
        };
        try {
            const res = await Axios.post("/users/login", user);
            console.log(res.data)
            setCurrentUserName(res.data.username);
            myStorage.setItem('user', res.data.username);
            setShowLogin(false)
        } catch (err) {
            setError(true);
        }
    };

    return (
        <div className="loginContainer">
            <div className="logo">
                <Room className="logoIcon" />
                <span>Pin</span>
            </div>
            <form onSubmit={handleSubmit}>
                <input autoFocus placeholder="username" ref={usernameRef} />
                <input
                    type="password"
                    min="6"
                    placeholder="password"
                    ref={passwordRef}
                />
                <button className="loginBtn" type="submit">
                    Login
                </button>
                {error && <span className="failure">Something went wrong!</span>}
            </form>
            <Cancel className="loginCancel" onClick={() => setShowLogin(false)} />
        </div>
    );
}