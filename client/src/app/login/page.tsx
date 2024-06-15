/**
 * @file page.tsx
 * @brief The login page of the application.
 * @version 1.0
 * @date 06-02-2024
 * @author Arinjay Singh
 * @
 */

"use client";
import {useEffect, useState} from "react";
import {useAuth} from "@/context/auth-context";
import {useRegister} from "../api/api/register";
import {Loading} from "@/components/loading";

/**
 * @author Arinjay Singh
 */
// login page component
const LoginPage = () => {

    // state hooks to store the username and password
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("baseUserPassword");
    const [invalidAuth, setInvalidAuth] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isAuthUpdated, setIsAuthUpdated] = useState(false);

    // get the login function from the auth context
    const {login, setAuthData} = useAuth();
    const {register} = useRegister();

    /**
     * @author Arinjay Singh
     */
    useEffect(() => {
        const handleAuthUpdate = async () => {
            if (isAuthUpdated) {
                try {
                    let response = await register();
                    login();
                } catch (error) {
                    setInvalidAuth(true);
                } finally {
                    setLoading(false);
                    setIsAuthUpdated(false);
                }
            }
        };
        handleAuthUpdate();
    }, [isAuthUpdated, login, register]);

    /**
     * @author Arinjay Singh
     */
        // handle the login form submission
    const handleLogin = async (e: React.FormEvent) => {
            e.preventDefault();
            setLoading(true);
            setAuthData({username, password});
            setIsAuthUpdated(true);
        };

    /**
     * @author Arinjay Singh
     */
    // render the login form
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            {loading ? (
                <Loading/>
            ) : (
                <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
                    <h2 className="text-2xl font-bold mb-6 text-center text-black">
                        Login
                    </h2>
                    <form onSubmit={handleLogin}>
                        <div className="mb-4">
                            <label
                                className="block text-gray-700 text-sm font-bold mb-2"
                                htmlFor="username"
                            >
                                Username
                            </label>
                            <input
                                id="username"
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                                required
                            />
                        </div>
                        <div className="mb-6">
                            <label
                                className="block text-gray-700 text-sm font-bold mb-2"
                                htmlFor="password"
                            >
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
                                required
                            />
                        </div>
                        <div className="flex flex-row items-center justify-between">
                            <button
                                type="submit"
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                            >
                                Sign In
                            </button>
                            {invalidAuth ? (
                                <p className="text-red-600 font-medium text-sm ">
                                    Invalid credentials. Please try again.
                                </p>
                            ) : null}
                        </div>
                    </form>
                </div>
            )}
        </div>
    );
};

export default LoginPage;
