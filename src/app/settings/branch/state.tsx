export interface Branch {
    id: number;
    name_ar: string;
    name_en: string;
    city_en: string;
    city_ar: string;
    latitude: number;
    longitude: number;
}

export interface BranchState {
    branches: Branch[];
    loading: boolean;
    error: string | null;
}

export const initialBranchState: BranchState = {
    branches: [],
    loading: false,
    error: null,
};

