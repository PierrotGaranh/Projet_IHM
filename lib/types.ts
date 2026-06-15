export type UserRole = 'user' | 'admin';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  phone: string;
  vehiclePlates: string[];
  createdAt: Date;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export type SpaceStatus = 'available' | 'occupied' | 'maintenance';
export type SpaceType = 'compact' | 'standard' | 'premium';

export interface Location {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
}

export interface ParkingSpace {
  id: string;
  locationId: string;
  section: number;
  number: string;
  status: SpaceStatus;
  type: SpaceType;
  features: string[];
  pricePerHour: number;
}

export interface ParkingSection {
  section: number;
  spaces: ParkingSpace[];
  occupancyRate: number;
}

export type ReservationStatus = 'active' | 'completed' | 'cancelled';

export interface Reservation {
  id: string;
  userId: string;
  spaceId: string;
  startDate: Date;
  endDate: Date;
  status: ReservationStatus;
  createdAt: Date;
  amount: number;
  vehiclePlate: string;
}

export interface DashboardStats {
  activeReservations: number;
  occupancyRate: number;
  totalRevenue: number;
  totalUsers: number;
  newUsersThisMonth: number;
  revenueChange: number;
}

export interface ParkingStats {
  availableSpaces: number;
  occupiedSpaces: number;
  maintenanceSpaces: number;
  totalSpaces: number;
}

export interface ActivityLog {
  id: string;
  type: 'user' | 'reservation' | 'parking' | 'system';
  message: string;
  timestamp: Date;
  userId?: string;
}