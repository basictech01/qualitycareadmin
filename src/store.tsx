import { configureStore } from '@reduxjs/toolkit';
import { loyaltyReducer } from './app/loyalty/store';
import { redemptionReducer } from './app/loyalty/store';

const store = configureStore({
    reducer: {
        loyalty: loyaltyReducer,
        redemption: redemptionReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;

