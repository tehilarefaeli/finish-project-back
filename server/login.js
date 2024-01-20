// App.js
import React, { useState } from "react";
import firebase from "firebase";

const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const onLogin = async () => {
        try {
            const user = await firebase.auth().signInWithEmailAndPassword(
                "email@example.com",
                "password"
            );
            setIsAuthenticated(true);
        } catch (error) {
            console.error(error);
        }
    };

    const onLogout = async () => {
        try {
            await firebase.auth().signOut();
            setIsAuthenticated(false);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div>
            {isAuthenticated && (
                <h1>ברכות, אתה מחובר!</h1>
            )}
            {!isAuthenticated && (
                <button onClick={onLogin}>התחבר</button>
            )}
            {isAuthenticated && (
                <button onClick={onLogout}>התנתק</button>
            )}
        </div>
    );
};

export default App;


