import { User, ParkingSpace, Reservation, ActivityLog, DashboardStats, ParkingStats } from '@/lib/types';

const hashPassword = (password: string): string => {
  return Buffer.from(password).toString('base64');
};

const verifyPassword = (password: string, hash: string): boolean => {
  return hashPassword(password) === hash;
};

function generateRealisticUsers(): User[] {
  const firstNames = ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve', 'Frank', 'Grace', 'Henry', 'Ivy', 'Jack'];
  const lastNames = ['Martin', 'Bernard', 'Dubois', 'Thomas', 'Robert', 'Richard', 'Petit', 'Durand', 'Leroy', 'Moreau'];
  const users: User[] = [];

  users.push({
    id: 'admin-demo',
    email: 'admin@example.com',
    firstName: 'Admin',
    lastName: 'System',
    role: 'admin',
    phone: '+33698765432',
    vehiclePlate: 'ADMIN01',
    createdAt: new Date('2024-01-01'),
  });

  users.push({
    id: 'user-demo',
    email: 'user@example.com',
    firstName: 'Jean',
    lastName: 'Dupont',
    role: 'user',
    phone: '+33612345678',
    vehiclePlate: 'AB123CD',
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
      vehiclePlate: `${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${Math.floor(100 + Math.random() * 900)}${String.fromCharCode(65 + Math.floor(Math.random() * 26))}`,
      createdAt,
    });
  }
  return users;
}

function generateParkingSpaces(): ParkingSpace[] {
  const spaces: ParkingSpace[] = [];
  const types: Array<'compact' | 'standard' | 'premium'> = ['compact', 'standard', 'premium'];
  const features = ['handicap', 'chargée', 'abritée', 'sécurisée'];

  for (let level = 1; level <= 5; level++) {
    const spacesPerLevel = 15;
    for (let i = 1; i <= spacesPerLevel; i++) {
      const spaceType = types[Math.floor(Math.random() * types.length)];
      spaces.push({
        id: `space-${level}-${i}`,
        level,
        number: `${level}${String(i).padStart(2, '0')}`,
        status: 'available',
        type: spaceType,
        features: features.filter(() => Math.random() > 0.6),
        pricePerHour: spaceType === 'premium' ? 5 : spaceType === 'standard' ? 3 : 2,
      });
    }
  }
  return spaces;
}

function generateRealisticReservations(users: User[], spaces: ParkingSpace[]): Reservation[] {
  const reservations: Reservation[] = [];
  const now = new Date();

  for (const user of users.filter(u => u.role === 'user')) {
    const numRes = Math.floor(Math.random() * 4) + 1;
    for (let i = 0; i < numRes; i++) {
      const startDate = new Date();
      startDate.setDate(now.getDate() + Math.floor(Math.random() * 60) - 30);
      const durationHours = Math.floor(Math.random() * 48) + 2;
      const endDate = new Date(startDate.getTime() + durationHours * 60 * 60 * 1000);

      let status: 'active' | 'completed' | 'cancelled';
      if (endDate < now) status = 'completed';
      else if (startDate > now) status = 'active';
      else status = 'active';

      const space = spaces[Math.floor(Math.random() * spaces.length)];
      const hours = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60);
      const amount = Math.round(hours * space.pricePerHour * 100) / 100;

      reservations.push({
        id: `res-${user.id}-${i}`,
        userId: user.id,
        spaceId: space.id,
        startDate,
        endDate,
        status,
        createdAt: new Date(startDate.getTime() - 24 * 60 * 60 * 1000),
        amount,
      });
    }
  }
  return reservations;
}

function syncSpacesWithReservations(spaces: ParkingSpace[], reservations: Reservation[]): void {
  for (const space of spaces) {
    if (space.status !== 'maintenance') space.status = 'available';
    delete space.reservedBy;
  }
  for (const res of reservations.filter(r => r.status === 'active')) {
    const space = spaces.find(s => s.id === res.spaceId);
    if (space && space.status !== 'maintenance') {
      space.status = 'reserved';
      space.reservedBy = res.userId;
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

class StoreManager {
  private users: User[];
  private spaces: ParkingSpace[];
  private reservations: Reservation[];
  private activities: ActivityLog[];
  private currentUser: User | null = null;
  private userPasswords: Map<string, string>;

  constructor() {
    this.users = generateRealisticUsers();
    this.spaces = generateParkingSpaces();
    this.reservations = generateRealisticReservations(this.users, this.spaces);
    this.activities = [];
    this.userPasswords = new Map();

    syncSpacesWithReservations(this.spaces, this.reservations);

    for (const user of this.users) {
      if (user.email === 'admin@example.com') {
        this.userPasswords.set(user.email, hashPassword('admin123'));
      } else {
        this.userPasswords.set(user.email, hashPassword('password123'));
      }
    }

    this.addActivity('system', 'Application démarrée');
    this.addActivity('system', `${this.users.length} utilisateurs chargés`);
    this.addActivity('system', `${this.reservations.length} réservations historiques`);
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
  }

  getActivities(): ActivityLog[] {
    return this.activities;
  }

  login(email: string, password: string): { success: boolean; user?: User; error?: string } {
    const user = this.users.find(u => u.email === email);
    if (!user) return { success: false, error: 'Utilisateur introuvable' };
    const storedHash = this.userPasswords.get(email);
    if (!storedHash || !verifyPassword(password, storedHash)) {
      return { success: false, error: 'Mot de passe invalide' };
    }
    this.currentUser = user;
    this.addActivity('system', `${user.firstName} ${user.lastName} s'est connecté`, user.id);
    return { success: true, user };
  }

  register(email: string, password: string, firstName: string, lastName: string, phone: string) {
    if (this.users.find(u => u.email === email)) {
      return { success: false, error: 'Cet email est déjà utilisé' };
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
    this.userPasswords.set(email, hashPassword(password));
    this.currentUser = newUser;
    this.addActivity('user', `Nouvel utilisateur enregistré: ${firstName} ${lastName}`, newUser.id);
    return { success: true, user: newUser };
  }

  logout() {
    if (this.currentUser) {
      this.addActivity('system', `${this.currentUser.firstName} ${this.currentUser.lastName} s'est déconnecté`, this.currentUser.id);
    }
    this.currentUser = null;
  }

  getCurrentUser() { return this.currentUser; }
  getUser(id: string) { return this.users.find(u => u.id === id); }
  getAllUsers() { return this.users; }

  updateUser(id: string, updates: Partial<User>): boolean {
    const user = this.users.find(u => u.id === id);
    if (!user) return false;
    Object.assign(user, updates);
    if (this.currentUser?.id === id) this.currentUser = user;
    this.addActivity('user', `${user.firstName} ${user.lastName} a mis à jour son profil`, id);
    return true;
  }

  getSpaces() { return this.spaces; }
  getSpace(id: string) { return this.spaces.find(s => s.id === id); }

  updateSpace(id: string, updates: Partial<ParkingSpace>): boolean {
    const space = this.spaces.find(s => s.id === id);
    if (!space) return false;
    Object.assign(space, updates);
    this.addActivity('parking', `La place ${space.number} (Niveau ${space.level}) a été mise à jour -> Statut: ${space.status}`, space.reservedBy);
    return true;
  }

  getParkingStats(): ParkingStats {
    const available = this.spaces.filter(s => s.status === 'available').length;
    const occupied = this.spaces.filter(s => s.status === 'occupied').length;
    const reserved = this.spaces.filter(s => s.status === 'reserved').length;
    const maintenance = this.spaces.filter(s => s.status === 'maintenance').length;
    return { availableSpaces: available, occupiedSpaces: occupied, reservedSpaces: reserved, maintenanceSpaces: maintenance, totalSpaces: this.spaces.length };
  }

  getReservations() { return this.reservations; }
  getUserReservations(userId: string) { return this.reservations.filter(r => r.userId === userId); }
  getReservation(id: string) { return this.reservations.find(r => r.id === id); }

  createReservation(userId: string, spaceId: string, startDate: Date, endDate: Date) {
    const space = this.getSpace(spaceId);
    if (!space) return { success: false, error: 'La place mentionnée n\'existe pas' };
    if (space.status !== 'available') return { success: false, error: 'Cette place n\'est pas disponible' };

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
    this.addActivity('reservation', `Nouvelle réservation #${reservation.id.slice(-6)} pour la place ${space.number} (Niveau ${space.level})`, userId);
    return { success: true, reservation };
  }

  cancelReservation(id: string): boolean {
    const reservation = this.reservations.find(r => r.id === id);
    if (!reservation || reservation.status !== 'active') return false;
    reservation.status = 'cancelled';
    const space = this.getSpace(reservation.spaceId);
    if (space && space.reservedBy === reservation.userId) {
      this.updateSpace(space.id, { status: 'available', reservedBy: undefined });
    }
    this.addActivity('reservation', `La réservation #${reservation.id.slice(-6)} a été annulée`, reservation.userId);
    return true;
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
    const max = Math.max(...hours);
    return hours.map((count, idx) => ({ time: `${idx}:00`, occupancy: max === 0 ? 0 : Math.min(100, Math.round((count / max) * 100)) }));
  }
}

let storeInstance: StoreManager | null = null;

export function getStore(): StoreManager {
  if (!storeInstance) storeInstance = new StoreManager();
  return storeInstance;
}