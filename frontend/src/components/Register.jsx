import { Cancel, Room } from "@material-ui/icons";
import { useRef, useState } from "react";
import Axios from "../axios/axios";
import "./register.css";

export default function Register({ setShowRegister }) {
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);
    const usernameRef = useRef();
    const emailRef = useRef();
    const passwordRef = useRef();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newUser = {
            username: usernameRef.current.value,
            email: emailRef.current.value,
            password: passwordRef.current.value,
        };

        try {
            const res = await Axios.post("/users/register", newUser);
            console.log(res.data)
            setError(false);
            setSuccess(true);
        } catch (err) {
            setError(true);
        }
    };
    return (
        <div className="registerContainer">
            <div className="logo">
                <Room className="logoIcon" />
                <span>Pin</span>
            </div>
            <form onSubmit={handleSubmit}>
                <input autoFocus placeholder="username" ref={usernameRef} />
                <input type="email" placeholder="email" ref={emailRef} />
                <input
                    type="password"
                    min="6"
                    placeholder="password"
                    ref={passwordRef}
                />
                <button className="registerBtn" type="submit">
                    Register
                </button>
                {success && (
                    <span className="success">Successfull. You can login now!</span>
                )}
                {error && <span className="failure">Something went wrong!</span>}
            </form>
            <Cancel
                className="registerCancel"
                onClick={() => setShowRegister(false)}
            />
        </div>
    );
}