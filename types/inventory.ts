
export interface User {
  id: string;
  email: string;
  name: string;
  role: 'Administrator' | 'Manager' | 'Warehouse Clerk';
  createdAt: Date;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  quantityInStock: number;
  unitOfMeasure: string;
  lowStockThreshold: number;
  location: string;
  subLocations?: string[];
  category?: string;
  description?: string;
  unitPrice?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface StockMovement {
  id: string;
  productId: string;
  type: 'inbound' | 'outbound';
  quantity: number;
  previousQuantity: number;
  newQuantity: number;
  reason: string;
  supplier?: string;
  destination?: string;
  warehouseClerkId: string;
  warehouseClerkName: string;
  timestamp: Date;
  notes?: string;
}

export interface DashboardStats {
  totalProducts: number;
  lowStockItems: number;
  totalValue: number;
  recentMovements: number;
}

export interface ChartData {
  labels: string[];
  datasets: {
    data: number[];
    color?: (opacity: number) => string;
  }[];
}

export type UserRole = 'Administrator' | 'Manager' | 'Warehouse Clerk';

export interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

export interface InventoryContextType {
  products: Product[];
  movements: StockMovement[];
  dashboardStats: DashboardStats;
  addProduct: (product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  addMovement: (movement: Omit<StockMovement, 'id' | 'timestamp'>) => void;
  getLowStockProducts: () => Product[];
  getTopMovers: () => { product: Product; movementCount: number }[];
  refreshData: () => void;
}
