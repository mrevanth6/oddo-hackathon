import { useMemo, useState } from "react";
import Sidebar from "./Sidebar";
import TopNavBar from "./TopNavBar";
import DashBoard from "../pages/DashBoard";
import Fleet from "../pages/Fleet";
import Drivers from "../pages/Drivers";
import "./Layout.css";

function Layout() {
  const navItems = useMemo(
    () => [
      { key: "dashboard", label: "Dashboard" },
      { key: "fleet", label: "Fleet" },
      { key: "drivers", label: "Drivers" },
      { key: "trips", label: "Trips" },
      { key: "maintenance", label: "Maintenance" },
      { key: "fuel-expenses", label: "Fuel & Expenses" },
      { key: "analytics", label: "Analytics" },
      { key: "settings", label: "Settings" },
    ],
    [],
  );

  const [selectedPage, setSelectedPage] = useState(navItems[0].key);
  const activeItem = navItems.find((item) => item.key === selectedPage);

  const renderPage = () => {
    switch (selectedPage) {
      case "dashboard":
        return <DashBoard />;
      case "fleet":
        return <Fleet />;
      case "drivers":
        return <Drivers />;
      case "trips":
        return <h2>Trips Page</h2>;
      case "maintenance":
        return <h2>Maintenance Page</h2>;
      case "fuel-expenses":
        return <h2>Fuel & Expenses Page</h2>;
      case "analytics":
        return <h2>Analytics Page</h2>;
      case "settings":
        return <h2>Settings Page</h2>;
      default:
        return <DashBoard />;
    }
  };

  return (
    <div className="app-shell">
      <Sidebar
        items={navItems}
        selectedPage={selectedPage}
        onSelectPage={setSelectedPage}
      />
      <div className="main-shell">
        <TopNavBar title={activeItem?.label ?? "Dashboard"} />
        <main className="page-body">{renderPage()}</main>
      </div>
    </div>
  );
}

export default Layout;
