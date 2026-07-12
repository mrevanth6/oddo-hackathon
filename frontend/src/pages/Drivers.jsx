import "./Drivers.css";
import { useState } from "react";
const DriverRows = [
  {
    DRIVER: "Alex",
    LICENSE_No: "DL-12345",
    EXPIRY: "2025-12-31",
    CONTACT_No: "98765xxxxxx",
    TRIP_COMPLETION: "95%",
    SAFETY: "Available",
    STATUS: "Available",
  },
  {
    DRIVER: "Alex",
    LICENSE_No: "DL-12345",
    EXPIRY: "2025-12-31",
    CONTACT_No: "98765xxxxxx",
    TRIP_COMPLETION: "95%",
    SAFETY: "Available",
    STATUS: "Available",
  },
  {
    DRIVER: "Priya",
    LICENSE_No: "DL-54321",
    EXPIRY: "2025-12-31",
    CONTACT_No: "98765xxxxxx",
    TRIP_COMPLETION: "95%",
    SAFETY: "Available",
    STATUS: "Available",
  },
  {
    DRIVER: "Suresh",
    LICENSE_No: "DL-98765",
    TYPE: "Van",
    EXPIRY: "2025-12-31",
    CONTACT_No: "98765xxxxxx",
    TRIP_COMPLETION: "95%",
    SAFETY: "Available",
    STATUS: "Retired",
  },
];

function Drivers() {
  const [drivers, setDrivers] = useState(DriverRows);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    DRIVER: "",
    LICENSE_No: "",
    EXPIRY: "",
    CONTACT_No: "",
    SAFETY: "Available",
    STATUS: "Available",
  });
  const statusClass = (status) => {
    if (status === "Available") return "drivers-pill drivers-pill-green";
    if (status === "On Trip") return "drivers-pill drivers-pill-blue";
    if (status === "In Shop") return "drivers-pill drivers-pill-amber";
    return "drivers-pill drivers-pill-red";
  };
  const openModal = () => {
    setIsModalOpen(true);
  };
  const closeModal = () => {
    setIsModalOpen(false);
    setFormData({
      DRIVER: "",
      LICENSE_No: "",
      EXPIRY: "",
      CONTACT_No: "",
      SAFETY: "Available",
      STATUS: "Available",
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

    const newDriver = {
      ...formData,
    };

    setDrivers((previous) => [...previous, newDriver]);
    closeModal();
  };

  return (
    <section className="drivers-page">
      <button type="button" className="add-vehicle-btn" onClick={openModal}>
        + Add Vehicle
      </button>
      <div className="drivers-table-wrap">
        <table className="drivers-table">
          <thead>
            <tr>
              <th>Driver</th>
              <th>License No.</th>
              <th>Expiry</th>
              <th>Contact</th>

              <th>Safety</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {drivers.map((row) => (
              <tr key={row.DRIVER}>
                <td>{row.DRIVER}</td>
                <td>{row.LICENSE_No}</td>
                <td>{row.EXPIRY}</td>
                <td>{row.CONTACT_No}</td>

                <td>
                  <span className={statusClass(row.SAFETY)}>{row.SAFETY}</span>
                </td>
                <td>
                  <span className={statusClass(row.STATUS)}>{row.STATUS}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {isModalOpen && (
        <div className="modal-overlay" onClick={closeModal}>
          <div
            className="modal-card"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="modal-header">
              <h2>Add Driver Details</h2>
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
                <label htmlFor="DRIVER">Name</label>
                <input
                  id="DRIVER"
                  name="DRIVER"
                  type="text"
                  value={formData.DRIVER}
                  onChange={handleChange}
                  placeholder="Enter driver name"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="LICENSE_No">License No.</label>
                <input
                  id="LICENSE_No"
                  name="LICENSE_No"
                  type="text"
                  value={formData.LICENSE_No}
                  onChange={handleChange}
                  placeholder="Enter license number"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="EXPIRY">Expiry Date</label>
                <input
                  id="EXPIRY"
                  name="EXPIRY"
                  type="date"
                  value={formData.EXPIRY}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="CONTACT_No">Contact No.</label>
                <input
                  id="CONTACT_No"
                  name="CONTACT_No"
                  type="tel"
                  value={formData.CONTACT_No}
                  onChange={handleChange}
                  placeholder="Enter contact number"
                  required
                />
              </div>

              {/* <div className="form-group">
                <label htmlFor="SAFETY">Safety</label>
                <select
                  id="SAFETY"
                  name="SAFETY"
                  value={formData.SAFETY}
                  onChange={handleChange}
                >
                  <option value="Available">Available</option>
                  <option value="On Trip">On Trip</option>
                  <option value="In Shop">In Shop</option>
                  <option value="Retired">Retired</option>
                </select>
              </div> */}

              {/* <div className="form-group">
                <label htmlFor="STATUS">Status</label>
                <select
                  id="STATUS"
                  name="STATUS"
                  value={formData.STATUS}
                  onChange={handleChange}
                >
                  <option value="Available">Available</option>
                  <option value="On Trip">On Trip</option>
                  <option value="In Shop">In Shop</option>
                  <option value="Retired">Retired</option>
                </select>
              </div> */}

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

export default Drivers;
