import { describe, expect, test, beforeAll, afterAll } from 'vitest';
import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { auth } from '../src/scripts/firebaseConfig.js';
import { getParkingWithAvailabilityAt } from '../src/scripts/api.js';

beforeAll(async () => {
    await signInWithEmailAndPassword(auth, 'testuser@example.com', 'testpassword');
});

afterAll(async () => {
    await signOut(auth);
});

describe('Get Parking with Availability API', () => {
    const validDate = new Date(); // Jan 1, 2099, 10:00 AM UTC
    const invalidDate = 'not-a-date';

    test('Get Parking - success', async () => {
        const parkingSpaces = await getParkingWithAvailabilityAt(validDate);
        expect(Array.isArray(parkingSpaces)).toBe(true);
        expect(parkingSpaces.length).toBeGreaterThan(0); // Assuming some parking spaces are available
        expect(parkingSpaces[0]).toHaveProperty('space_id');
        expect(parkingSpaces[0]).toHaveProperty('x');
        expect(parkingSpaces[0]).toHaveProperty('y');
        expect(parkingSpaces[0]).toHaveProperty('isAvailable');
        console.log('Parking spaces:', parkingSpaces);
    });

    test('Get Parking - invalid date', async () => {
        try {
            await getParkingWithAvailabilityAt(invalidDate);
        } catch (error) {
            console.log('EXPECTED error: invalid date', error.message);
            expect(error).toBeTruthy();
            expect(error.message).toContain('Invalid date provided');
        }
    });

    test('Get Parking - missing date', async () => {
        try {
            await getParkingWithAvailabilityAt(); // No date provided
        } catch (error) {
            console.log('EXPECTED error: missing date', error.message);
            expect(error).toBeTruthy();
            expect(error.message).toContain('Invalid date provided');
        }
    });
});
