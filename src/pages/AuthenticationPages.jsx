import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Input, AuthCard } from "@/components/Components";
import { signin, signup } from "@/scripts/auth";

// Sign-up page
const SignUp = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [errorMessage, setErrorMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage("");

        try {
            await signup(formData.email, formData.password);
            navigate("/dashboard");
        } catch (error) {
            setErrorMessage(error.message);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <AuthCard title="Create Account">
            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                <Input
                    label="Email Address"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="Enter your email"
                />
                <Input
                    label="Password"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder="Enter your password"
                />
                {errorMessage && (
                    <p className="text-red-500 text-sm text-center">{errorMessage}</p>
                )}
                <Button type="submit">Sign Up</Button>

                <p className="text-center text-sm text-gray-600">
                    Already have an account?{" "}
                    <a href="/signin" className="font-medium text-blue-600 hover:text-blue-500">
                        Sign in
                    </a>
                </p>
            </form>
        </AuthCard>
    );
};


// Sign-in page
const SignIn = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [errorMessage, setErrorMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage(""); // Reset error message

        try {
            await signin(formData.email, formData.password);
            navigate("/dashboard"); // Redirect to dashboard on success
        } catch (error) {
            setErrorMessage(error.message); // Display error message
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <AuthCard title="Welcome Back">
            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                <Input
                    label="Email Address"
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="Enter your email"
                />
                <Input
                    label="Password"
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    placeholder="Enter your password"
                />
                {errorMessage && (
                    <p className="text-red-500 text-sm text-center">{errorMessage}</p>
                )}
                <Button type="submit">Sign In</Button>

                <p className="text-center text-sm text-gray-600">
                    Don&apos;t have an account?{" "}
                    <a href="/signup" className="font-medium text-blue-600 hover:text-blue-500">
                        Sign up
                    </a>
                </p>
            </form>
        </AuthCard>
    );
};

export { SignUp, SignIn };
