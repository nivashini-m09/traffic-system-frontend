import { useEffect, useState } from "react";
import {
  Car,
  Search,
  RefreshCw,
  Plus,
  X,
} from "lucide-react";

import { getVehicles } from "../api";
import axios from "axios";


function Vehicles() {

  const [vehicles, setVehicles] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    vehicleNumber: "",
    vehicleClass: "",
    anprTag: "",
    rfidTag: "",
    status: "ACTIVE",
  });


  const loadVehicles = async () => {

    try {

      setLoading(true);

      const response = await getVehicles();

      setVehicles(response.data);

    } catch (error) {

      console.error(
        "Vehicle loading error:",
        error
      );

    } finally {

      setLoading(false);

    }
  };


  useEffect(() => {
    loadVehicles();
  }, []);


  const handleChange = (event) => {

    const { name, value } =
      event.target;

    setForm({
      ...form,
      [name]: value,
    });

  };


  const addVehicle = async (event) => {

    event.preventDefault();

    try {

      await axios.post(
        "http://localhost:8090/api/vehicles",
        form
      );

      alert("Vehicle registered successfully!");

      setForm({
        vehicleNumber: "",
        vehicleClass: "",
        anprTag: "",
        rfidTag: "",
        status: "ACTIVE",
      });

      setShowForm(false);

      loadVehicles();

    } catch (error) {

      console.error(error);

      alert(
        error.response?.data?.message ||
        "Failed to register vehicle"
      );

    }
  };


  const filteredVehicles =
    vehicles.filter((vehicle) =>
      vehicle.vehicleNumber
        ?.toLowerCase()
        .includes(search.toLowerCase())
    );


  return (

    <div className="page">


      {/* ================= HEADER ================= */}

      <div className="page-heading">

        <div>

          <p className="eyebrow">
            VEHICLE MANAGEMENT
          </p>

          <h1>
            Vehicle Registry
          </h1>

          <p className="subtitle">
            Register and manage vehicles,
            ANPR and RFID identifiers.
          </p>

        </div>


        <div className="page-actions">

          <button
            className="refresh-button"
            onClick={loadVehicles}
          >

            <RefreshCw size={16} />

            Refresh

          </button>


          <button
            className="primary-button"
            onClick={() =>
              setShowForm(true)
            }
          >

            <Plus size={17} />

            Add Vehicle

          </button>

        </div>

      </div>


      {/* ================= ADD VEHICLE FORM ================= */}

      {showForm && (

        <div className="panel form-panel">

          <div className="panel-header">

            <div>

              <h3>
                Register New Vehicle
              </h3>

              <span>
                Enter vehicle identification
                details.
              </span>

            </div>


            <button
              className="close-button"
              onClick={() =>
                setShowForm(false)
              }
            >

              <X size={18} />

            </button>

          </div>


          <form
            className="vehicle-form"
            onSubmit={addVehicle}
          >

            <div className="form-group">

              <label>
                Vehicle Number
              </label>

              <input
                name="vehicleNumber"
                placeholder="TN01AB1234"
                value={form.vehicleNumber}
                onChange={handleChange}
                required
              />

            </div>


            <div className="form-group">

              <label>
                Vehicle Class
              </label>

              <select
                name="vehicleClass"
                value={form.vehicleClass}
                onChange={handleChange}
                required
              >

                <option value="">
                  Select class
                </option>

                <option value="CAR">
                  CAR
                </option>

                <option value="BUS">
                  BUS
                </option>

                <option value="TRUCK">
                  TRUCK
                </option>

              </select>

            </div>


            <div className="form-group">

              <label>
                ANPR Tag
              </label>

              <input
                name="anprTag"
                placeholder="ANPR-003"
                value={form.anprTag}
                onChange={handleChange}
              />

            </div>


            <div className="form-group">

              <label>
                RFID Tag
              </label>

              <input
                name="rfidTag"
                placeholder="RFID-003"
                value={form.rfidTag}
                onChange={handleChange}
              />

            </div>


            <div className="form-group">

              <label>
                Status
              </label>

              <select
                name="status"
                value={form.status}
                onChange={handleChange}
              >

                <option value="ACTIVE">
                  ACTIVE
                </option>

                <option value="INACTIVE">
                  INACTIVE
                </option>

              </select>

            </div>


            <div className="form-actions">

              <button
                type="button"
                className="cancel-button"
                onClick={() =>
                  setShowForm(false)
                }
              >
                Cancel
              </button>


              <button
                type="submit"
                className="primary-button"
              >

                <Plus size={16} />

                Register Vehicle

              </button>

            </div>

          </form>

        </div>

      )}


      {/* ================= VEHICLE TABLE ================= */}

      <div className="panel">

        <div className="panel-header">

          <div>

            <h3>
              Registered Vehicles
            </h3>

            <span>
              {vehicles.length}
              {" "}vehicles registered
            </span>

          </div>


          <div className="search-box">

            <Search size={17} />

            <input
              type="text"
              placeholder="Search vehicle..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

          </div>

        </div>


        {loading ? (

          <div className="empty-state">
            Loading vehicles...
          </div>

        ) : filteredVehicles.length === 0 ? (

          <div className="empty-state">

            <Car size={35} />

            <p>
              No vehicles found
            </p>

          </div>

        ) : (

          <div className="vehicle-table">

            <div className="table-header">

              <span>
                Vehicle
              </span>

              <span>
                Class
              </span>

              <span>
                ANPR Tag
              </span>

              <span>
                RFID Tag
              </span>

              <span>
                Status
              </span>

            </div>


            {filteredVehicles.map(
              (vehicle) => (

                <div
                  className="table-row"
                  key={vehicle.id}
                >

                  <div className="vehicle-name">

                    <div className="vehicle-icon">

                      <Car size={17} />

                    </div>


                    <div>

                      <strong>
                        {vehicle.vehicleNumber}
                      </strong>

                      <span>
                        ID #{vehicle.id}
                      </span>

                    </div>

                  </div>


                  <span>
                    {vehicle.vehicleClass}
                  </span>

                  <span>
                    {vehicle.anprTag || "-"}
                  </span>

                  <span>
                    {vehicle.rfidTag || "-"}
                  </span>

                  <span>

                    <b
                      className={
                        vehicle.status === "ACTIVE"
                          ? "status-active"
                          : "status-inactive"
                      }
                    >
                      {vehicle.status ||
                        "UNKNOWN"}
                    </b>

                  </span>

                </div>

              )
            )}

          </div>

        )}

      </div>

    </div>

  );
}


export default Vehicles;