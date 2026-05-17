import { User, ParkingSpace, Reservation } from '@/lib/types';

// Hash password (simple base64 for demo - not production ready)
const hashPassword = (password: string): string => {
  return Buffer.from(password).toString('base64');
};

const verifyPassword = (password: string, hash: string): boolean => {
  return hashPassword(password) === hash;
};

// Initial data
const INITIAL_USERS: User[] = [
  {
    id: 'user-1',
    email: 'user@example.com',
    firstName: 'Jean',
    lastName: 'Dupont',
    role: 'user',
    phone: '+33612345678',
    vehiclePlate: 'AB123CD',
    createdAt: new Date('2024-01-15'),
  },
  {
    id: 'admin-1',
    email: 'admin@example.com',
    firstName: 'Admin',
    lastName: 'System',
    role: 'admin',
    phone: '+33698765432',
    vehiclePlate: 'ADMIN01',
    createdAt: new Date('2024-01-01'),
  },
];

// Store password separately
const USER_PASSWORDS: Record<string, string> = {
  'user@example.com': hashPassword('password123'),
  'admin@example.com': hashPassword('admin123'),
};

// Generate parking spaces
const generateParkingSpaces = (): ParkingSpace[] => {
  const spaces: ParkingSpace[] = [];
  const types: Array<'compact' | 'standard' | 'premium'> = ['compact', 'standard', 'premium'];
  const features = ['handicap', 'charger', 'covered', 'security'];

  for (let level = 1; level <= 5; level++) {
    const spacesPerLevel = 15;
    for (let i = 1; i <= spacesPerLevel; i++) {
      const spaceType = types[Math.floor(Math.random() * types.length)];
      const status: Array<'available' | 'occupied' | 'reserved' | 'maintenance'> = 
        ['available', 'occupied', 'reserved', 'maintenance'];
      
      const randomStatus = status[Math.floor(Math.random() * status.length)];
      
      spaces.push({
        id: `space-${level}-${i}`,
        level,
        number: `${level}${String(i).padStart(2, '0')}`,
        status: randomStatus as 'available' | 'occupied' | 'reserved' | 'maintenance',
        type: spaceType,
        features: features.filter(() => Math.random() > 0.6),
        pricePerHour: spaceType === 'premium' ? 5 : spaceType === 'standard' ? 3 : 2,
      });
    }
  }

  return spaces;
};

const INITIAL_PARKING_SPACES = generateParkingSpaces();

const INITIAL_RESERVATIONS: Reservation[] = [
  {
    id: 'res-1',
    userId: 'user-1',
    spaceId: 'space-1-1',
    startDate: new Date(new Date().getTime() - 24 * 60 * 60 * 1000),
    endDate: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
    status: 'active',
    createdAt: new Date(new Date().getTime() - 2 * 24 * 60 * 60 * 1000),
    amount: 72,
  },
  {
    id: 'res-2',
    userId: 'user-1',
    spaceId: 'space-2-5',
    startDate: new Date(new Date().getTime() + 3 * 24 * 60 * 60 * 1000),
    endDate: new Date(new Date().getTime() + 5 * 24 * 60 * 60 * 1000),
    status: 'active',
    createdAt: new Date(),
    amount: 144,
  },
];

// Store Manager
class StoreManager {
  private users: User[] = INITIAL_USERS;
  private spaces: ParkingSpace[] = INITIAL_PARKING_SPACES;
  private reservations: Reservation[] = INITIAL_RESERVATIONS;
  private currentUser: User | null = null;

  constructor() {
    this.loadFromLocalStorage();
  }

  private loadFromLocalStorage() {
    if (typeof window === 'undefined') return;

    const stored = localStorage.getItem('parkingAppStore');
    if (stored) {
      try {
        const data = JSON.parse(stored);
        this.users = data.users || this.users;
        this.spaces = data.spaces || this.spaces;
        this.reservations = data.reservations || this.reservations;
        this.currentUser = data.currentUser || null;
      } catch (e) {
        console.error('Failed to load from localStorage:', e);
      }
    }
  }

  private saveToLocalStorage() {
    if (typeof window === 'undefined') return;

    localStorage.setItem(
      'parkingAppStore',
      JSON.stringify({
        users: this.users,
        spaces: this.spaces,
        reservations: this.reservations,
        currentUser: this.currentUser,
      })
    );
  }

  // Auth methods
  login(email: string, password: string): { success: boolean; user?: User; error?: string } {
    const user = this.users.find(u => u.email === email);
    if (!user) {
      return { success: false, error: 'User not found' };
    }

    const storedPassword = USER_PASSWORDS[email];
    if (!storedPassword || !verifyPassword(password, storedPassword)) {
      return { success: false, error: 'Invalid password' };
    }

    this.currentUser = user;
    this.saveToLocalStorage();
    return { success: true, user };
  }

  register(email: string, password: string, firstName: string, lastName: string, phone: string): 
    { success: boolean; user?: User; error?: string } {
    if (this.users.find(u => u.email === email)) {
      return { success: false, error: 'Email already exists' };
    }

    const newUser: User = {
      id: `user-${Date.now()}`,
      email,
      firstName,
      lastName,
      phone,
      role: 'user',
      vehiclePlate: '',
      createdAt: new Date(),
    };

    this.users.push(newUser);
    USER_PASSWORDS[email] = hashPassword(password);
    this.currentUser = newUser;
    this.saveToLocalStorage();
    return { success: true, user: newUser };
  }

  logout() {
    this.currentUser = null;
    this.saveToLocalStorage();
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  // User methods
  getUser(id: string): User | undefined {
    return this.users.find(u => u.id === id);
  }

  getAllUsers(): User[] {
    return this.users;
  }

  updateUser(id: string, updates: Partial<User>): boolean {
    const user = this.users.find(u => u.id === id);
    if (!user) return false;

    Object.assign(user, updates);
    if (this.currentUser?.id === id) {
      this.currentUser = user;
    }
    this.saveToLocalStorage();
    return true;
  }

  // Parking methods
  getSpaces(): ParkingSpace[] {
    return this.spaces;
  }

  getSpace(id: string): ParkingSpace | undefined {
    return this.spaces.find(s => s.id === id);
  }

  getSpacesByLevel(level: number): ParkingSpace[] {
    return this.spaces.filter(s => s.level === level);
  }

  updateSpace(id: string, updates: Partial<ParkingSpace>): boolean {
    const space = this.spaces.find(s => s.id === id);
    if (!space) return false;

    Object.assign(space, updates);
    this.saveToLocalStorage();
    return true;
  }

  getParkingStats() {
    const available = this.spaces.filter(s => s.status === 'available').length;
    const occupied = this.spaces.filter(s => s.status === 'occupied').length;
    const reserved = this.spaces.filter(s => s.status === 'reserved').length;
    const maintenance = this.spaces.filter(s => s.status === 'maintenance').length;

    return {
      availableSpaces: available,
      occupiedSpaces: occupied,
      reservedSpaces: reserved,
      maintenanceSpaces: maintenance,
      totalSpaces: this.spaces.length,
      occupancyRate: ((occupied + reserved) / this.spaces.length) * 100,
    };
  }

  // Reservation methods
  getReservations(): Reservation[] {
    return this.reservations;
  }

  getUserReservations(userId: string): Reservation[] {
    return this.reservations.filter(r => r.userId === userId);
  }

  getReservation(id: string): Reservation | undefined {
    return this.reservations.find(r => r.id === id);
  }

  createReservation(
    userId: string,
    spaceId: string,
    startDate: Date,
    endDate: Date
  ): { success: boolean; reservation?: Reservation; error?: string } {
    const space = this.getSpace(spaceId);
    if (!space) {
      return { success: false, error: 'Space not found' };
    }

    if (space.status !== 'available') {
      return { success: false, error: 'Space is not available' };
    }

    const hours = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60);
    const amount = Math.round(hours * space.pricePerHour * 100) / 100;

    const reservation: Reservation = {
      id: `res-${Date.now()}`,
      userId,
      spaceId,
      startDate,
      endDate,
      status: 'active',
      createdAt: new Date(),
      amount,
    };

    this.reservations.push(reservation);
    this.updateSpace(spaceId, { status: 'reserved', reservedBy: userId });
    this.saveToLocalStorage();
    return { success: true, reservation };
  }

  updateReservation(id: string, updates: Partial<Reservation>): boolean {
    const reservation = this.reservations.find(r => r.id === id);
    if (!reservation) return false;

    Object.assign(reservation, updates);
    this.saveToLocalStorage();
    return true;
  }

  cancelReservation(id: string): boolean {
    const reservation = this.reservations.find(r => r.id === id);
    if (!reservation) return false;

    reservation.status = 'cancelled';
    const space = this.getSpace(reservation.spaceId);
    if (space) {
      this.updateSpace(space.id, { status: 'available', reservedBy: undefined });
    }
    this.saveToLocalStorage();
    return true;
  }

  getDashboardStats() {
    const totalReservations = this.reservations.length;
    const activeReservations = this.reservations.filter(r => r.status === 'active').length;
    const totalRevenue = this.reservations
      .filter(r => r.status === 'active' || r.status === 'completed')
      .reduce((sum, r) => sum + r.amount, 0);

    const stats = this.getParkingStats();
    const availableSpaces = this.spaces.filter(s => s.status === 'available').length;

    return {
      totalReservations,
      activeReservations,
      occupancyRate: stats.occupancyRate,
      totalRevenue,
      totalUsers: this.users.filter(u => u.role === 'user').length,
      availableSpaces
    };
  }
}

// Create singleton instance
let storeInstance: StoreManager | null = null;

export function getStore(): StoreManager {
  if (!storeInstance) {
    storeInstance = new StoreManager();
  }
  return storeInstance;
}

export function resetStore() {
  storeInstance = null;
  if (typeof window !== 'undefined') {
    localStorage.removeItem('parkingAppStore');
  }
}
