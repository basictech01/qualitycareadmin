import { ApexOptions } from 'apexcharts';
//doctor add adddoctor
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

export interface Notification {
    
    message_ar: string;
    message_en: string;
    scheduled_timestamp: string;
}
  

export interface SelectedBranch {
  id: number;
  name_en: string;
  availableDays: number[];
}

export interface Doctor {
  id?: number;
  name_en: string;
  name_ar: string;
  attended_patient: number;
  session_fees: number;
  total_experience: number;
  languages: string;
  about_en: string;
  photo_url: string;
  about_ar: string;
  qualification: string;
}

export interface AddUserLayerProps {
  doctor?: Doctor; // Doctor data from API (or undefined)
  onSuccess: (doctor:Doctor)=> void

}

export interface OldData {
  doctor?: Doctor;
  selectedBranches?: SelectedBranch[];
  timeSlots?: TimeRange[];
}
export interface ImageUploaderProps {
  imagePreviewUrl: string;
  onImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface FormFieldProps {
  id: string;
  label: string;
  value: string | number;
  placeholder?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  type?: string; // for input types (e.g. "text", "number")
  multiline?: boolean; // when true, renders a textarea instead of input
  required?: boolean;
}


//Customer page
export interface User {
  id: number;
  full_name: string;
  photo_url: string;
  email_address: string;
  phone_number: string;
  points: number;
  redeemed: boolean;
  total_visits: number;
}
export interface DoctorAppointment {
  id: number;
  user_id: number;
  status: string;
  start_time: string;
  end_time: string;
  branch_name_en: string;
  branch_name_ar: string;
  name_en: string;
  name_ar: string;
  photo_url: string;
  date: string;
}

export interface ServiceAppointment {
  id: number;
  user_id: number;
  status: string;
  branch_name_en: string;
  branch_name_ar: string;
  start_time: string;
  end_time: string;
  name_ar: string;
  name_en: string;
  category_name_en: string;
  category_name_ar: string;
  service_image_en_url: string;
  service_image_ar_url: string;
  date: string;
}

export interface CustomerRowProps {
  user: any;
  expandedUser: number | null;
  toggleDetails: (userId: number) => void;
  getInitials: (name: string) => string;
}

export interface AppointmentDetailsRowProps {
  user: any;
  activeTab: 'doctor' | 'service';
  setActiveTab: (tab: 'doctor' | 'service') => void;
  doctorAppointments: any[];
  serviceAppointments: any[];
  appointmentLoading: boolean;
}

export interface TabNavigationProps {
  activeTab: 'doctor' | 'service';
  setActiveTab: (tab: 'doctor' | 'service') => void;
}

export interface AppointmentsTableProps {
  appointments: any[];
}

export interface StatusBadgeProps {
  status: string;
}


//dash doc cmp 
export interface TimeFilterProps {
  title: string;
  value: string;
  onChange: (value: string) => void;
}

export interface MonthlySalesChartProps {
  options: ApexOptions;
  series: any; // Define a more specific type if needed
}

export interface OverallStatsProps {
  totalAppointments: number;
  totalIncome: number;
  completedIncome: number;
  cancelationRate: number;
}

export interface DoctorPerformanceTableProps {
  doctorStats: DoctorStats[];
}

export interface DoctorBookingData {
  id: number;
  user_id: number;
  user_full_name: string;
  user_email: string;
  booking_status: 'COMPLETED' | 'CANCELED' | 'SCHEDULED';
  doctor_id: number;
  doctor_name_en: string;
  doctor_name_ar: string;
  doctor_photo_url: string;
  doctor_session_fees: number;
  time_slot_id: number;
  time_slot_start_time: string;
  time_slot_end_time: string;
  branch_id: number;
  branch_name_en: string;
  branch_name_ar: string;
  booking_date: string;
}

export interface DoctorStats {
  doctorId: number;
  doctorName: string;
  totalAppointments: number;
  completedAppointments: number;
  canceledAppointments: number;
  rescheduledAppointments: number;
  totalIncome: number;
  completedIncome: number;
  futureIncome: number;
  photoUrl: string;
}

export interface MonthlySalesData {
  month: string;
  totalSales: number;
  completedSales: number;
}


// sales dash cmp 

export interface SalesCardProps {
  title: string;
  value: string;
  description: string;
  bgColor: string;
  textColor: string;
}

export interface ServiceData {
  name: string;
  category: string;
  amount: number;
  bookingsCount: number;
}
export interface ServicesTableProps {
  data: ServiceData[];
  totalRevenue: number;
}

export interface MonthlySalesChartProps {
  options: ApexOptions; // Define more specific types if possible
  series: any; // Define more specific types if possible
}

export interface SalesData {
  totalRevenue: number;
  completedRevenue: number;
  upcomingRevenue: number;
  dentalTotal: number;
  dermatTotal: number;
  serviceBreakdown: ServiceData[];
  monthlySales: { month: string; dental: number; dermatology: number }[];
}

export interface SalesBookingData {
  service_discounted_price: string;
  service_actual_price: string;
  booking_status:'COMPLETED' | 'CANCELED' | 'SCHEDULED';
  service_category_type: string;
  service_name_en: string;
  booking_date: string;
}

export interface ServiceTypeIndicatorProps {
  color: string;
  label: string;
  value: string;
}