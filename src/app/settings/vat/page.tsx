"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/store";
import { fetchVat, updateVat } from "./actions";

export default function VatSettingsPage() {
    const dispatch = useDispatch<AppDispatch>();
    const { vat, loading, error } = useSelector((state: RootState) => state.vat);
    const [newVat, setNewVat] = useState<number | "">(vat || "");

    useEffect(() => {
        dispatch(fetchVat());
    }, [dispatch]);

    useEffect(() => {
        if (vat) {
            setNewVat(vat);
        }
    }, [vat]);

    const handleUpdateVat = async () => {
        if (newVat === "" || isNaN(Number(newVat))) return;
        dispatch(updateVat(Number(newVat)));
    };

    return (
        <div className="p-6 bg-gray-800 text-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4">VAT Settings</h2>

            {loading ? (
                <p>Loading...</p>
            ) : error ? (
                <p className="text-red-500">{error}</p>
            ) : (
                <div>
                    <div className="mb-4">
                        <label className="block mb-2">Current VAT (%)</label>
                        <input
                            type="number"
                            value={newVat}
                            onChange={(e) => setNewVat(Number(e.target.value))}
                            className="p-2 bg-gray-700 border border-gray-600 rounded w-full"
                        />
                    </div>
                    <button
                        onClick={handleUpdateVat}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded"
                    >
                        Update VAT
                    </button>
                </div>
            )}
        </div>
    );
}

