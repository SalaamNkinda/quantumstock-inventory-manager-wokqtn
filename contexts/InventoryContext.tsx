
import React, { createContext, useContext, useState, useEffect } from 'react';
import { InventoryContextType, Product, StockMovement, DashboardStats } from '../types/inventory';
import { useAuth } from './AuthContext';

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

// Mock data for demo purposes
const mockProducts: Product[] = [
  {
    id: '1',
    sku: 'SKU001',
    name: 'Wireless Headphones',
    quantityInStock: 25,
    unitOfMeasure: 'units',
    lowStockThreshold: 10,
    location: 'A1-B2',
    category: 'Electronics',
    unitPrice: 99.99,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-15'),
  },
  {
    id: '2',
    sku: 'SKU002',
    name: 'Office Chair',
    quantityInStock: 5,
    unitOfMeasure: 'units',
    lowStockThreshold: 8,
    location: 'B3-C1',
    category: 'Furniture',
    unitPrice: 249.99,
    createdAt: new Date('2024-01-02'),
    updatedAt: new Date('2024-01-16'),
  },
  {
    id: '3',
    sku: 'SKU003',
    name: 'Laptop Stand',
    quantityInStock: 15,
    unitOfMeasure: 'units',
    lowStockThreshold: 5,
    location: 'A2-D1',
    category: 'Accessories',
    unitPrice: 49.99,
    createdAt: new Date('2024-01-03'),
    updatedAt: new Date('2024-01-17'),
  },
  {
    id: '4',
    sku: 'SKU004',
    name: 'Printer Paper',
    quantityInStock: 3,
    unitOfMeasure: 'boxes',
    lowStockThreshold: 10,
    location: 'C1-A3',
    category: 'Office Supplies',
    unitPrice: 12.99,
    createdAt: new Date('2024-01-04'),
    updatedAt: new Date('2024-01-18'),
  },
];

const mockMovements: StockMovement[] = [
  {
    id: '1',
    productId: '1',
    type: 'inbound',
    quantity: 50,
    previousQuantity: 0,
    newQuantity: 50,
    reason: 'Initial stock',
    supplier: 'TechSupplier Inc',
    warehouseClerkId: '3',
    warehouseClerkName: 'Mike Clerk',
    timestamp: new Date('2024-01-01'),
  },
  {
    id: '2',
    productId: '1',
    type: 'outbound',
    quantity: 25,
    previousQuantity: 50,
    newQuantity: 25,
    reason: 'Customer order',
    destination: 'Order #1001',
    warehouseClerkId: '3',
    warehouseClerkName: 'Mike Clerk',
    timestamp: new Date('2024-01-15'),
  },
];

export function InventoryProvider({ children }: { children: React.ReactNode }) {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [movements, setMovements] = useState<StockMovement[]>(mockMovements);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats>({
    totalProducts: 0,
    lowStockItems: 0,
    totalValue: 0,
    recentMovements: 0,
  });
  const { user } = useAuth();

  const calculateStats = () => {
    const totalProducts = products.length;
    const lowStockItems = products.filter(p => p.quantityInStock <= p.lowStockThreshold).length;
    const totalValue = products.reduce((sum, p) => sum + (p.quantityInStock * (p.unitPrice || 0)), 0);
    const recentMovements = movements.filter(m => {
      const dayAgo = new Date();
      dayAgo.setDate(dayAgo.getDate() - 1);
      return m.timestamp >= dayAgo;
    }).length;

    setDashboardStats({
      totalProducts,
      lowStockItems,
      totalValue,
      recentMovements,
    });
  };

  useEffect(() => {
    calculateStats();
  }, [products, movements]);

  const addProduct = (productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>) => {
    console.log('Adding new product:', productData.name);
    const newProduct: Product = {
      ...productData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setProducts(prev => [...prev, newProduct]);
  };

  const updateProduct = (id: string, updates: Partial<Product>) => {
    console.log('Updating product:', id, updates);
    setProducts(prev => prev.map(p => 
      p.id === id ? { ...p, ...updates, updatedAt: new Date() } : p
    ));
  };

  const deleteProduct = (id: string) => {
    console.log('Deleting product:', id);
    setProducts(prev => prev.filter(p => p.id !== id));
    setMovements(prev => prev.filter(m => m.productId !== id));
  };

  const addMovement = (movementData: Omit<StockMovement, 'id' | 'timestamp'>) => {
    console.log('Adding stock movement:', movementData);
    const newMovement: StockMovement = {
      ...movementData,
      id: Date.now().toString(),
      timestamp: new Date(),
    };
    
    setMovements(prev => [...prev, newMovement]);
    
    // Update product quantity
    setProducts(prev => prev.map(p => 
      p.id === movementData.productId 
        ? { ...p, quantityInStock: movementData.newQuantity, updatedAt: new Date() }
        : p
    ));
  };

  const getLowStockProducts = () => {
    return products.filter(p => p.quantityInStock <= p.lowStockThreshold);
  };

  const getTopMovers = () => {
    const movementCounts = movements.reduce((acc, movement) => {
      acc[movement.productId] = (acc[movement.productId] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return products
      .map(product => ({
        product,
        movementCount: movementCounts[product.id] || 0,
      }))
      .sort((a, b) => b.movementCount - a.movementCount)
      .slice(0, 5);
  };

  const refreshData = () => {
    console.log('Refreshing inventory data');
    calculateStats();
  };

  return (
    <InventoryContext.Provider value={{
      products,
      movements,
      dashboardStats,
      addProduct,
      updateProduct,
      deleteProduct,
      addMovement,
      getLowStockProducts,
      getTopMovers,
      refreshData,
    }}>
      {children}
    </InventoryContext.Provider>
  );
}

export function useInventory() {
  const context = useContext(InventoryContext);
  if (context === undefined) {
    throw new Error('useInventory must be used within an InventoryProvider');
  }
  return context;
}
