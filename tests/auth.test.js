// tests/auth.test.js
import { describe, it } from "vitest";
import { signup, signin, signout } from "../src/scripts/auth.js";
import { request } from "../src/scripts/api.js";

const TEST_EMAIL = "testuser@example.com";
const TEST_PASSWORD = "testpassword";

describe("Firebase Authentication", () => {
    it("should sign up a new user", async () => {
        const userCredential = await signup(TEST_EMAIL, TEST_PASSWORD);
        console.log("Sign-up successful:", userCredential.user.email);
    });

    it("should sign in an existing user", async () => {
        const idToken = await signin(TEST_EMAIL, TEST_PASSWORD);
        console.log("Sign-in successful. ID Token:", idToken);
    });

    it("should perform an unauthenticated request", async () => {
        const response = await request("/authenticate", { method: "GET" });
        const data = await response.json();
        console.log("Unauthenticated request response:", data);
    });

    it("should perform an authenticated request", async () => {
        await signin(TEST_EMAIL, TEST_PASSWORD);
        const response = await request("/authenticate", { method: "GET" }, true);
        const data = await response.json();
        console.log("Authenticated request response:", data);
    });

    it("should sign out the current user", async () => {
        await signout();
        console.log("Sign-out successful");
    });
});
