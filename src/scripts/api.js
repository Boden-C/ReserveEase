"use strict";
import { fetchWithAuthentication } from "./auth.js";
import { request } from "./api"

/**
 * Makes a request to the API.
 * @param {string} url - The endpoint URL.
 * @param {object} options - Fetch options.
 * @param {boolean} auth - Whether to include authentication headers.
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

/** 
* Adds a reservation
* @param {number} id - The parking ID
* @param {string} time_block - The start specific time block for the reservation
*/

export function addReservation(id, time_block) {
    const data = {
        charger_id: id,
        time_block: time_block
    };

    return request('/api/reservation/add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    }, true); // `true` if authentication is required
}

/** 
* Deletes a reservation
* @param {number} id - The parking ID
* @param {string} time_block - The start specific time block for the reservation
*/

export function deleteReservation(id, time_block) {
    const data = {
        charger_id: id,
        time_block: time_block
    };

    return request('/api/reservation/delete', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    }, true); // `true` if authentication is required
}

