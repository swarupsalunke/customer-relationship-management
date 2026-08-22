import {
  Menu,
  Search,
  Plus,
  Bell,
  ClipboardCheck,
  CalendarDays,
  Moon,
  Grid3X3,
  ChevronDown,
} from "lucide-react";

const Navbar = () => {
  return (
    <header className="top-navbar">

      {/* ================= LEFT ================= */}
      <div className="navbar-left">

        {/* Hamburger */}
        <button className="navbar-menu-btn">
          <Menu size={20} />
        </button>

        {/* Search */}
        <div className="navbar-search">

          <Search size={17} />

          <input
            type="text"
            placeholder="Search anything..."
          />

          <span className="search-shortcut">
            Ctrl + K
          </span>

        </div>

      </div>


      {/* ================= RIGHT ================= */}
      <div className="navbar-right">

        {/* Add */}
        <button className="navbar-icon-btn add-btn">
          <Plus size={20} />
        </button>


        {/* Notification */}
        <button className="navbar-icon-btn notification-btn">

          <Bell size={19} />

          <span className="notification-count">
            12
          </span>

        </button>


        {/* Task / Checklist */}
        <button className="navbar-icon-btn">
          <ClipboardCheck size={19} />
        </button>


        {/* Calendar */}
        <button className="navbar-icon-btn">
          <CalendarDays size={19} />
        </button>


        {/* Dark Mode */}
        <button className="navbar-icon-btn">
          <Moon size={19} />
        </button>


        {/* Apps */}
        <button className="navbar-icon-btn">
          <Grid3X3 size={19} />
        </button>


        {/* Profile */}
        <div className="navbar-profile">

          <div className="navbar-profile-image">
            SA
          </div>

          <div className="navbar-profile-info">

            <strong>
              Super Admin
            </strong>

            <span>
              Super Admin
            </span>

          </div>

          <ChevronDown
            size={15}
            className="profile-arrow"
          />

        </div>

      </div>

    </header>
  );
};

export default Navbar;