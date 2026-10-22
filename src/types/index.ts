export type TabId =
  | 'al-raisiya'
  | 'al-manasik-wa-al-idad'
  | 'al-istiadad-wa-al-haqiba'
  | 'al-mukhayyam-wa-al-khadamat'
  | 'al-kharita-wa-al-radar';

export interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  category: string;
  isCustom?: boolean;
}

export interface ChecklistCategory {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  badge: string;
  items: ChecklistItem[];
}

export interface Companion {
  id: string;
  name: string;
  relation: string;
  location: string;
  distance: string;
  distanceMeters: number;
  battery: number;
  connectionType: string;
  avatar: string;
  isNear: boolean;
  notes?: string;
  coordinates: { x: number; y: number }; // Percentage for radar position
}

export interface CrowdZone {
  id: string;
  name: string;
  subtitle: string;
  statusText: string;
  densityPercentage: number;
  statusLevel: 'smooth' | 'moderate' | 'heavy';
  extraInfo?: string;
}

export interface MealItem {
  dayId: string;
  dayName: string;
  hijriDate: string;
  mealType: string;
  title: string;
  timeRange: string;
  imageUrl: string;
  imageAlt: string;
  menuTags: string[];
  dietaryPreference: string;
}

export interface CampSupervisor {
  id: string;
  name: string;
  role: string;
  initial: string;
  phone: string;
  colorBg: string;
}

export interface TourismCompany {
  name: string;
  licenseNumber: string;
  hotline: string;
  whatsapp: string;
  emergencyPhone: string;
  branchCity: string;
  supervisorName: string;
}

export interface HotelDetails {
  hotelName: string;
  hotelAddress: string;
  hotelRoom: string;
  hotelDistanceToHaram: string;
  hotelPhone: string;
  city?: 'makkah' | 'madinah';
}

export interface UserProfile {
  name: string;
  badgeId: string;
  avatar: string;
  campaignName: string;
  tourismCompany?: TourismCompany;
  accommodationType: 'hotel' | 'camp' | 'both';
  hotelName?: string;
  hotelAddress?: string;
  hotelRoom?: string;
  hotelDistanceToHaram?: string;
  hotelPhone?: string;
  makkahHotel?: HotelDetails;
  madinahHotel?: HotelDetails;
  campLocation?: string;
  flightInfo?: string;
}

