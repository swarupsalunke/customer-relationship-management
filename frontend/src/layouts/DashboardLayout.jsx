import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

const DashboardLayout = ({ children }) => {
  return (
    <div className="dashboard">

      {/* CONSTANT SIDEBAR */}
      <Sidebar />

      {/* RIGHT SIDE */}
      <main className="dashboard-main">

        {/* CONSTANT NAVBAR */}
        <Navbar />

        {/* PAGE CONTENT */}
        <section className="dashboard-content">
          {children}
        </section>

      </main>

    </div>
  );
};

export default DashboardLayout;