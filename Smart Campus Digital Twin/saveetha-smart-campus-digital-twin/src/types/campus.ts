export type PageId =
  | 'landing'
  | 'explorer'
  | 'dashboard'
  | 'buildings'
  | 'resources'
  | 'bookings'
  | 'facilities'
  | 'energy'
  | 'parking'
  | 'maintenance'
  | 'reports'
  | 'admin'
  | 'profile';

export type UserRole = 'Student' | 'Faculty' | 'Maintenance Staff' | 'Admin';

export type DepartmentCode = 'CSE' | 'ECE' | 'EEE' | 'SAIL' | 'Admin';

export type BuildingId =
  | 'main-engineering'
  | 'health-sciences'
  | 'academic-block'
  | 'laboratory-block'
  | 'admin-block';

export type MaintenanceStatusType =
  | 'Operational'
  | 'Scheduled Inspection'
  | 'Attention Required';

export interface CampusBuilding {
  id: BuildingId;
  name: string;
  shortName: string;
  department: DepartmentCode;
  category: string;
  floors: number;
  floorsEstimated: boolean;
  totalRooms: number;
  availableRooms: number;
  classrooms: number;
  availableClassrooms: number;
  laboratories: number;
  activeLaboratories: number;
  facultyRooms: number;
  availableFacultyRooms: number;
  totalCapacity: number;
  occupancyPercent: number;
  maintenanceStatus: MaintenanceStatusType;
  energyConsumptionKwh: number;
  solarOffsetKwh: number;
  efficiencyRating: 'A+' | 'A' | 'B+';
  waterUsageLiters: number;
  facilities: string[];
  availableResources: string[];
  architecturalNotes: string;
  footprintPosition: [number, number, number];
  selectionRadius: number;
  cameraPosition: [number, number, number];
  cameraTarget: [number, number, number];
  accentColor: string;
}

export type ResourceType =
  | 'Classroom'
  | 'Laboratory'
  | 'Projector'
  | 'Computer'
  | 'Seminar Hall';

export type ResourceBookingStatus =
  | 'Available'
  | 'In Use'
  | 'Reserved'
  | 'Maintenance';

export interface CampusResource {
  id: string;
  name: string;
  type: ResourceType;
  buildingId: BuildingId;
  buildingName: string;
  department: DepartmentCode;
  floor: string;
  capacity: number;
  status: ResourceBookingStatus;
  allocatedTo: string;
  equipmentSummary: string;
  lastUpdated: string;
}

export interface LabBooking {
  id: string;
  resourceId: string;
  resourceName: string;
  buildingId: BuildingId;
  buildingName: string;
  department: DepartmentCode;
  userId: string;
  userName: string;
  userRole: UserRole;
  date: string;
  timeSlot: string;
  seatsBooked: number;
  purpose: string;
  status: 'Confirmed' | 'Cancelled';
  createdAt: string;
}

export type FacilityCategory =
  | 'Electrical'
  | 'Plumbing'
  | 'AC'
  | 'Furniture'
  | 'IT/Network'
  | 'Cleanliness'
  | 'Other';

export type WorkOrderStatus = 'Pending' | 'In Progress' | 'Completed';

export type WorkOrderPriority = 'Low' | 'Medium' | 'High' | 'Critical';

export interface MaintenanceRequest {
  id: string;
  title: string;
  buildingId: BuildingId;
  buildingName: string;
  department: DepartmentCode;
  category: FacilityCategory;
  priority: WorkOrderPriority;
  status: WorkOrderStatus;
  assignedStaff: string;
  reportedBy: string;
  reportedByUserId?: string;
  locationDetail: string;
  createdAt: string;
  estimatedHours: number;
}

export type ParkingZone =
  | 'Zone A · Faculty'
  | 'Zone B · Student'
  | 'Zone C · Visitor & EV';

export interface ParkingSlot {
  id: string;
  code: string;
  zone: ParkingZone;
  occupied: boolean;
  vehicleType: 'Sedan' | 'SUV' | 'EV' | 'Compact' | null;
  vehiclePlate: string | null;
  entryTime: string | null;
  evCharger: boolean;
  position3D: [number, number, number];
  rotationY: number;
}

export type TimeframeFilter = 'daily' | 'weekly' | 'monthly';

export interface EnergySeriesPoint {
  label: string;
  consumptionKwh: number;
  solarKwh: number;
  occupancyPct: number;
  costInr: number;
}

export interface CampusUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: DepartmentCode;
  designationOrRoll: string;
  phone: string;
  status: 'Active' | 'Inactive';
  lastActive: string;
  password?: string;
}

export interface CampusNotification {
  id: string;
  title: string;
  message: string;
  type: 'booking' | 'maintenance' | 'system';
  targetRoles: UserRole[];
  department: DepartmentCode | 'All';
  userId?: string;
  read: boolean;
  createdAt: string;
}

export interface CampusState {
  conceptualNotice: string;
  buildings: CampusBuilding[];
  resources: CampusResource[];
  bookings: LabBooking[];
  maintenance: MaintenanceRequest[];
  parking: ParkingSlot[];
  users: CampusUser[];
  notifications: CampusNotification[];
  energySeries: Record<TimeframeFilter, EnergySeriesPoint[]>;
  tariffInrPerKwh: number;
  lastSyncedAt: string;
}
