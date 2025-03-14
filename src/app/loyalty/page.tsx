'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchLoyaltyList } from './actions';
import { fetchRedemptionHistory } from './actions';
import { filterRedemptionHistory } from './store';
import { RootState } from '@/store';
import { RedemptionHistory } from './state';

export default function LoyaltyPage() {
    const dispatch = useDispatch();
    const { state, list } = useSelector((state: RootState) => state.loyalty);
    const { filteredHistory } = useSelector((state: RootState) => state.redemption);

    useEffect(() => {
        dispatch(fetchLoyaltyList() as any);
        dispatch(fetchRedemptionHistory() as any);
    }, [dispatch]);

    const handleSelectCustomer = (customerId: string) => {
        dispatch(filterRedemptionHistory(customerId));
    };

    if (state === 'LOADING') return <div>Loading...</div>;
    if (state === 'ERROR') return <div>Error loading data</div>;

    return (
        <div>
            <h1>Loyalty List</h1>
            {list?.map((customer) => (
                <div key={customer.id} onClick={() => handleSelectCustomer(customer.id)}>
                    {customer.name} - {customer.visitCount} visits
                </div>
            ))}

            <h2>Redemption History</h2>
            {filteredHistory ? (
                filteredHistory.map((history: RedemptionHistory) => (
                    <div key={history.bookingId}>
                        {history.date} - {history.bookingId}
                    </div>
                ))
            ) : (
                <div>Select a customer to view redemption history</div>
            )}
        </div>
    );
}

