// User Types
export type UserRole = 'user' | 'admin';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  phone: string;
  vehiclePlate: string;
  createdAt: Date;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Parking Space Types
export type SpaceStatus = 'available' | 'occupied' | 'reserved' | 'maintenance';
export type SpaceType = 'compact' | 'standard' | 'premium';

export interface ParkingSpace {
  id: string;
  level: number;
  number: string;
  status: SpaceStatus;
  reservedBy?: string;
  type: SpaceType;
  features: string[];
  pricePerHour: number;
}

export interface ParkingLevel {
  level: number;
  spaces: ParkingSpace[];
  occupancyRate: number;
}

// Reservation Types
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
}

// Analytics Types
export interface DashboardStats {
  totalReservations: number;
  activeReservations: number;
  occupancyRate: number;
  totalRevenue: number;
  totalUsers: number;
}

export interface ParkingStats {
  availableSpaces: number;
  occupiedSpaces: number;
  reservedSpaces: number;
  maintenanceSpaces: number;
  totalSpaces: number;
}
