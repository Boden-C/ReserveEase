"use strict";
import { fetchWithAuthentication } from "./auth.js";

/**
 * Makes a request to the API.
 * @param {string} url - The endpoint URL.
 * @param {object} options - Fetch options.
 * @param {boolean} auth - Whether to include authentication headers.
 * @returns {Promise<Response>} The fetch response.
 * @throws {Error} If there is an issue with the request.
 */
export async function request(url, options = {}, auth = false) {
    url = `${import.meta.env.VITE_API_URL}${url}`;
    if (auth) {
        return fetchWithAuthentication(url, options);
    } else {
        return fetch(url, options);
    }
}