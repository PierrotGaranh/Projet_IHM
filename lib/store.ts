import { User, ParkingSpace, Reservation, ActivityLog, DashboardStats, ParkingStats, Location } from '@/lib/types';

const STORAGE_KEY = 'parkhub_store_data';
const SESSION_KEY = 'parkhub_current_user';

const hashPassword = (password: string): string => {
  return Buffer.from(password).toString('base64');
};

const verifyPassword = (password: string, hash: string): boolean => {
  return hashPassword(password) === hash;
};

const LOCATIONS: Location[] = [
  { id: 'loc1', name: 'Paris Bercy', address: '4 Cour Saint-Émilion, 75012 Paris', lat: 48.839, lng: 2.382 },
  { id: 'loc2', name: 'Lyon Part-Dieu', address: '5 Place Charles Béraudier, 69003 Lyon', lat: 45.760, lng: 4.859 },
  { id: 'loc3', name: 'Marseille Vieux-Port', address: '58 Quai du Port, 13002 Marseille', lat: 43.296, lng: 5.369 },
  { id: 'loc4', name: 'Lille Flandres', address: 'Place des Buisses, 59000 Lille', lat: 50.637, lng: 3.071 },
  { id: 'loc5', name: 'Toulouse Capitole', address: '15 Place du Capitole, 31000 Toulouse', lat: 43.604, lng: 1.444 },
];

function generateRealisticUsers(): User[] {
  const firstNames = ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve', 'Frank', 'Grace', 'Henry', 'Ivy', 'Jack', 'Karen', 'Leo', 'Mia', 'Nina', 'Oscar'];
  const lastNames = ['Martin', 'Bernard', 'Dubois', 'Thomas', 'Robert', 'Richard', 'Petit', 'Durand', 'Leroy', 'Moreau', 'Simon', 'Laurent', 'Lefebvre', 'Michel', 'Garcia'];
  const users: User[] = [];

  users.push({
    id: 'admin-demo',
    email: 'admin@example.com',
    firstName: 'Admin',
    lastName: 'System',
    role: 'admin',
    phone: '+33698765432',
    vehiclePlates: ['ADMIN01'],
    createdAt: new Date('2024-01-01'),
  });

  users.push({
    id: 'user-demo',
    email: 'user@example.com',
    firstName: 'Jean',
    lastName: 'Dupont',
    role: 'user',
    phone: '+33612345678',
    vehiclePlates: ['AB123CD'],
    createdAt: new Date('2024-01-15'),
  });

  for (let i = 0; i < 15; i++) {
    const createdAt = new Date();
    createdAt.setMonth(createdAt.getMonth() - Math.floor(Math.random() * 6));
    users.push({
      id: `user-${i + 3}`,
      email: `user${i + 2}@example.com`,
      firstName: firstNames[i % firstNames.length],
      lastName: lastNames[i % lastNames.length],
      role: 'user',
      phone: `+336${Math.floor(10000000 + Math.random() * 90000000)}`,
      vehiclePlates: [`${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${Math.floor(100 + Math.random() * 900)}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}`],
      createdAt,
    });
  }
  return users;
}

function generateParkingSpaces(locations: Location[]): ParkingSpace[] {
  const spaces: ParkingSpace[] = [];
  const types: Array<'compact' | 'standard' | 'premium'> = ['compact', 'standard', 'premium'];
  let globalNumber = 1;

  for (const loc of locations) {
    for (let section = 1; section <= 4; section++) {
      const spacesPerSection = 18;
      for (let i = 1; i <= spacesPerSection; i++) {
        let spaceType: 'compact' | 'standard' | 'premium';
        if (i <= 3) spaceType = 'premium';
        else if (i <= 11) spaceType = 'standard';
        else spaceType = 'compact';

        let features: string[] = [];
        if (spaceType === 'premium') {
          features = ['chargeur', 'surveillée', 'sécurisée'];
          if (Math.random() > 0.7) features.push('handicap');
        } else {
          if (Math.random() > 0.8) features.push('handicap');
        }

        spaces.push({
          id: `space-${loc.id}-${section}-${i}`,
          locationId: loc.id,
          section,
          number: `${loc.id.substring(3)}${section}${String(i).padStart(2, '0')}`,
          status: 'available',
          type: spaceType,
          features,
          pricePerHour: spaceType === 'premium' ? 5 : spaceType === 'standard' ? 3 : 2,
        });
        globalNumber++;
      }
    }
  }
  return spaces;
}

function generateRealisticReservations(users: User[], spaces: ParkingSpace[]): Reservation[] {
  const reservations: Reservation[] = [];
  const now = new Date();

  for (const user of users.filter(u => u.role === 'user')) {
    const numRes = Math.floor(Math.random() * 4) + 1;
    const userReservations: Reservation[] = [];

    for (let i = 0; i < numRes; i++) {
      let startDate = new Date();
      startDate.setDate(now.getDate() + Math.floor(Math.random() * 60) - 30);
      startDate.setHours(
        Math.floor(Math.random() * 24),
        Math.floor(Math.random() * 60),
        0, 0
      );

      const durationHours = Math.floor(Math.random() * 48) + 2;
      let endDate = new Date(startDate.getTime() + durationHours * 60 * 60 * 1000);

      let conflicts = true;
      let attempts = 0;
      let selectedPlate = '';
      while (conflicts && attempts < 10) {
        conflicts = false;
        selectedPlate = user.vehiclePlates.length > 0
          ? user.vehiclePlates[Math.floor(Math.random() * user.vehiclePlates.length)]
          : `AB${Math.floor(100 + Math.random() * 900)}CD`;
        for (const existing of userReservations) {
          if (existing.vehiclePlate === selectedPlate &&
              ((startDate < existing.endDate && endDate > existing.startDate))) {
            conflicts = true;
            startDate = new Date(startDate.getTime() + 24 * 60 * 60 * 1000);
            endDate = new Date(startDate.getTime() + durationHours * 60 * 60 * 1000);
            break;
          }
        }
        attempts++;
      }

      let status: 'active' | 'completed' | 'cancelled';
      if (endDate < now) status = 'completed';
      else if (startDate > now) status = 'active';
      else status = 'active';

      const space = spaces[Math.floor(Math.random() * spaces.length)];
      const hours = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60);
      const amount = Math.round(hours * space.pricePerHour * 100) / 100;

      const reservation: Reservation = {
        id: `res-${user.id}-${i}`,
        userId: user.id,
        spaceId: space.id,
        startDate,
        endDate,
        status,
        createdAt: new Date(startDate.getTime() - 24 * 60 * 60 * 1000),
        amount,
        vehiclePlate: selectedPlate,
      };
      userReservations.push(reservation);
      reservations.push(reservation);
    }
  }
  return reservations;
}

function syncSpacesWithReservations(spaces: ParkingSpace[], reservations: Reservation[], now: Date): void {
  for (const space of spaces) {
    if (space.status !== 'maintenance') space.status = 'available';
  }
  for (const res of reservations.filter(r => r.status === 'active')) {
    const space = spaces.find(s => s.id === res.spaceId);
    if (space && space.status !== 'maintenance') {
      if (res.startDate <= now && res.endDate >= now) {
        space.status = 'occupied';
      }
    }
  }
  const availableSpaces = spaces.filter(s => s.status === 'available');
  const numOccupied = Math.floor(availableSpaces.length * 0.2);
  for (let i = 0; i < numOccupied; i++) {
    const idx = Math.floor(Math.random() * availableSpaces.length);
    availableSpaces[idx].status = 'occupied';
  }
  const maintenanceCount = Math.floor(spaces.length * 0.03);
  for (let i = 0; i < maintenanceCount; i++) {
    const idx = Math.floor(Math.random() * spaces.length);
    spaces[idx].status = 'maintenance';
  }
}

interface StoreData {
  users: User[];
  spaces: ParkingSpace[];
  reservations: Reservation[];
  activities: ActivityLog[];
  userPasswords: [string, string][];
}

class StoreManager {
  private users: User[];
  private spaces: ParkingSpace[];
  private reservations: Reservation[];
  private activities: ActivityLog[];
  private currentUser: User | null = null;
  private userPasswords: Map<string, string>;

  constructor() {
    const stored = this.loadFromStorage();
    if (stored) {
      this.users = stored.users;
      this.spaces = stored.spaces;
      this.reservations = stored.reservations;
      this.activities = stored.activities;
      this.userPasswords = new Map(stored.userPasswords);
      this.currentUser = this.loadCurrentUserFromStorage();

      this.users = this.users.map(u => ({
        ...u,
        createdAt: u.createdAt instanceof Date ? u.createdAt : new Date(u.createdAt)
      }));

      this.reservations = this.reservations.map(r => ({
        ...r,
        startDate: r.startDate instanceof Date ? r.startDate : new Date(r.startDate),
        endDate: r.endDate instanceof Date ? r.endDate : new Date(r.endDate),
        createdAt: r.createdAt instanceof Date ? r.createdAt : new Date(r.createdAt)
      }));

      this.activities = this.activities.map(a => ({
        ...a,
        timestamp: a.timestamp instanceof Date ? a.timestamp : new Date(a.timestamp)
      }));
      this.refreshSpaceStatuses();
    } else {
      this.users = generateRealisticUsers();
      this.spaces = generateParkingSpaces(LOCATIONS);
      this.reservations = generateRealisticReservations(this.users, this.spaces);
      this.activities = [];
      this.userPasswords = new Map();

      syncSpacesWithReservations(this.spaces, this.reservations, new Date());
      this.generateInitialActivities();

      for (const user of this.users) {
        if (user.email === 'admin@example.com') {
          this.userPasswords.set(user.email, hashPassword('admin123'));
        } else {
          this.userPasswords.set(user.email, hashPassword('password123'));
        }
      }

      this.saveToStorage();
      this.refreshSpaceStatuses();
    }
  }

  private generateInitialActivities() {
    const reservationsToLog = this.reservations.slice(0, 8);
    for (const res of reservationsToLog) {
      const space = this.getSpace(res.spaceId);
      if (!space) continue;
      const user = this.getUser(res.userId);
      const userName = user ? `${user.firstName} ${user.lastName}` : 'Utilisateur non reconnu';
      let message = '';
      let type: ActivityLog['type'] = 'reservation';
      let timestamp = res.createdAt;
      
      if (res.status === 'active') {
        message = `${userName} a réservé la place ${space.number} (${res.vehiclePlate})`;
      } else if (res.status === 'cancelled') {
        message = `${userName} a annulé sa réservation (id: ${res.id})`;
      } else if (res.status === 'completed') {
        message = `La réservation ${res.id} pour la place ${space.number} est terminée`;
        type = 'system';
      } else {
        continue;
      }
      
      this.activities.push({
        id: `act-init-${Date.now()}-${Math.random()}`,
        type,
        message,
        timestamp,
        userId: res.userId,
      });
    }

    const maintenanceSpaces = this.spaces.filter(s => s.status === 'maintenance');
    for (const space of maintenanceSpaces) {
      const randomDate = new Date();
      randomDate.setDate(randomDate.getDate() - Math.floor(Math.random() * 30));
      this.activities.push({
        id: `act-init-${Date.now()}-${Math.random()}`,
        type: 'parking',
        message: `La place ${space.number} est maintenant en maintenance`,
        timestamp: randomDate,
        userId: undefined,
      });
    }

    const usersToLog = this.users.filter(u => u.role === 'user').slice(0, 5);
    for (const user of usersToLog) {
      this.activities.push({
        id: `act-init-${Date.now()}-${Math.random()}`,
        type: 'user',
        message: `Nouvel utilisateur enregistré : ${user.firstName} ${user.lastName}`,
        timestamp: user.createdAt,
        userId: user.id,
      });
    }

    const someUsers = this.users.filter(u => u.role === 'user').slice(0, 3);
    for (const user of someUsers) {
      const randomDate = new Date(user.createdAt);
      randomDate.setDate(randomDate.getDate() + Math.floor(Math.random() * 10));
      this.activities.push({
        id: `act-init-${Date.now()}-${Math.random()}`,
        type: 'user',
        message: `${user.firstName} ${user.lastName} a mis à jour son profil`,
        timestamp: randomDate,
        userId: user.id,
      });
    }

    this.activities.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    if (this.activities.length > 50) this.activities = this.activities.slice(0, 50);
  }

  private addActivity(type: ActivityLog['type'], message: string, userId?: string) {
    this.activities.unshift({
      id: `act-${Date.now()}-${Math.random()}`,
      type,
      message,
      timestamp: new Date(),
      userId,
    });
    if (this.activities.length > 50) this.activities.pop();
    this.saveToStorage();
  }

  private saveToStorage() {
    if (typeof window === 'undefined') return;
    const data: StoreData = {
      users: this.users,
      spaces: this.spaces,
      reservations: this.reservations,
      activities: this.activities,
      userPasswords: Array.from(this.userPasswords.entries()),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data, (key, value) => {
      if (value instanceof Date) return { __type: 'Date', value: value.toISOString() };
      return value;
    }));
  }

  private loadFromStorage(): StoreData | null {
    if (typeof window === 'undefined') return null;
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    try {
      const data = JSON.parse(raw, (key, value) => {
        if (value && typeof value === 'object' && value.__type === 'Date') {
          return new Date(value.value);
        }
        return value;
      });
      return data;
    } catch (e) {
      console.error('Failed to load store data', e);
      return null;
    }
  }

  private saveCurrentUserToStorage() {
    if (typeof window === 'undefined') return;
    if (this.currentUser) {
      localStorage.setItem(SESSION_KEY, this.currentUser.id);
    } else {
      localStorage.removeItem(SESSION_KEY);
    }
  }

  private loadCurrentUserFromStorage(): User | null {
    if (typeof window === 'undefined') return null;
    const userId = localStorage.getItem(SESSION_KEY);
    if (!userId) return null;
    return this.users.find(u => u.id === userId) || null;
  }

  resetStore(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(SESSION_KEY);
    }
    this.users = generateRealisticUsers();
    this.spaces = generateParkingSpaces(LOCATIONS);
    this.reservations = generateRealisticReservations(this.users, this.spaces);
    this.activities = [];
    this.userPasswords = new Map();

    syncSpacesWithReservations(this.spaces, this.reservations, new Date());
    this.generateInitialActivities();

    for (const user of this.users) {
      if (user.email === 'admin@example.com') {
        this.userPasswords.set(user.email, hashPassword('admin123'));
      } else {
        this.userPasswords.set(user.email, hashPassword('password123'));
      }
    }

    this.currentUser = null;
    this.saveToStorage();
    this.saveCurrentUserToStorage();
  }

  getActivities(): ActivityLog[] {
    return this.activities;
  }

  login(email: string, password: string): { success: boolean; user?: User; error?: string } {
    const user = this.users.find(u => u.email === email);
    if (!user) return { success: false, error: 'Aucun utilisateur correspond à cet email' };
    const storedHash = this.userPasswords.get(email);
    if (!storedHash || !verifyPassword(password, storedHash)) {
      return { success: false, error: 'Le mot de passe fourni est incorrect' };
    }
    this.currentUser = user;
    this.saveCurrentUserToStorage();
    this.addActivity('system', `${user.firstName} ${user.lastName} s'est connecté`, user.id);
    return { success: true, user };
  }

  register(email: string, password: string, firstName: string, lastName: string, phone: string, vehiclePlates: string[] = []) {
    if (this.users.find(u => u.email === email)) {
      return { success: false, error: 'Un compte avec cette adresse email existe déjà.' };
    }
    const newUser: User = {
      id: `user-${Date.now()}`,
      email,
      firstName,
      lastName,
      phone,
      role: 'user',
      vehiclePlates: vehiclePlates.filter(p => p.trim() !== ''),
      createdAt: new Date(),
    };
    this.users.push(newUser);
    this.userPasswords.set(email, hashPassword(password));
    this.currentUser = newUser;
    this.saveCurrentUserToStorage();
    this.addActivity('user', `Nouvel utilisateur enregistré : ${firstName} ${lastName}`, newUser.id);
    this.saveToStorage();
    return { success: true, user: newUser };
  }

  logout() {
    if (this.currentUser) {
      this.addActivity('system', `${this.currentUser.firstName} ${this.currentUser.lastName} s'est déconnecté`, this.currentUser.id);
    }
    this.currentUser = null;
    this.saveCurrentUserToStorage();
  }

  getCurrentUser() { return this.currentUser; }
  getUser(id: string) { return this.users.find(u => u.id === id); }
  getAllUsers() { return this.users; }
  getLocations() { return LOCATIONS; }

  updateUser(id: string, updates: Partial<User>): boolean {
    const user = this.users.find(u => u.id === id);
    if (!user) return false;
    if (updates.vehiclePlates) {
      updates.vehiclePlates = updates.vehiclePlates.filter(p => p.trim() !== '');
    }
    Object.assign(user, updates);
    if (this.currentUser?.id === id) this.currentUser = user;
    this.addActivity('user', `${user.firstName} ${user.lastName} a mis à jour son profil`, id);
    this.saveToStorage();
    return true;
  }

  addVehiclePlate(userId: string, plate: string): boolean {
    const user = this.users.find(u => u.id === userId);
    if (!user) return false;
    if (!user.vehiclePlates.includes(plate) && plate.trim() !== '') {
      user.vehiclePlates.push(plate.trim());
      if (this.currentUser?.id === userId) this.currentUser = user;
      this.addActivity('user', `${user.firstName} ${user.lastName} a ajouté une nouvelle plaque à son compte: ${plate}`, userId);
      this.saveToStorage();
      return true;
    }
    return false;
  }

  getSpaces(locationId?: string) {
    if (locationId) return this.spaces.filter(s => s.locationId === locationId);
    return this.spaces;
  }
  getSpace(id: string) { return this.spaces.find(s => s.id === id); }

  updateSpace(id: string, updates: Partial<ParkingSpace>): boolean {
    const space = this.spaces.find(s => s.id === id);
    if (!space) return false;
    Object.assign(space, updates);
    const user = this.currentUser;
    const userName = user ? `${user.firstName} ${user.lastName}` : 'Système';
    this.addActivity('parking', `${userName} a mis la place ${space.number} en ${space.status}`, user?.id);
    this.saveToStorage();
    return true;
  }

  getParkingStats(locationId?: string): ParkingStats {
    const spaces = locationId ? this.spaces.filter(s => s.locationId === locationId) : this.spaces;
    const available = spaces.filter(s => s.status === 'available').length;
    const occupied = spaces.filter(s => s.status === 'occupied').length;
    const maintenance = spaces.filter(s => s.status === 'maintenance').length;
    return { availableSpaces: available, occupiedSpaces: occupied, maintenanceSpaces: maintenance, totalSpaces: spaces.length };
  }

  getReservations(spaceId?: string) {
    if (spaceId) return this.reservations.filter(r => r.spaceId === spaceId);
    return this.reservations;
  }
  getUserReservations(userId: string) { return this.reservations.filter(r => r.userId === userId); }
  getReservation(id: string) { return this.reservations.find(r => r.id === id); }

  createReservation(userId: string, spaceId: string, startDate: Date, endDate: Date, vehiclePlate: string) {
    const space = this.getSpace(spaceId);
    if (!space) return { success: false, error: 'La place mentionnée n\'existe pas' };
    const now = new Date();
    const activeReservation = this.reservations.find(r =>
      r.spaceId === spaceId &&
      r.status === 'active' &&
      ((r.startDate <= endDate && r.endDate >= startDate))
    );
    if (activeReservation) return { success: false, error: 'Cette place est déjà réservée sur cette période' };
    const hours = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60);
    if (hours <= 0) return { success: false, error: 'La durée de la réservation doit être positive' };
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
      vehiclePlate,
    };
    this.reservations.push(reservation);

    const user = this.getUser(userId);
    const userName = user ? `${user.firstName} ${user.lastName}` : 'Utilisateur non reconnu';
    this.addActivity('reservation', `${userName} a réservé la place ${space.number} (Véhicule: ${vehiclePlate})`, userId);

    this.saveToStorage();
    this.refreshSpaceStatuses();
    return { success: true, reservation };
  }

  cancelReservation(id: string): boolean {
    const reservation = this.reservations.find(r => r.id === id);
    if (!reservation || reservation.status !== 'active') return false;
    reservation.status = 'cancelled';

    const user = this.getUser(reservation.userId);
    const userName = user ? `${user.firstName} ${user.lastName}` : 'Utilisateur non reconnu';
    this.addActivity('reservation', `${userName} a annulé sa réservation (id: ${reservation.id})`, reservation.userId);

    this.saveToStorage();
    this.refreshSpaceStatuses();
    return true;
  }

  updateReservation(reservationId: string, newStartDate: Date, newEndDate: Date, newVehiclePlate?: string): { success: boolean; error?: string } {
    const oldRes = this.getReservation(reservationId);
    if (!oldRes) return { success: false, error: 'La réservation mentionnée est introuvable' };
    if (oldRes.status !== 'active') return { success: false, error: 'Cette réservation n\'est plus active' };

    const user = this.getUser(oldRes.userId);
    const userName = user ? `${user.firstName} ${user.lastName}` : 'Utilisateur non reconnu';

    const space = this.getSpace(oldRes.spaceId);
    if (!space) return { success: false, error: 'La place associée à cette réservation est introuvable' };

    const now = new Date();
    const hours = (newEndDate.getTime() - newStartDate.getTime()) / (1000 * 60 * 60);
    if (hours <= 0) return { success: false, error: 'La durée donnée doit être positive' };

    const overlapping = this.reservations.find(r =>
      r.spaceId === oldRes.spaceId &&
      r.status === 'active' &&
      r.id !== reservationId &&
      ((r.startDate <= newEndDate && r.endDate >= newStartDate))
    );
    if (overlapping) return { success: false, error: 'La place est déjà réservée sur la période' };

    const plate = newVehiclePlate || oldRes.vehiclePlate;
    const amount = Math.round(hours * space.pricePerHour * 100) / 100;

    oldRes.status = 'cancelled';

    const newRes: Reservation = {
      id: `res-${Date.now()}`,
      userId: oldRes.userId,
      spaceId: oldRes.spaceId,
      startDate: newStartDate,
      endDate: newEndDate,
      status: 'active',
      createdAt: new Date(),
      amount,
      vehiclePlate: plate,
    };
    this.reservations.push(newRes);

    this.addActivity('reservation', `${userName} a modifié sa réservation (id: ${reservationId})`, oldRes.userId);

    this.saveToStorage();
    this.refreshSpaceStatuses();
    return { success: true };
  }

  getDashboardStats(): DashboardStats {
    const now = new Date();
    const oneMonthAgo = new Date();
    oneMonthAgo.setMonth(now.getMonth() - 1);

    const activeReservations = this.reservations.filter(r => r.status === 'active').length;
    const totalRevenue = this.reservations
      .filter(r => r.status === 'active' || r.status === 'completed')
      .reduce((sum, r) => sum + r.amount, 0);

    const totalUsers = this.users.filter(u => u.role === 'user').length;
    const newUsersThisMonth = this.users.filter(u => u.createdAt >= oneMonthAgo && u.role === 'user').length;

    const twoMonthsAgo = new Date();
    twoMonthsAgo.setMonth(now.getMonth() - 2);
    const revenueLastMonth = this.reservations
      .filter(r => (r.status === 'active' || r.status === 'completed') && r.createdAt >= oneMonthAgo && r.createdAt < now)
      .reduce((sum, r) => sum + r.amount, 0);
    const revenuePrevMonth = this.reservations
      .filter(r => (r.status === 'active' || r.status === 'completed') && r.createdAt >= twoMonthsAgo && r.createdAt < oneMonthAgo)
      .reduce((sum, r) => sum + r.amount, 0);
    const revenueChange = revenuePrevMonth === 0 ? 0 : ((revenueLastMonth - revenuePrevMonth) / revenuePrevMonth) * 100;

    const occupancyRate = (this.spaces.filter(s => s.status !== 'available').length / this.spaces.length) * 100;

    return { activeReservations, occupancyRate, totalRevenue, totalUsers, newUsersThisMonth, revenueChange };
  }

  getRevenueBySpaceType() {
    const typeMap: Record<string, number> = { compact: 0, standard: 0, premium: 0 };
    for (const res of this.reservations.filter(r => r.status !== 'cancelled')) {
      const space = this.getSpace(res.spaceId);
      if (space) typeMap[space.type] += res.amount;
    }
    return typeMap;
  }

  getOccupancyByDayOfWeek() {
    const days = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];
    const occupancy: Record<string, number> = {};
    for (const day of days) occupancy[day] = 0;
    let total = 0;
    for (const res of this.reservations.filter(r => r.status === 'active')) {
      const dayIndex = res.startDate.getDay();
      const dayName = days[(dayIndex + 6) % 7];
      occupancy[dayName] += 1;
      total++;
    }
    if (total === 0) return days.map(() => 50);
    return days.map(d => Math.round((occupancy[d] / total) * 100));
  }

  getPeakHours() {
    const hours = Array(24).fill(0);
    for (const res of this.reservations.filter(r => r.status !== 'cancelled')) {
      const hour = res.startDate.getHours();
      hours[hour]++;
    }
    return hours.map((count, idx) => ({ time: `${idx}:00`, count }));
  }

  refreshSpaceStatuses(): void {
    const now = new Date();
    for (const space of this.spaces) {
      if (space.status === 'maintenance') continue;
      const activeRes = this.reservations.find(r => r.spaceId === space.id && r.status === 'active');
      if (activeRes) {
        if (activeRes.startDate <= now && activeRes.endDate >= now) {
          space.status = 'occupied';
        } else {
          space.status = 'available';
        }
      } else {
        space.status = 'available';
      }
    }
    this.saveToStorage();
  }
}

let storeInstance: StoreManager | null = null;

export function getStore(): StoreManager {
  if (!storeInstance) storeInstance = new StoreManager();
  return storeInstance;
}