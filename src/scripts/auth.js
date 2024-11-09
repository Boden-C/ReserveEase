"use strict";
import { createUserWithEmailAndPassword,signInWithEmailAndPassword,signOut,getIdToken } from "firebase/auth";
import { auth } from "./firebaseConfig.js";

/**
 * Signs up a new user with the given email and password.
 * @param {string} email - The email for the new user.
 * @param {string} password - The password for the new user.
 * @returns {Promise<import("firebase/auth").UserCredential} The new user's credentials.
 * @throws {Error} If there is an error during sign-up.
 */
export async function signup(email, password) {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        return userCredential;
    } catch (error) {
        console.error("Error signing up:", error);
        throw error;
    }
}

/**
 * Signs in a user with the given email and password.
 * @param {string} email The email of the user.
 * @param {string} password The password of the user.
 * @returns {Promise<string>} The Firebase ID token.
 * @throws {Error} If an error occurs while signing in.
 */
export async function signin(email, password) {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        const idToken = await user.getIdToken();
        return idToken;
    } catch (error) {
        console.error("Error signing in:", error);
        throw error;
    }
}

/**
 * Signs out the current user.
 * @returns {Promise<void>}
 * @throws {Error} If an error occurs while signing out.
 */
export async function signout() {
    try {
        await signOut(auth);
    } catch (error) {
        console.error("Error signing out:", error);
        throw error;
    }
}

/**
 * Wrapper function to add Firebase ID token to authenticated requests.
 * @param {string} url - The endpoint URL.
 * @param {object} options - Fetch options (e.g., method, headers).
 * @returns {Promise<Response>} The fetch response.
 * @throws {Error} If there is an issue retrieving the ID token.
 */
export async function fetchWithAuthentication(url, options = {}) {
    // Attempt to get the current user's ID token
    const user = auth.currentUser;
    if (!user) throw new Error("User not logged in");

    const idToken = await getIdToken(user);

    // Set up headers and add the Authorization header with the token
    const headers = {
        ...options.headers,
        "Authorization": `Bearer ${idToken}`,
        "Content-Type": "application/json",
    };

    // Make the fetch request with the modified headers
    return await fetch(url, {
        ...options,
        headers: headers,
    });
    
}