'use strict';
import { validateUser } from './auth.js';

/**
 * Represents a parking space reservation
 * @typedef {Object} Reservation
 * @property {string} reservation_id - Unique identifier for the reservation
 * @property {string?} user_id - ID of the user who made the reservation
 * @property {string} space_id - ID of the reserved parking space
 * @property {string?} status - Current status of the reservation
 * @property {Date?} created_at - ISO timestamp of when the reservation was created
 * @property {Date} start_timestamp - ISO timestamp of when the reservation starts
 * @property {Date} end_timestamp - ISO timestamp of when the reservation ends
 */

/**
 * Makes a request to the API.
 * @param {string} url - The endpoint URL.
 * @param {object} options - Fetch options.
 * @param {boolean} auth - Whether to include authentication headers.
 * @returns {Promise<Response>} The response object.
 * @throws {Error} If there is an issue with the request.
 */
export async function request(url, options = {}, auth = false) {
    url = `${import.meta.env.VITE_API_URL}${url}`;
    options.headers = {
        ...options.headers,
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    };
    options.credentials = 'same-origin';

    if (auth) {
        const idToken = await validateUser();
        options.headers = {
            ...options.headers,
            Authorization: `Bearer ${idToken}`,
        };
    }
    const response = await fetch(url, options);
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message);
    } else {
        return response;
    }

}

/**
 * Creates a new reservation
 * @param {{
 *   space_id: string,
 *   start_timestamp: Date,
 *   end_timestamp: Date
 * }} reservation - Reservation details
 * @returns {Promise<{id: string, message: string}>} Created reservation info
 */
export async function createReservation({ space_id, start_timestamp, end_timestamp }) {
    const response = await request('/reservations/add', {
        method: 'POST',
        body: JSON.stringify({
            space_id,
            start_timestamp: start_timestamp.toISOString(),
            end_timestamp: end_timestamp.toISOString()
        })
    }, true);
    return response.json();
}

/**
 * Deletes a reservation
 * @param {string} reservationId - ID of reservation to delete
 * @returns {Promise<{message: string}>} Success message
 */
export async function deleteReservation(reservationId) {
    const response = await request(`/reservations/delete/${reservationId}`, {
        method: 'DELETE'
    }, true);
    return response.json();
}

/**
 * Gets all reservations for the authenticated user
 * @returns {Promise<Array<Reservation>>} List of user's reservations
 */
export async function getUserReservations() {
    const response = await request('/reservations/user', {
        method: 'GET'
    }, true);
    return response.json();
}

/**
 * Gets and filters reservations based on criteria
 * @param {{
 *   reservation_id?: string,
 *   space_id?: string,
 *   start_timestamp?: Date,
 *   end_timestamp?: Date,
 *   from?: Date,        // Filter reservations where end_time > from
 *   to?: Date          // Filter reservations where start_time < to
 * }} filters - Optional filters
 * @returns {Promise<Array<Reservation>>} Filtered reservations
 */
export async function getReservations(filters = {}) {
    const {
        reservation_id,
        space_id,
        start_timestamp,
        end_timestamp,
        from,
        to
    } = filters;

    const params = new URLSearchParams();
    
    if (reservation_id) params.append('reservation_id', reservation_id);
    if (space_id) params.append('space_id', space_id);
    if (from) {
        params.append('end_timestamp', '>'+from.toISOString()); // Will get all reservations that exist after from
    } else if (end_timestamp) {
        params.append('end_timestamp', end_timestamp.toISOString());
    }
    if (to) {
        params.append('start_timestamp', '<'+to.toISOString()); // Will get all reservations that exist before to
    } else if (start_timestamp) {
        params.append('start_timestamp', start_timestamp.toISOString());
    }

    const response = await request(`/reservations/get?${params}`, {
        method: 'GET'
    });
    return await response.json();
}
