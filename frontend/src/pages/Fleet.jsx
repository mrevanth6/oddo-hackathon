import { useState } from "react";
import "./Fleet.css";

const initialFleetRows = [
  {
    regNo: "GT01AB4521",
    name: "VAN-05",
    type: "Van",
    capacity: "500 Kg",
    odometer: "74,000",
    acqCost: "6,20,000",
    status: "Available",
  },
  {
    regNo: "GT01AB9981",
    name: "TRUCK-11",
    type: "Truck",
    capacity: "5 Ton",
    odometer: "182,000",
    acqCost: "24,50,000",
    status: "On Trip",
  },
  {
    regNo: "GT01AB1120",
    name: "MINI-03",
    type: "Mini",
    capacity: "1 Ton",
    odometer: "66,000",
    acqCost: "4,10,000",
    status: "In Shop",
  },
  {
    regNo: "GT01AB008",
    name: "VAN-09",
    type: "Van",
    capacity: "750 Kg",
    odometer: "241,900",
    acqCost: "5,90,000",
    status: "Retired",
  },
];

function Fleet() {
  const [fleetRows, setFleetRows] = useState(initialFleetRows);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    regNo: "",
    name: "",
    type: "Van",
    capacity: "",
    acqCost: "",
  });

  const statusClass = (status) => {
    if (status === "Available") return "fleet-pill fleet-pill-green";
    if (status === "On Trip") return "fleet-pill fleet-pill-blue";
    if (status === "In Shop") return "fleet-pill fleet-pill-amber";
    return "fleet-pill fleet-pill-red";
  };

  const openModal = () => setIsModalOpen(true);

  const closeModal = () => {
    setIsModalOpen(false);
    setFormData({
      regNo: "",
      name: "",
      type: "Van",
      capacity: "",
      acqCost: "",
    });
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const newFleetRow = {
      regNo: formData.regNo,
      name: formData.name,
      type: formData.type,
      capacity: formData.capacity,
      odometer: "0",
      acqCost: formData.acqCost,
      status: "Available",
    };

    setFleetRows((previous) => [...previous, newFleetRow]);
    closeModal();
  };

  return (
    <section className="fleet-page">
      <div className="fleet-toolbar">
        <h3>Filters</h3>
        <div className="fleet-toolbar-row">
          <select defaultValue="all-type" aria-label="Type">
            <option value="all-type">Type: All</option>
            <option value="van">Type: Van</option>
            <option value="truck">Type: Truck</option>
            <option value="mini">Type: Mini</option>
            <option value="bus">Type: Bus</option>
            <option value="motor-cycle">Type: Motor Cycle</option>
          </select>

          <select defaultValue="all-status" aria-label="Status">
            <option value="all-status">Status: All</option>
            <option value="available">Status: Available</option>
            <option value="on-trip">Status: On Trip</option>
            <option value="in-shop">Status: In Shop</option>
            <option value="retired">Status: Retired</option>
          </select>

          <input
            type="search"
            placeholder="Search reg. no..."
            aria-label="Search registration number"
          />

          <button type="button" className="add-vehicle-btn" onClick={openModal}>
            + Add Vehicle
          </button>
        </div>
      </div>

      <div className="fleet-table-wrap">
        <table className="fleet-table">
          <thead>
            <tr>
              <th>Reg. No. (Unique)</th>
              <th>Name/Model</th>
              <th>Type</th>
              <th>Capacity</th>
              <th>Odometer</th>
              <th>Acq. Cost</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {fleetRows.map((row) => (
              <tr key={row.regNo}>
                <td>{row.regNo}</td>
                <td>{row.name}</td>
                <td>{row.type}</td>
                <td>{row.capacity}</td>
                <td>{row.odometer}</td>
                <td>{row.acqCost}</td>
                <td>
                  <span className={statusClass(row.status)}>{row.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <p className="fleet-note">
          Rule: Registration No. must be unique. Retired/In Shop vehicles are
          hidden from Trip Dispatcher.
        </p>
      </div>

      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div
            className="modal-card"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="modal-header">
              <h2>Add Vehicle Details</h2>
              <button
                type="button"
                className="modal-close-btn"
                onClick={closeModal}
              >
                ×
              </button>
            </div>

            <form className="driver-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="regNo">Reg No.</label>
                <input
                  id="regNo"
                  name="regNo"
                  type="text"
                  value={formData.regNo}
                  onChange={handleChange}
                  placeholder="Enter registration number"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="name">Name/Model</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter vehicle name/model"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="type">Type</label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                >
                  <option value="Van">Van</option>
                  <option value="Truck">Truck</option>
                  <option value="Mini">Mini</option>
                  <option value="Bus">Bus</option>
                  <option value="Motor Cycle">Motor Cycle</option>
                  <option value="Pick Up">Pick Up</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="capacity">Capacity</label>
                <input
                  id="capacity"
                  name="capacity"
                  type="text"
                  value={formData.capacity}
                  onChange={handleChange}
                  placeholder="Enter capacity"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="acqCost">Acquisition Cost</label>
                <input
                  id="acqCost"
                  name="acqCost"
                  type="text"
                  value={formData.acqCost}
                  onChange={handleChange}
                  placeholder="Enter acquisition cost"
                  required
                />
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="secondary-btn"
                  onClick={closeModal}
                >
                  Close
                </button>
                <button type="submit" className="primary-btn">
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}

export default Fleet;
