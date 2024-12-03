// src/scripts/useReservations.js
import { useReducer, useEffect, useCallback } from 'react';
import { getUserReservations, createReservation, deleteReservation } from '@/scripts/api.js';

/**
 * @typedef {Object} Reservation
 * @property {string} reservation_id
 * @property {string} space_id
 * @property {string} start_timestamp
 * @property {string} end_timestamp
 */

/**
 * @typedef {Object} ReservationsState
 * @property {Reservation[]} reservations
 * @property {Reservation[]} lastSuccessfulState
 * @property {boolean} isFirstLoad
 */

/**
 * @typedef {Object} Action
 * @property {string} type
 * @property {any} payload
 */

/** @type {ReservationsState} */
const initialState = {
    reservations: [],
    lastSuccessfulState: [],
    isFirstLoad: true,
};

/**
 * Reducer for managing reservation state
 * @param {ReservationsState} state
 * @param {Action} action
 * @returns {ReservationsState}
 */
const reservationsReducer = (state, action) => {
    switch (action.type) {
        case 'SET_RESERVATIONS':
            return {
                ...state,
                reservations: action.payload,
                lastSuccessfulState: action.payload,
                isFirstLoad: false,
            };
        case 'OPTIMISTIC_ADD':
            return {
                ...state,
                reservations: [...state.reservations, action.payload].sort(
                    (a, b) => new Date(a.start_timestamp) - new Date(b.start_timestamp)
                ),
            };
        case 'OPTIMISTIC_DELETE':
            return {
                ...state,
                reservations: state.reservations.filter((r) => r.reservation_id !== action.payload),
            };
        case 'REVERT':
            return {
                ...state,
                reservations: state.lastSuccessfulState,
            };
        default:
            return state;
    }
};

/**
 * Custom hook for managing reservations with optimistic updates and error handling
 * @returns {{
 *   reservations: Reservation[],
 *   isFirstLoad: boolean,
 *   addReservation: (params: {
 *     space_id: string,
 *     start_timestamp: Date,
 *     end_timestamp: Date
 *   }) => Promise<string>,
 *   removeReservation: (id: string) => Promise<void>,
 *   refreshReservations: () => Promise<void>
 * }}
 */
export const useReservations = () => {
    const [state, dispatch] = useReducer(reservationsReducer, initialState);

    const fetchReservations = useCallback(async () => {
        try {
            const data = await getUserReservations();
            const sortedData = data.sort((a, b) => new Date(a.start_timestamp) - new Date(b.start_timestamp));
            dispatch({ type: 'SET_RESERVATIONS', payload: sortedData });
        } catch (error) {
            dispatch({ type: 'REVERT' });
            throw new Error(`Failed to fetch reservations: ${error.message}`);
        }
    }, []);

    useEffect(() => {
        fetchReservations();
    }, [fetchReservations]);

    const addReservation = async ({ space_id, start_timestamp, end_timestamp }) => {
        const optimisticId = `temp-${Date.now()}`;
        const optimisticReservation = {
            reservation_id: optimisticId,
            space_id,
            start_timestamp: start_timestamp.toISOString(),
            end_timestamp: end_timestamp.toISOString(),
        };

        dispatch({ type: 'OPTIMISTIC_ADD', payload: optimisticReservation });

        try {
            const response = await createReservation({
                space_id,
                start_timestamp,
                end_timestamp,
            });
            await fetchReservations();
            return response.id;
        } catch (error) {
            console.log(error);
            dispatch({ type: 'REVERT' });
            throw new Error(`Failed to create reservation: ${error.message}`);
        }
    };

    const removeReservation = async (id) => {
        dispatch({ type: 'OPTIMISTIC_DELETE', payload: id });

        try {
            await deleteReservation(id);
            await fetchReservations();
        } catch (error) {
            dispatch({ type: 'REVERT' });
            throw new Error(`Failed to delete reservation: ${error.message}`);
        }
    };

    return {
        reservations: state.reservations,
        isFirstLoad: state.isFirstLoad,
        addReservation,
        removeReservation,
        refreshReservations: fetchReservations,
    };
};
