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
  Settings,
  Headphones,
  Phone,
  ChevronRight,
  ChevronDown,
  FileText,
  Wallet,
  FileBarChart,
  Boxes,
  Truck,
  PackageCheck,
  Users,
  WalletCards,
  Bell,
  MessageSquare,
  Cake,
  Award,
  Map,
} from "lucide-react";

import { NavLink } from "react-router-dom";
import "../css/sidebar.css";

const Sidebar = () => {
  const [storeOpen, setStoreOpen] = useState(false);
  const [orderOpen, setOrderOpen] = useState(false);
  const [leadOpen, setLeadOpen] = useState(false);
  const [qrOpen, setQrOpen] = useState(false);
  const [rewardOpen, setRewardOpen] = useState(false);
  const [schemeOpen, setSchemeOpen] = useState(false);
  const [financeOpen, setFinanceOpen] = useState(false);
  const [reportsOpen, setReportsOpen] = useState(false);
  const [systemSettingsOpen, setSystemSettingsOpen] = useState(false);
  const [manufacturingOpen, setManufacturingOpen] = useState(false);
  const [inventoryOpen, setInventoryOpen] = useState(false);
  const [dispatchOpen, setDispatchOpen] = useState(false);
  const [inboundOpen, setInboundOpen] = useState(false);
  const [hrOpen, setHrOpen] = useState(false);
  const [commissionOpen, setCommissionOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [documentsOpen, setDocumentsOpen] = useState(false);
  const [birthdayOpen, setBirthdayOpen] = useState(false);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [loyaltyTierOpen, setLoyaltyTierOpen] = useState(false);
  const [followUpOpen, setFollowUpOpen] = useState(false);
  const [salesVisitOpen, setSalesVisitOpen] = useState(false);

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

        {/* Scheme Management */}
        <div className="store-management-menu">

          <div
            className="dashboard-nav-item"
            onClick={() => setSchemeOpen(!schemeOpen)}
          >
            <Gift size={19} />

            <span>Scheme Management</span>

            {schemeOpen ? (
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

          {/* Scheme List */}
          {schemeOpen && (
            <div className="store-submenu">

              <NavLink
                to="/scheme-management"
                className={({ isActive }) =>
                  `store-submenu-item ${isActive ? "active" : ""}`
                }
              >
                <FileText size={16} />

                <span>All Schemes</span>
              </NavLink>

            </div>
          )}

        </div>


        {/* Finance Management */}
        <div className="store-management-menu">

          <div
            className="dashboard-nav-item"
            onClick={() => setFinanceOpen(!financeOpen)}
          >
            <Wallet size={19} />

            <span>Finance Management</span>

            {financeOpen ? (
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

          {/* Finance Dashboard */}
          {financeOpen && (
            <div className="store-submenu">

              <NavLink
                to="/finance-dashboard"
                className={({ isActive }) =>
                  `store-submenu-item ${isActive ? "active" : ""}`
                }
              >
                <FileText size={16} />

                <span>Finance Dashboard</span>
              </NavLink>

            </div>
          )}

        </div>


        {/* Reports Management */}
        <div className="store-management-menu">

          <div
            className="dashboard-nav-item"
            onClick={() => setReportsOpen(!reportsOpen)}
          >
            <FileBarChart size={19} />

            <span>Reports Management</span>

            {reportsOpen ? (
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

          {/* Reports */}
          {reportsOpen && (
            <div className="store-submenu">

              <NavLink
                to="/reports"
                className={({ isActive }) =>
                  `store-submenu-item ${isActive ? "active" : ""}`
                }
              >
                <FileText size={16} />

                <span>All Reports</span>
              </NavLink>

            </div>
          )}

        </div>


        {/* Manufacturing Management */}
        <div className="store-management-menu">

          <div
            className="dashboard-nav-item"
            onClick={() =>
              setManufacturingOpen(!manufacturingOpen)
            }
          >
            <Factory size={19} />

            <span>Manufacturing</span>

            {manufacturingOpen ? (
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

          {/* Manufacturing - Batch Management */}
          {manufacturingOpen && (
            <div className="store-submenu">

              <NavLink
                to="/manufacturing-batch-management"
                className={({ isActive }) =>
                  `store-submenu-item ${isActive ? "active" : ""
                  }`
                }
              >
                <FileText size={16} />

                <span>Batch Management</span>
              </NavLink>

            </div>
          )}

        </div>


        {/* Inventory Management */}
        <div className="store-management-menu">

          <div
            className="dashboard-nav-item"
            onClick={() =>
              setInventoryOpen(!inventoryOpen)
            }
          >
            <Boxes size={19} />

            <span>Inventory Management</span>

            {inventoryOpen ? (
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

          {inventoryOpen && (
            <div className="store-submenu">

              <NavLink
                to="/inventory-management"
                className={({ isActive }) =>
                  `store-submenu-item ${isActive ? "active" : ""
                  }`
                }
              >
                <FileText size={16} />

                <span>Inventory Overview</span>
              </NavLink>

            </div>
          )}

        </div>

        {/* Dispatch Management */}
        <div className="store-management-menu">

          <div
            className="dashboard-nav-item"
            onClick={() => setDispatchOpen(!dispatchOpen)}
          >
            <Truck size={19} />

            <span>Dispatch Management</span>

            {dispatchOpen ? (
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

          {/* Dispatch Dashboard */}
          {dispatchOpen && (
            <div className="store-submenu">

              <NavLink
                to="/dispatch-management"
                className={({ isActive }) =>
                  `store-submenu-item ${isActive ? "active" : ""}`
                }
              >
                <FileText size={16} />

                <span>Overview</span>
              </NavLink>

            </div>
          )}

        </div>


        {/* Inbound Material Management */}
        <div className="store-management-menu">

          <div
            className="dashboard-nav-item"
            onClick={() => setInboundOpen(!inboundOpen)}
          >
            <PackageCheck size={19} />

            <span>Inbound Material Management</span>

            {inboundOpen ? (
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

          {/* Inbound Dashboard */}
          {inboundOpen && (
            <div className="store-submenu">

              <NavLink
                to="/inbound-material-management"
                className={({ isActive }) =>
                  `store-submenu-item ${isActive ? "active" : ""}`
                }
              >
                <FileText size={16} />

                <span>Overview</span>
              </NavLink>

            </div>
          )}

        </div>

        {/* Employee HR Management */}
        <div className="store-management-menu">

          <div
            className="dashboard-nav-item"
            onClick={() => setHrOpen(!hrOpen)}
          >
            <Users size={19} />

            <span>Employee HR Management</span>

            {hrOpen ? (
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

          {/* HR Submenu */}
          {hrOpen && (
            <div className="store-submenu">

              <NavLink
                to="/employee-hr-management"
                className={({ isActive }) =>
                  `store-submenu-item ${isActive ? "active" : ""}`
                }
              >
                <LayoutDashboard size={16} />
                <span>Overview</span>
              </NavLink>
            </div>
          )}

        </div>

        {/* Commission Management */}
        <div className="store-management-menu">

          <div
            className="dashboard-nav-item"
            onClick={() => setCommissionOpen(!commissionOpen)}
          >
            <WalletCards size={19} />

            <span>Commission Management</span>

            {commissionOpen ? (
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

          {/* Commission Dashboard */}
          {commissionOpen && (
            <div className="store-submenu">

              <NavLink
                to="/commission-management"
                className={({ isActive }) =>
                  `store-submenu-item ${isActive ? "active" : ""}`
                }
              >
                <FileText size={16} />

                <span>Overview</span>
              </NavLink>

            </div>
          )}

        </div>

        {/* Downloads & Documents */}
        <div className="store-management-menu">

          <div
            className="dashboard-nav-item"
            onClick={() => setDocumentsOpen(!documentsOpen)}
          >
            <FileText size={19} />

            <span>Downloads & Documents</span>

            {documentsOpen ? (
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

          {/* Documents Management */}

          {documentsOpen && (
            <div className="store-submenu">

              <NavLink
                to="/document-management"
                className={({ isActive }) =>
                  `store-submenu-item ${isActive ? "active" : ""}`
                }
              >
                <FileText size={16} />

                <span>Documents Management</span>
              </NavLink>

            </div>
          )}
        </div>

        {/* Birthday Management */}
        <div className="store-management-menu">

          <div
            className="dashboard-nav-item"
            onClick={() => setBirthdayOpen(!birthdayOpen)}
          >
            <Cake size={19} />

            <span>Birthday Management</span>

            {birthdayOpen ? (
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

          {/* Birthday Dashboard */}
          {birthdayOpen && (
            <div className="store-submenu">

              <NavLink
                to="/birthday-management"
                className={({ isActive }) =>
                  `store-submenu-item ${isActive ? "active" : ""}`
                }
              >
                <FileText size={16} />

                <span>Overview</span>
              </NavLink>

            </div>
          )}

        </div>

        {/* Feedback Management */}
        <div className="store-management-menu">

          <div
            className="dashboard-nav-item"
            onClick={() => setFeedbackOpen(!feedbackOpen)}
          >
            <MessageSquare size={19} />

            <span>Feedback Management</span>

            {feedbackOpen ? (
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

          {feedbackOpen && (
            <div className="store-submenu">

              <NavLink
                to="/feedback-management"
                className={({ isActive }) =>
                  `store-submenu-item ${isActive ? "active" : ""}`
                }
              >
                <FileText size={16} />
                <span>Feedback Management</span>
              </NavLink>

            </div>
          )}

        </div>

        {/* follow up management */}
        <div className="store-management-menu">

          <div
            className="dashboard-nav-item"
            onClick={() => setFollowUpOpen(!followUpOpen)}
          >
            <Users size={19} />

            <span>Follow-up Management</span>

            {followUpOpen ? (
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

          {followUpOpen && (
            <div className="store-submenu">

              <NavLink
                to="/follow-up-management"
                className={({ isActive }) =>
                  `store-submenu-item ${isActive ? "active" : ""}`
                }
              >
                <FileText size={16} />
                <span>Follow-up Management</span>
              </NavLink>

            </div>
          )}

        </div>


        {/* Loyalty Tier Management */}
        <div className="store-management-menu">

          <div
            className="dashboard-nav-item"
            onClick={() => setLoyaltyTierOpen(!loyaltyTierOpen)}
          >
            <Award size={19} />

            <span>Loyalty Tier Management</span>

            {loyaltyTierOpen ? (
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

          {/* Loyalty Tier Management */}
          {loyaltyTierOpen && (
            <div className="store-submenu">

              <NavLink
                to="/loyalty-tier-management"
                className={({ isActive }) =>
                  `store-submenu-item ${isActive ? "active" : ""}`
                }
              >
                <FileText size={16} />

                <span>Loyalty Tier Management</span>
              </NavLink>

            </div>
          )}

        </div>

        {/* Sales Visit Planning */}
        <div className="store-management-menu">

          <div
            className="dashboard-nav-item"
            onClick={() => setSalesVisitOpen(!salesVisitOpen)}
          >
            <Map size={19} />

            <span>Sales Visit Planning</span>

            {salesVisitOpen ? (
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

          {/* Sales Visit Dashboard */}
          {salesVisitOpen && (
            <div className="store-submenu">

              <NavLink
                to="/sales-visit-planning"
                className={({ isActive }) =>
                  `store-submenu-item ${isActive ? "active" : ""}`
                }
              >
                <FileText size={16} />

                <span>Sales Visit Planning</span>
              </NavLink>

            </div>
          )}

        </div>

        {/* Notification & Subscription Management */}
        <div className="store-management-menu">

          <div
            className="dashboard-nav-item"
            onClick={() => setNotificationOpen(!notificationOpen)}
          >
            <Bell size={19} />

            <span>Notification & Subscription</span>

            {notificationOpen ? (
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

          {/* Notification & Subscription Dashboard */}
          {notificationOpen && (
            <div className="store-submenu">

              <NavLink
                to="/notification-management"
                className={({ isActive }) =>
                  `store-submenu-item ${isActive ? "active" : ""}`
                }
              >
                <FileText size={16} />
                <span>Notification Management</span>
              </NavLink>
            </div>
          )}

        </div>

        {/* System Settings */}
        <div className="store-management-menu">

          <div
            className="dashboard-nav-item"
            onClick={() => setSystemSettingsOpen(!systemSettingsOpen)}
          >
            <Settings size={19} />

            <span>System Settings</span>

            {systemSettingsOpen ? (
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

          {/* General Settings */}
          {systemSettingsOpen && (
            <div className="store-submenu">

              <NavLink
                to="/system-settings"
                className={({ isActive }) =>
                  `store-submenu-item ${isActive ? "active" : ""}`
                }
              >
                <FileText size={16} />

                <span>General Settings</span>
              </NavLink>

            </div>
          )}

        </div>

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