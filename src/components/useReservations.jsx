import { useState, useEffect, useCallback } from 'react';
import { 
  getUserReservations, 
  createReservation, 
  deleteReservation 
} from '../scripts/api.js';

/**
 * Custom hook for managing reservations
 * @returns {{
 *   reservations: import('../scripts/api.js').Reservation[],
 *   isLoading: boolean,
 *   error: Error | null,
 *   addReservation: (space_id: string, start_timestamp: Date, end_timestamp: Date) => Promise<string>,
 *   removeReservation: (id: string) => Promise<void>,
 *   refreshReservations: () => Promise<void>
 * }}
 */
export const useReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchReservations = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await getUserReservations();
      console.log(data)
      // Sort reservations by start time
      setReservations(data.sort((a, b) => 
        new Date(a.start_timestamp) - new Date(b.start_timestamp)
      ));
    } catch (err) {
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchReservations();
  }, [fetchReservations]);

  const addReservation = async ({ space_id, start_timestamp, end_timestamp }) => {
    try {
      setIsLoading(true);
      const response = await createReservation({ 
        space_id, 
        start_timestamp, 
        end_timestamp 
      });
      await fetchReservations();
      return response.id; // Return the ID from the API response
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const removeReservation = async (id) => {
    try {
      setIsLoading(true);
      await deleteReservation(id);
      await fetchReservations();
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    reservations,
    isLoading,
    error,
    addReservation,
    removeReservation,
    refreshReservations: fetchReservations
  };
};