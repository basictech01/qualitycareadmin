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
            // dummy data
            // return branch

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
            // dummy data
            // return branch

            const response = await fetchWithAuth(`/branch/${branch.id}`, {
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
            // dummy data
            // return [
            //     {
            //         id: 1,
            //         name_ar: "Branch 1",
            //         name_en: "Branch 1",
            //         city_en: "City 1",
            //         city_ar: "City 1",
            //         latitude: 1,
            //         longitude: 1,
            //     },
            //     {
            //         id: 2,
            //         name_ar: "Branch 2",
            //         name_en: "Branch 2",
            //         city_en: "City 2",
            //         city_ar: "City 2",
            //         latitude: 2,
            //         longitude: 2,
            //     },
            // ]
            const data = await fetchWithAuth('/branch');
            return data.branch;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);


export const deleteBranch = createAsyncThunk(
    "branch/deleteBranch",
    async (branchId: number, { rejectWithValue }) => {
        try {
            // dummy data
            // return branchId

            const data = await fetchWithAuth(`/branch/${branchId}`, {
                method: "DELETE",
            })
            return data;
        } catch (error: any) {
            return rejectWithValue(error.message);
        }
    }
);
