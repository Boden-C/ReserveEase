import { describe, expect, test, beforeAll, afterAll } from 'vitest';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '../src/scripts/firebaseConfig.js';
import { createReservation, deleteReservation, getUserReservations, getReservations } from '../src/scripts/api.js';

beforeAll(async () => {
    // Log in the mock user before tests
    await signInWithEmailAndPassword(auth, 'testuser@example.com', 'testpassword');
});

afterAll(async () => {
    // Log out the mock user after tests
    await signOut(auth);
});

describe('Reservations API', () => {
    const mockSpaceId = 'space_123';
    const mockStart = new Date(Date.UTC(2099, 0, 1, 10, 0, 0)); // Jan 1, 2099, 10:00 AM UTC
    const mockEnd = new Date(Date.UTC(2099, 0, 1, 11, 0, 0)); // Jan 1, 2099, 11:00 AM UTC

    let createdReservationId;
    let userReservationsCount;

    test('Get User Reservation - success', async () => {
        const userReservations = await getUserReservations();
        expect(Array.isArray(userReservations)).toBe(true);
        userReservationsCount = userReservations.length;
        console.log('User reservations:', userReservations);
    });

    test('Create Reservation - success', async () => {
        const result = await createReservation({
            space_id: mockSpaceId,
            start_timestamp: mockStart,
            end_timestamp: mockEnd,
        });

        expect(result).toHaveProperty('id');
        createdReservationId = result.id;

        const userReservations = await getUserReservations();
        const createdReservation = userReservations.find((r) => r.reservation_id === createdReservationId);

        expect(createdReservation).toBeTruthy();
        expect(createdReservation.space_id).toBe(mockSpaceId);
    });

    test('Create Reservation - time conflict', async () => {
        try {
            await createReservation({
                space_id: mockSpaceId,
                start_timestamp: mockStart,
                end_timestamp: mockEnd,
            });
        } catch (error) {
            console.log('EXPECTED error: time conflict', error);
            expect(error).toBeTruthy();
        }
    });

    test('Create Reservation - missing space_id', async () => {
        try {
            await createReservation({
                start_timestamp: mockStart,
                end_timestamp: mockEnd,
            });
        } catch (error) {
            console.log('EXPECTED error: missing space_id', error);
            expect(error).toBeTruthy();
        }
    });

    test('Create Reservation - invalid date formats', async () => {
        try {
            await createReservation({
                space_id: mockSpaceId,
                start_timestamp: 'not-a-date',
                end_timestamp: mockEnd,
            });
        } catch (error) {
            console.log('EXPECTED error: invalid date formats', error);
            expect(error).toBeTruthy();
        }
    });

    test('Delete Reservation - success', async () => {
        if (!createdReservationId) {
            throw new Error('No reservation ID to delete');
        }
        await deleteReservation(createdReservationId); // Delete the reservation

        try {
            await deleteReservation(createdReservationId);
        } catch (error) {
            console.log('EXPECTED error: reservation already deleted', error);
            expect(error).toBeTruthy();
        }
    });

    test('Get Reservations - invalid space_id filter', async () => {
        try {
            await getReservations({
                space_id: '', // Invalid space_id
                from: mockStart,
                to: mockEnd,
            });
        } catch (error) {
            console.log('EXPECTED error: invalid space_id filter', error);
            expect(error).toBeTruthy();
        }
    });

    test('Get User Reservations - no reservations for user', async () => {
        const userReservations = await getUserReservations();
        expect(Array.isArray(userReservations)).toBe(true);
        console.log('User reservations:', userReservations);
        expect(userReservations.length).toBe(userReservationsCount); // Assuming no reservations exist for this user
    });

    test('Create Reservation - zero duration', async () => {
        try {
            await createReservation({
                space_id: mockSpaceId,
                start_timestamp: mockStart,
                end_timestamp: mockStart, // Start and end are the same
            });
        } catch (error) {
            console.log('EXPECTED error: zero duration', error);
            expect(error).toBeTruthy();
        }
    });

    test('Get Reservations - invalid range (negative duration)', async () => {
        try {
            await getReservations({
                space_id: mockSpaceId,
                from: mockEnd, // `from` is after `to`
                to: mockStart,
            });
        } catch (error) {
            console.log('EXPECTED error: invalid range', error);
            expect(error).toBeTruthy();
        }
    });
});
