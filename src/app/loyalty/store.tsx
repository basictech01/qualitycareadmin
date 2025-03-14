import { createSlice } from '@reduxjs/toolkit';
import { initialLoyaltyState, initialRedemptionState, STATE } from './state';
import { fetchLoyaltyList, fetchRedemptionHistory } from './actions';

const loyaltySlice = createSlice({
    name: 'loyalty',
    initialState: initialLoyaltyState,
    reducers: {
        setFilter(state, action) {
            state.filter = action.payload;
        },
        clearFilter(state) {
            state.filter = initialLoyaltyState.filter;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchLoyaltyList.pending, (state) => {
                state.state = STATE.LOADING;
            })
            .addCase(fetchLoyaltyList.fulfilled, (state, action) => {
                state.state = STATE.INITIALIZED;
                state.list = action.payload.list;
            })
            .addCase(fetchLoyaltyList.rejected, (state) => {
                state.state = STATE.ERROR;
            });
    },
});

const redemptionSlice = createSlice({
    name: 'redemption',
    initialState: initialRedemptionState,
    reducers: {
        filterRedemptionHistory: (state, action) => {
            const customerId = action.payload;
            state.filteredHistory = state.history?.filter(
                (item) => item.customerId === customerId
            ) || null;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchRedemptionHistory.pending, (state) => {
                state.state = STATE.LOADING;
            })
            .addCase(fetchRedemptionHistory.fulfilled, (state, action) => {
                state.state = STATE.INITIALIZED;
                state.history = action.payload.history;
            })
            .addCase(fetchRedemptionHistory.rejected, (state) => {
                state.state = STATE.ERROR;
            });
    },
});

export const { setFilter, clearFilter } = loyaltySlice.actions;
export const { filterRedemptionHistory } = redemptionSlice.actions;

export const loyaltyReducer = loyaltySlice.reducer;
export const redemptionReducer = redemptionSlice.reducer;

