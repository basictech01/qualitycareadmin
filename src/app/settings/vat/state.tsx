export interface VatState {
    vat: number | null;
    loading: boolean;
    error: string | null;
}

export const initialVatState: VatState = {
    vat: null,
    loading: false,
    error: null,
};
