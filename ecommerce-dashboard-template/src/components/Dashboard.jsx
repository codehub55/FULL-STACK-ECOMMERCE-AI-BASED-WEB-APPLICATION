import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchDashboardStats,
  fetchAllUsers,
  fetchAllProducts,
  fetchAllOrders,
} from "../store/slices/adminSlice";
import MiniSummary from "./dashboard-components/MiniSummary";
import TopSellingProducts from "./dashboard-components/TopSellingProducts";
import Stats from "./dashboard-components/Stats";
import MonthlySalesChart from "./dashboard-components/MonthlySalesChart";
import OrdersChart from "./dashboard-components/OrdersChart";
import TopProductsChart from "./dashboard-components/TopProductsChart";
import UsersTable from "./dashboard-components/UsersTable";
import ProductManagement from "./dashboard-components/ProductManagement";
import OrdersTable from "./dashboard-components/OrdersTable";
import Profile from "./Profile";

const Dashboard = () => {
  const dispatch = useDispatch();
  const { openedComponent } = useSelector((state) => state.extra || {});
  const {
    orderStatusCounts,
    loading,
    error,
    totalRevenueAllTime,
    currentMonthSales,
    totalUsersCount,
    lowStockProducts,
  } = useSelector((state) => state.admin || {});

  const hasOrderStatusData =
    orderStatusCounts && Object.keys(orderStatusCounts).length > 0;

  useEffect(() => {
    dispatch(fetchDashboardStats());
  }, [dispatch]);

  useEffect(() => {
    if (openedComponent === "Users") {
      dispatch(fetchAllUsers());
    } else if (openedComponent === "Products") {
      dispatch(fetchAllProducts());
    } else if (openedComponent === "Orders") {
      dispatch(fetchAllOrders());
    }
  }, [openedComponent, dispatch]);

  const renderContent = () => {
    if (openedComponent === "Users") {
      return <UsersTable />;
    }
    if (openedComponent === "Products") {
      return <ProductManagement />;
    }
    if (openedComponent === "Orders") {
      return <OrdersTable />;
    }
    if (openedComponent === "Profile") {
      return <Profile />;
    }

    // default dashboard overview
    return (
      <>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
          <div className="glass rounded-xl p-4">
            <h3 className="text-sm text-muted-foreground">Revenue</h3>
            <p className="text-2xl font-bold text-card-foreground">${totalRevenueAllTime.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">All-time revenue</p>
          </div>
          <div className="glass rounded-xl p-4">
            <h3 className="text-sm text-muted-foreground">Current Month</h3>
            <p className="text-2xl font-bold text-card-foreground">${currentMonthSales.toLocaleString()}</p>
            <p className="text-xs text-muted-foreground">Paid orders this month</p>
          </div>
          <div className="glass rounded-xl p-4">
            <h3 className="text-sm text-muted-foreground">Users</h3>
            <p className="text-2xl font-bold text-card-foreground">{totalUsersCount}</p>
            <p className="text-xs text-muted-foreground">Registered users</p>
          </div>
          <div className="glass rounded-xl p-4">
            <h3 className="text-sm text-muted-foreground">Low Stock</h3>
            <p className="text-2xl font-bold text-card-foreground">{lowStockProducts}</p>
            <p className="text-xs text-muted-foreground">Products low in stock</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-card rounded-xl shadow p-4 mb-6">
              <h2 className="font-semibold text-card-foreground mb-2">Order Status</h2>
              <p className="text-sm text-muted-foreground">
                {hasOrderStatusData
                  ? "Order status breakdown is available below."
                  : "No order status data loaded yet. Ensure you have orders."
                }
              </p>
            </div>
            <OrdersChart />
          </div>

          <div className="space-y-6">
            <MiniSummary />
            <Stats />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
          <div className="lg:col-span-2">
            <MonthlySalesChart />
          </div>
          <div className="space-y-6">
            <TopProductsChart />
            <TopSellingProducts />
          </div>
        </div>
      </>
    );
  };

  return (
    <main className="flex-1 min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-foreground mb-1">Admin Dashboard</h1>
        <p className="text-muted-foreground mb-6">Your analytics and orders overview.</p>

        {loading && (
          <div className="mb-4 text-sm text-blue-700">Loading dashboard data...</div>
        )}

        {error && (
          <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-3 py-2 rounded-lg text-sm font-semibold">
            {error}
          </div>
        )}

        {renderContent()}
      </div>
    </main>
  );
};

export default Dashboard;
