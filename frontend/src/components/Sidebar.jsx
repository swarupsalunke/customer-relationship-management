import { useState } from "react";
import {
  LayoutDashboard,
  UsersRound,
  Package,
  Tag,
  Store,
  ShoppingCart,
  ClipboardList,
  QrCode,
  Gift,
  Factory,
  Warehouse,
  WalletCards,
  UserRoundCog,
  BarChart3,
  Settings,
  Headphones,
  Phone,
  ChevronRight,
  ChevronDown,
  FileText,
} from "lucide-react";

import { NavLink } from "react-router-dom";
import "../css/sidebar.css";




const Sidebar = () => {
  const [storeOpen, setStoreOpen] = useState(false);
  const [orderOpen, setOrderOpen] = useState(false);
  const [leadOpen, setLeadOpen] = useState(false);
  const [qrOpen, setQrOpen] = useState(false);
  const [rewardOpen, setRewardOpen] = useState(false);

  return (
    <aside className="dashboard-sidebar">

      {/* ================= LOGO ================= */}
      <div className="dashboard-logo">
        <span>Oneplus</span>
        <strong>Spark</strong>
        <small>PAINTS</small>
      </div>


      {/* ================= MAIN MENU ================= */}
      <nav className="dashboard-nav">

        {/* Dashboard */}
        <NavLink
          to="/dashboard"
          className="dashboard-nav-item"
        >
          <LayoutDashboard size={19} />
          <span>Dashboard</span>
        </NavLink>


        {/* User Management */}
        <NavLink
          to="/users"
          className="dashboard-nav-item"
        >
          <UsersRound size={19} />
          <span>User Management</span>
          <ChevronRight className="menu-arrow" size={16} style={{ marginLeft: "auto" }} />
        </NavLink>


        {/* Product Management */}
        <NavLink
          to="/products"
          className={({ isActive }) =>
            `dashboard-nav-item ${isActive ? "active" : ""}`
          }
        >
          <Package size={19} />
          <span>Product Management</span>
          <ChevronRight className="menu-arrow" size={16} style={{ marginLeft: "auto" }} />
        </NavLink>


        {/* Price Management */}
        <NavLink
          to="/prices"
          className="dashboard-nav-item"
        >
          <Tag size={19} />
          <span>Price Management</span>
        </NavLink>


        {/* Shop Management */}
        <div className="store-management-menu">

          <div
            className="dashboard-nav-item"
            onClick={() => setStoreOpen(!storeOpen)}
          >
            <Store size={19} />

            <span>Store Management</span>

            {storeOpen ? (
              <ChevronDown
                className="menu-arrow"
                size={16}
                style={{ marginLeft: "auto" }}
              />
            ) : (
              <ChevronRight
                className="menu-arrow"
                size={16}
                style={{ marginLeft: "auto" }}
              />
            )}
          </div>


          {/* Daily Reports */}

          {storeOpen && (
            <div className="store-submenu">

              <NavLink
                to="/daily-cash-report"
                className={({ isActive }) =>
                  `store-submenu-item ${isActive ? "active" : ""
                  }`
                }
              >
                <FileText size={16} />

                <span>Daily Reports</span>
              </NavLink>

            </div>
          )}

        </div>


        {/* Order Management */}
        {/* ================= ORDER MANAGEMENT ================= */}

        <div className="store-management-menu">

          <div
            className="dashboard-nav-item"
            onClick={() => setOrderOpen(!orderOpen)}
          >
            <ShoppingCart size={19} />

            <span>Order Management</span>

            {orderOpen ? (
              <ChevronDown
                className="menu-arrow"
                size={16}
                style={{ marginLeft: "auto" }}
              />
            ) : (
              <ChevronRight
                className="menu-arrow"
                size={16}
                style={{ marginLeft: "auto" }}
              />
            )}
          </div>


          {/* Order List */}

          {orderOpen && (
            <div className="store-submenu">

              <NavLink
                to="/order-management"
                className={({ isActive }) =>
                  `store-submenu-item ${isActive ? "active" : ""
                  }`
                }
              >
                <FileText size={16} />

                <span>Order List</span>
              </NavLink>

            </div>
          )}

        </div>

        {/* ================= LEAD MANAGEMENT ================= */}

        <div className="store-management-menu">

          <div
            className="dashboard-nav-item"
            onClick={() => setLeadOpen(!leadOpen)}
          >
            <ClipboardList size={19} />

            <span>Lead Management</span>

            {leadOpen ? (
              <ChevronDown
                className="menu-arrow"
                size={16}
                style={{ marginLeft: "auto" }}
              />
            ) : (
              <ChevronRight
                className="menu-arrow"
                size={16}
                style={{ marginLeft: "auto" }}
              />
            )}
          </div>


          {/* Lead List */}

          {leadOpen && (
            <div className="store-submenu">

              <NavLink
                to="/leads"
                className={({ isActive }) =>
                  `store-submenu-item ${isActive ? "active" : ""}`
                }
              >
                <FileText size={16} />

                <span>Lead List</span>
              </NavLink>

            </div>
          )}

        </div>

        {/* QR Management */}
        <div className="store-management-menu">

          <div
            className="dashboard-nav-item"
            onClick={() => setQrOpen(!qrOpen)}
          >
            <QrCode size={19} />

            <span>QR Management</span>

            {qrOpen ? (
              <ChevronDown
                className="menu-arrow"
                size={16}
                style={{ marginLeft: "auto" }}
              />
            ) : (
              <ChevronRight
                className="menu-arrow"
                size={16}
                style={{ marginLeft: "auto" }}
              />
            )}
          </div>


          {/* QR Code List */}

          {qrOpen && (
            <div className="store-submenu">

              <NavLink
                to="/qr-management"
                className={({ isActive }) =>
                  `store-submenu-item ${isActive ? "active" : ""}`
                }
              >
                <FileText size={16} />

                <span>QR Codes List</span>
              </NavLink>

            </div>
          )}

        </div>


        {/* Reward Management */}
        <div className="store-management-menu">

          <div
            className="dashboard-nav-item"
            onClick={() => setRewardOpen(!rewardOpen)}
          >
            <Gift size={19} />

            <span>Rewards Management</span>

            {rewardOpen ? (
              <ChevronDown
                className="menu-arrow"
                size={16}
                style={{ marginLeft: "auto" }}
              />
            ) : (
              <ChevronRight
                className="menu-arrow"
                size={16}
                style={{ marginLeft: "auto" }}
              />
            )}
          </div>

          {/* Reward Dashboard */}
          {rewardOpen && (
            <div className="store-submenu">

              <NavLink
                to="/reward-dashboard"
                className={({ isActive }) =>
                  `store-submenu-item ${isActive ? "active" : ""}`
                }
              >
                <FileText size={16} />

                <span>Reward Dashboard</span>
              </NavLink>

            </div>
          )}

        </div>


        {/* Manufacturing */}
        <NavLink
          to="/manufacturing"
          className="dashboard-nav-item"
        >
          <Factory size={19} />
          <span>Manufacturing</span>
        </NavLink>


        {/* Inventory Management */}
        <NavLink
          to="/inventory"
          className="dashboard-nav-item"
        >
          <Warehouse size={19} />
          <span>Inventory Management</span>
          <ChevronRight className="menu-arrow" size={16} />
        </NavLink>


        {/* Finance Management */}
        <NavLink
          to="/finance"
          className="dashboard-nav-item"
        >
          <WalletCards size={19} />
          <span>Finance Management</span>
        </NavLink>


        {/* HR Management */}
        <NavLink
          to="/hr"
          className="dashboard-nav-item"
        >
          <UserRoundCog size={19} />
          <span>HR Management</span>
        </NavLink>


        {/* Reports & Analytics */}
        <NavLink
          to="/reports"
          className="dashboard-nav-item"
        >
          <BarChart3 size={19} />
          <span>Reports & Analytics</span>
          <ChevronRight className="menu-arrow" size={16} />
        </NavLink>


        {/* System Settings */}
        <NavLink
          to="/settings"
          className="dashboard-nav-item"
        >
          <Settings size={19} />
          <span>System Settings</span>
        </NavLink>

      </nav>


      {/* ================= HELP & SUPPORT ================= */}
      <div className="dashboard-sidebar-bottom">

        <div className="support-box">

          <div className="support-title">
            <Headphones size={18} />
            <strong>Help & Support</strong>
          </div>

          <p>support@oneplusspark.com</p>

          <div className="support-phone">
            <Phone size={16} />
            <span>+91 12345 67890</span>
          </div>

        </div>

      </div>


      {/* ================= VERSION ================= */}
      <div className="sidebar-version">
        Version 1.0.0
      </div>

    </aside>
  );
};

export default Sidebar;