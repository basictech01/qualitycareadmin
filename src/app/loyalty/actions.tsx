import { createAsyncThunk } from '@reduxjs/toolkit';

// Fetch loyalty list
export const fetchLoyaltyList = createAsyncThunk(
    'loyalty/fetchLoyaltyList',
    async (_, { rejectWithValue }) => {
        try {
            return {
                list: [
                    {
                        id: '1',
                        name: 'Customer 1',
                        visitCount: 10,
                        stampsCollected: 5,
                        branchName: 'Branch 1',
                    },
                    {
                        id: '2',
                        name: 'Customer 2',
                        visitCount: 15,
                        stampsCollected: 8,
                        branchName: 'Branch 2',
                    },
                ],
            };

            // TODO: Fetch loyalty list
            const response = await fetch('');
            if (!response.ok) throw new Error('Failed to fetch loyalty list');
            return await response.json();
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

// Fetch redemption history
export const fetchRedemptionHistory = createAsyncThunk(
    'redemption/fetchRedemptionHistory',
    async (_, { rejectWithValue }) => {
        try {
            return {
                history: [
                    {
                        bookingId: '1',
                        customerId: '1',
                        date: '2022-01-01',
                    },
                    {
                        bookingId: '2',
                        customerId: '1',
                        date: '2022-01-02',
                    },
                    {
                        bookingId: '3',
                        customerId: '2',
                        date: '2022-01-05',
                    },
                ],
            };

            // TODO: Fetch redemption list
            const response = await fetch('');
            if (!response.ok) throw new Error('Failed to fetch redemption history');
            return await response.json();
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

