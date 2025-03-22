export interface Category {
    id?: number;
    type: string;
    name_en: string;
    name_ar: string;
    image_en: string;
    image_ar: string;
}

export interface TimeRange {
    start_time: string;
    end_time: string;
  }

export interface SelectedBranch {
  id: number;
  name: string;
  availableDays: string[];
}