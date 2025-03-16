import { fetchWithAuth } from "@/utils/fetchWithAuth";
import { createAsyncThunk } from "@reduxjs/toolkit";

export const fetchVat = createAsyncThunk("vat/fetchVat", async (_, { rejectWithValue }) => {
    try {
        const response = await fetchWithAuth('/vat');
        return response.vat;
    } catch (error: any) {
        return rejectWithValue(error.message);
    }
});

export const updateVat = createAsyncThunk(
    "vat/updateVat",
    async (vat: number, { rejectWithValue }) => {
        try {
            const response = await fetchWithAuth('/vat', {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ vat }),
            });


            return response.vat;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);
