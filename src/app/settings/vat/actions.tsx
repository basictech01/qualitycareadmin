import { createAsyncThunk } from "@reduxjs/toolkit";

const BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export const fetchVat = createAsyncThunk("vat/fetchVat", async (_, { rejectWithValue }) => {
    try {
        const res = await fetch(`${BASE_URL}/vat`);
        if (!res.ok) throw new Error("Failed to fetch VAT");

        const data = await res.json();
        return data.data.vat;
    } catch (error: any) {
        return rejectWithValue(error.message);
    }
});

export const updateVat = createAsyncThunk(
    "vat/updateVat",
    async (vat: number, { rejectWithValue }) => {
        try {
            const res = await fetch(`${BASE_URL}/vat`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ vat }),
            });

            if (!res.ok) throw new Error("Failed to update VAT");

            const data = await res.json();
            return data.data.vat;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);
