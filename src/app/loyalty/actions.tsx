import { createAsyncThunk } from '@reduxjs/toolkit';

// Fetch loyalty list
export const fetchLoyaltyList = createAsyncThunk(
    'loyalty/fetchLoyaltyList',
    async (_, { rejectWithValue }) => {
        try {

            // return {
            //     list: [
            //         {
            //             user_id: '1',
            //             name: 'Customer 1',
            //             visitCount: 10,
            //             stampsCollected: 5,
            //             branchName: 'Branch 1',
            //         },
            //         {
            //             user_id: '2',
            //             name: 'Customer 2',
            //             visitCount: 15,
            //             stampsCollected: 8,
            //             branchName: 'Branch 2',
            //         },
            //     ],
            // };

            // TODO: Fetch loyalty list
            const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + '/redeem/user_list');
            if (!response.ok) throw new Error('Failed to fetch loyalty list');
            console.log("response: ", response.json())
            let res: any = await response.json();
            if (res.success) {
                const list = res.data
                return list
            }
            return {}
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

            // return {
            //     history: [
            //         {
            //             id: '1',
            //             booking_id: '1',
            //             user_id: '1',
            //             service_id: '2',
            //             date: '2022-01-01',
            //         },
            //     ],
            // };

            // TODO: Fetch redemption list

            const response = await fetch(process.env.NEXT_PUBLIC_BACKEND_URL + '/redeem/history');
            if (!response.ok) throw new Error('Failed to fetch redemption history');
            let res: any = await response.json();
            if (res.success) {
                const history = res.data
                return history
            }
            return {}
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

