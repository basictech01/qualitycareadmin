import { createAsyncThunk } from "@reduxjs/toolkit";
import { Branch } from "./state";
import { fetchWithAuth } from "@/utils/fetchWithAuth";

export const addBranch = createAsyncThunk(
    "branch/addBranch",
    async (
        branch: Omit<Branch, "id">,
        { rejectWithValue }
    ) => {
        try {
            const response = await fetchWithAuth('/branch', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(branch),
            });
            return response
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);

export const updateBranch = createAsyncThunk(
    "branch/updateBranch",
    async (
        branch: Branch,
        { rejectWithValue }
    ) => {
        try {
            const response = await fetchWithAuth('/branch/${branch.id}', {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(branch),
            });
            return response
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);


export const fetchBranch = createAsyncThunk(
    "branch/fetchBranch",
    async (_, { rejectWithValue }) => {
        try {
            // Dummy data for now
            const data = [
                {
                    id: 1,
                    name_ar: "فرع 1",
                    name_en: "Branch 1",
                    city_en: "City 1",
                    city_ar: "مدينة 1",
                    latitude: 37.7749,
                    longitude: -122.4194,
                },
                {
                    id: 2,
                    name_ar: "فرع 2",
                    name_en: "Branch 2",
                    city_en: "City 2",
                    city_ar: "مدينة 2",
                    latitude: 34.0522,
                    longitude: -118.2437,
                },
            ];

            return data;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);


export const deleteBranch = createAsyncThunk(
    "branch/deleteBranch",
    async (branchId: number, { rejectWithValue }) => {
        try {

            return branchId;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);
