import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import Login from "./pages/Login";
import ForgotPassword from "./pages/ForgotPassword";
import OTPVerification from "./pages/OTPVerification";
import ResetPassword from "./pages/ResetPassword";

import Dashboard from "./pages/Dashboard";
import UserManagement from "./pages/UserManagement";
import ProductManagement from "./pages/ProductManagement";
import PriceManagement from "./pages/PriceManagement";
import DailyCashReport from "./pages/DailyCashReport";
import OrderManagement from "./pages/OrderManagement";
import LeadManagement from "./pages/LeadManagement";
import QRManagement from "./pages/QRManagement";
import RewardDashboard from "./pages/RewardDashboard";
import SchemeManagement from "./pages/SchemeManagement";
import FinanceDashboard from "./pages/FinanceDashboard";
import DashboardLayout from "./layouts/DashboardLayout";
import Reports from "./pages/Reports";
import SystemSettings from "./pages/SystemSettings";
import ManufacturingBatchManagement from "./pages/ManufacturingBatchManagement";
import InventoryManagement from "./pages/InventoryManagement";
import DispatchManagement from "./pages/DispatchOverview";
import InboundMaterialManagement from "./pages/InboundMaterialOverview";
import EmployeeHRManagement from "./pages/EmployeeHRManagement";
import CommissionManagement from "./pages/CommissionManagement";


const App = () => {
  return (
    <BrowserRouter>

      <Routes>

        {/* AUTH PAGES */}

        <Route
          path="/"
          element={<Login />}
        />

        <Route
          path="/forgot-password"
          element={<ForgotPassword />}
        />

        <Route
          path="/verify-otp"
          element={<OTPVerification />}
        />

        <Route
          path="/reset-password"
          element={<ResetPassword />}
        />


        {/* DASHBOARD */}

        <Route
          path="/dashboard"
          element={
            <DashboardLayout>
              <Dashboard />
            </DashboardLayout>
          }
        />


        {/* USER MANAGEMENT */}

        <Route
          path="/users"
          element={
            <DashboardLayout>
              <UserManagement />
            </DashboardLayout>
          }
        />


        {/* PRODUCT MANAGEMENT */}

        <Route
          path="/products"
          element={
            <DashboardLayout>
              <ProductManagement />
            </DashboardLayout>
          }
        />


        {/* PRICE MANAGEMENT */}

        <Route
          path="/prices"
          element={
            <DashboardLayout>
              <PriceManagement />
            </DashboardLayout>
          }
        />

        <Route
          path="/daily-cash-report"
          element={
            <DashboardLayout>
              <DailyCashReport />
            </DashboardLayout>
          }
        />

        <Route
          path="/order-management"
          element={
            <DashboardLayout>
              <OrderManagement />
            </DashboardLayout>
          }
        />

        {/* LEAD MANAGEMENT */}

        <Route
          path="/leads"
          element={
            <DashboardLayout>
              <LeadManagement />
            </DashboardLayout>
          }
        />

        <Route
          path="/qr-management"
          element={
            <DashboardLayout>
              <QRManagement />
            </DashboardLayout>
          }
        />

        <Route
          path="/reward-dashboard"
          element={
            <DashboardLayout>
              <RewardDashboard />
            </DashboardLayout>
          }
        />

        <Route
          path="/scheme-management"
          element={
            <DashboardLayout>
              <SchemeManagement />
            </DashboardLayout>
          }
        />

        <Route
          path="/finance-dashboard"
          element={
            <DashboardLayout>
              <FinanceDashboard />
            </DashboardLayout>
          }
        />

        <Route
          path="/reports"
          element={
            <DashboardLayout>
              <Reports />
            </DashboardLayout>
          }
        />

        <Route
          path="/system-settings"
          element={
            <DashboardLayout>
              <SystemSettings />
            </DashboardLayout>
          }
        />

        <Route
          path="/manufacturing-batch-management"
          element={
            <DashboardLayout>
              <ManufacturingBatchManagement />
            </DashboardLayout>
          }
        />

        <Route
          path="/inventory-management"
          element={
            <DashboardLayout>
              <InventoryManagement />
            </DashboardLayout>
          }
        />

        <Route
          path="/dispatch-management"
          element={
            <DashboardLayout>
              <DispatchManagement />
            </DashboardLayout>
          }
        />

        <Route
          path="/inbound-material-management"
          element={
            <DashboardLayout>
              <InboundMaterialManagement />
            </DashboardLayout>
          }
        />

        <Route
          path="/employee-hr-management"
          element={
            <DashboardLayout>
              <EmployeeHRManagement />
            </DashboardLayout>
          }
        />

        <Route
          path="/commission-management"
          element={
            <DashboardLayout>
              <CommissionManagement />
            </DashboardLayout>
          }
        />


      </Routes>

    </BrowserRouter>
  );
};

export default App;