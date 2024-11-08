"use strict";
import { fetchWithAuthentication } from "./auth.js";
import { request } from "./api"

/**
 * Makes a request to the API.
 * @param {string} url - The endpoint URL.
 * @param {object} options - Fetch options.
 * @param {boolean} auth - Whether to include authentication headers.
 * @returns {Promise<Response>} The fetch response.
 * @throws {Error} If there is an issue with the request.
 * Adds a reservation
 * @param {number} id - The parking ID
 * @param {Date} start - The start date and time.
 * @param {Date} end - The end date and time.
 */
export async function request(url, options = {}, auth = false) {
    url = `${import.meta.env.VITE_API_URL}${url}`;
    if (auth) {
        return fetchWithAuthentication(url, options);
    } else {
        return fetch(url, options);
    }
}

export function addReservation(id, start, end) {
    const data = {
        id: id,
        start: start.toISOString(), // Convert Date to ISO string
        end: end.toISOString()       // Convert Date to ISO string
    };

    return request('/api/reservation/add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    }, true); // `true` if authentication is required
}

export function deleteReservation(id, start, end) {
    const data = {
        id: id,
        start: start.toISOString(), // Convert Date to ISO string
        end: end.toISOString()       // Convert Date to ISO string
    };

    return request('/api/reservation/delete', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    }, true); // `true` if authentication is required
}

