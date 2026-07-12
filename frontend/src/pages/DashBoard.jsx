import "./DashBoard.css";

const kpiCards = [
  { title: "Active Vehicles", value: "53", tone: "blue" },
  { title: "Available Vehicles", value: "42", tone: "green" },
  { title: "Vehicles In Maintenance", value: "05", tone: "amber" },
  { title: "Active Trips", value: "18", tone: "blue" },
  { title: "Pending Trips", value: "09", tone: "blue" },
  { title: "Drivers On Duty", value: "26", tone: "blue" },
  { title: "Fleet Utilization", value: "81%", tone: "green" },
];

const recentTrips = [
  {
    trip: "TR001",
    vehicle: "VAN-05",
    driver: "Alex",
    status: "On Trip",
    eta: "45 min",
  },
  {
    trip: "TR002",
    vehicle: "TRK-12",
    driver: "John",
    status: "Completed",
    eta: "-",
  },
  {
    trip: "TR003",
    vehicle: "MNTR-08",
    driver: "Priya",
    status: "Dispatched",
    eta: "1h 10m",
  },
  {
    trip: "TR004",
    vehicle: "-",
    driver: "-",
    status: "Draft",
    eta: "Awaiting vehicle",
  },
];

const vehicleStatus = [
  { label: "Available", value: 72, tone: "green" },
  { label: "On Trip", value: 31, tone: "blue" },
  { label: "In Shop", value: 10, tone: "amber" },
  { label: "Retired", value: 6, tone: "red" },
];

function DashBoard() {
  const statusClass = (status) => {
    if (status === "Completed") return "pill pill-green";
    if (status === "On Trip") return "pill pill-blue";
    if (status === "Dispatched") return "pill pill-blue";
    return "pill pill-gray";
  };

  return (
    <section className="dashboard-page">
      <div className="dashboard-filters">
        <h3>Filters</h3>
        <div className="filter-row">
          <select defaultValue="all-type" aria-label="Vehicle Type">
            <option value="mini-truck">Vehicle Type: Mini Truck</option>
            <option value="truck">Vehicle Type: Truck</option>
            <option value="Van">Vehicle Type: Van</option>
            <option value="pick-up">Vehicle Type: Pick Up</option>
            <option value="Bus">Vehicle Type: Bus</option>
            <option value="Motor-cycle">Vehicle Type: Motor Cycle</option>
          </select>
          <select defaultValue="all-status" aria-label="Status">
            <option value="all-status">Status: All</option>
            <option value="available">Status: Available</option>
            <option value="on-trip">Status: On Trip</option>
            <option value="in-shop">Status: In Shop</option>
          </select>
          <select defaultValue="all-region" aria-label="Region">
            <option value="all-region">Region: All</option>
          </select>
        </div>
      </div>

      <div className="kpi-grid">
        {kpiCards.map((card) => (
          <article key={card.title} className={"kpi-card tone-" + card.tone}>
            <p>{card.title}</p>
            <h4>{card.value}</h4>
          </article>
        ))}
      </div>

      <div className="dashboard-main">
        <section className="table-panel">
          <h3>Recent Trips</h3>
          <table>
            <thead>
              <tr>
                <th>Trip</th>
                <th>Vehicle</th>
                <th>Driver</th>
                <th>Status</th>
                <th>ETA</th>
              </tr>
            </thead>
            <tbody>
              {recentTrips.map((trip) => (
                <tr key={trip.trip}>
                  <td>{trip.trip}</td>
                  <td>{trip.vehicle}</td>
                  <td>{trip.driver}</td>
                  <td>
                    <span className={statusClass(trip.status)}>
                      {trip.status}
                    </span>
                  </td>
                  <td>{trip.eta}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <aside className="status-panel">
          <h3>Vehicle Status</h3>
          {vehicleStatus.map((item) => (
            <div key={item.label} className="status-row">
              <span>{item.label}</span>
              <div className="bar-track">
                <div
                  className={"bar-fill bar-" + item.tone}
                  style={{ width: item.value + "%" }}
                />
              </div>
            </div>
          ))}
        </aside>
      </div>
    </section>
  );
}

export default DashBoard;
