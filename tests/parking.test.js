import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { signin, signout } from '../src/scripts/auth.js';
import { editParking } from '../src/scripts/api.js';

const TEST_EMAIL = 'testuser@example.com';
const TEST_PASSWORD = 'testpassword';

describe('Edit Parking Spot API', () => {
    const mockParkingId = 'parking_123';
    const validUpdates = { name: 'Updated Name', status: 'available' };
    const invalidUpdates = { name: '', status: 'unknown' };

    beforeAll(async () => {
        // Log in the mock user before tests
        await signin(TEST_EMAIL, TEST_PASSWORD);
    });

    afterAll(async () => {
        // Log out the mock user after tests
        await signout();
    });

    it('should successfully edit a parking spot', async () => {
        const result = await editParking(mockParkingId, validUpdates);
        expect(result).toHaveProperty('message');
        expect(result.message).toContain(`Parking spot ${mockParkingId} updated successfully.`);
    });

    it('should fail to edit a parking spot with invalid updates', async () => {
        try {
            await editParking(mockParkingId, invalidUpdates);
        } catch (error) {
            console.log('EXPECTED error: invalid updates', error.message);
            expect(error).toBeTruthy();
        }
    });

    it('should fail to edit a parking spot with invalid parking ID', async () => {
        const invalidParkingId = 'invalid_123';
        try {
            await editParking(invalidParkingId, validUpdates);
        } catch (error) {
            console.log('EXPECTED error: parking spot not found', error.message);
            expect(error.message).toContain('Parking spot not found');
        }
    });

    it('should fail to edit a parking spot with no updates provided', async () => {
        try {
            await editParking(mockParkingId, {});
        } catch (error) {
            console.log('EXPECTED error: no updates provided', error.message);
            expect(error.message).toContain('Invalid inputs');
        }
    });

    it('should fail when parking ID is missing', async () => {
        try {
            await editParking('', validUpdates);
        } catch (error) {
            console.log('EXPECTED error: missing parking ID', error.message);
            expect(error.message).toContain('Invalid inputs');
        }
    });
});
