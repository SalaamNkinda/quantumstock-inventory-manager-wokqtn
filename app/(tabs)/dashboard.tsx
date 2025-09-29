
import React, { useEffect } from 'react';
import { View, Text, ScrollView, RefreshControl, Dimensions } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { commonStyles, colors } from '../../styles/commonStyles';
import { StatsCard } from '../../components/ui/StatsCard';
import { Card } from '../../components/ui/Card';
import { MovementCard } from '../../components/inventory/MovementCard';
import { ProductCard } from '../../components/inventory/ProductCard';
import { useInventory } from '../../contexts/InventoryContext';
import { useAuth } from '../../contexts/AuthContext';
import { router } from 'expo-router';

export default function DashboardScreen() {
  const { user } = useAuth();
  const { 
    dashboardStats, 
    movements, 
    products, 
    getLowStockProducts, 
    getTopMovers, 
    refreshData 
  } = useInventory();
  const [refreshing, setRefreshing] = React.useState(false);

  const lowStockProducts = getLowStockProducts();
  const topMovers = getTopMovers();
  const recentMovements = movements.slice(0, 5);

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    refreshData();
    setTimeout(() => setRefreshing(false), 1000);
  }, [refreshData]);

  // Mock chart data for stock value trend
  const chartData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      {
        data: [15000, 18000, 16500, 19200],
        color: (opacity = 1) => `rgba(37, 99, 235, ${opacity})`,
        strokeWidth: 2,
      },
    ],
  };

  const screenWidth = Dimensions.get('window').width;

  return (
    <ScrollView 
      style={commonStyles.wrapper}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={commonStyles.container}>
        <View style={{ paddingTop: 16, marginBottom: 24 }}>
          <Text style={commonStyles.title}>
            Welcome back, {user?.name}
          </Text>
          <Text style={commonStyles.textSecondary}>
            {user?.role} • QuantumStock Dashboard
          </Text>
        </View>

        {/* Stats Cards */}
        <View style={{ flexDirection: 'row', marginBottom: 24, gap: 8 }}>
          <StatsCard
            title="Total Products"
            value={dashboardStats.totalProducts}
            icon="cube"
            color={colors.primary}
          />
          <StatsCard
            title="Low Stock"
            value={dashboardStats.lowStockItems}
            icon="warning"
            color={colors.warning}
          />
        </View>

        <View style={{ flexDirection: 'row', marginBottom: 24, gap: 8 }}>
          <StatsCard
            title="Total Value"
            value={`$${dashboardStats.totalValue.toLocaleString()}`}
            icon="dollarsign"
            color={colors.success}
          />
          <StatsCard
            title="Recent Moves"
            value={dashboardStats.recentMovements}
            icon="activity"
            color={colors.accent}
          />
        </View>

        {/* Stock Value Trend Chart */}
        <Card style={{ marginBottom: 24 }}>
          <Text style={[commonStyles.subtitle, { marginBottom: 16 }]}>
            Stock Value Trend (Last 4 Weeks)
          </Text>
          <LineChart
            data={chartData}
            width={screenWidth - 64}
            height={200}
            chartConfig={{
              backgroundColor: colors.background,
              backgroundGradientFrom: colors.background,
              backgroundGradientTo: colors.background,
              decimalPlaces: 0,
              color: (opacity = 1) => `rgba(37, 99, 235, ${opacity})`,
              labelColor: (opacity = 1) => `rgba(31, 41, 55, ${opacity})`,
              style: {
                borderRadius: 16,
              },
              propsForDots: {
                r: '4',
                strokeWidth: '2',
                stroke: colors.primary,
              },
            }}
            bezier
            style={{
              marginVertical: 8,
              borderRadius: 16,
            }}
          />
        </Card>

        {/* Critical Alerts */}
        {lowStockProducts.length > 0 && (
          <Card style={{ marginBottom: 24 }}>
            <View style={[commonStyles.row, { marginBottom: 16 }]}>
              <Text style={[commonStyles.subtitle, { marginBottom: 0 }]}>
                🚨 Critical Alerts
              </Text>
              <Text style={[commonStyles.textSecondary, { color: colors.danger }]}>
                {lowStockProducts.length} items
              </Text>
            </View>
            {lowStockProducts.slice(0, 3).map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                showActions={false}
                onPress={() => router.push(`/(tabs)/inventory?productId=${product.id}`)}
              />
            ))}
            {lowStockProducts.length > 3 && (
              <Text 
                style={[commonStyles.textSecondary, { textAlign: 'center', marginTop: 8 }]}
                onPress={() => router.push('/(tabs)/inventory')}
              >
                View {lowStockProducts.length - 3} more items →
              </Text>
            )}
          </Card>
        )}

        {/* Top Movers */}
        <Card style={{ marginBottom: 24 }}>
          <Text style={[commonStyles.subtitle, { marginBottom: 16 }]}>
            📈 Top 5 Movers
          </Text>
          {topMovers.map(({ product, movementCount }) => (
            <View key={product.id} style={[commonStyles.row, { marginBottom: 12 }]}>
              <View style={{ flex: 1 }}>
                <Text style={[commonStyles.text, { fontWeight: '600' }]}>
                  {product.name}
                </Text>
                <Text style={commonStyles.textSecondary}>
                  {product.sku} • {product.quantityInStock} {product.unitOfMeasure}
                </Text>
              </View>
              <View style={{
                backgroundColor: colors.primary + '20',
                paddingHorizontal: 8,
                paddingVertical: 4,
                borderRadius: 12,
              }}>
                <Text style={[commonStyles.textSecondary, { color: colors.primary, fontSize: 12 }]}>
                  {movementCount} moves
                </Text>
              </View>
            </View>
          ))}
        </Card>

        {/* Recent Activity */}
        <Card style={{ marginBottom: 24 }}>
          <Text style={[commonStyles.subtitle, { marginBottom: 16 }]}>
            📋 Recent Activity
          </Text>
          {recentMovements.length > 0 ? (
            recentMovements.map((movement) => {
              const product = products.find(p => p.id === movement.productId);
              return (
                <MovementCard
                  key={movement.id}
                  movement={movement}
                  productName={product?.name}
                />
              );
            })
          ) : (
            <Text style={commonStyles.textSecondary}>
              No recent movements
            </Text>
          )}
        </Card>
      </View>
    </ScrollView>
  );
}
