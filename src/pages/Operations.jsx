import { useEffect, useState } from "react";
import {
  Activity,
  RadioTower,
  RefreshCw,
  Car,
  Plus,
  X,
  Receipt,
} from "lucide-react";

import {
  getGantries,
  getTollPassages,
  getTrafficStatistics,
  getVehicles,
} from "../api";

import axios from "axios";


function Operations({ type }) {

  const [data, setData] = useState([]);
  const [traffic, setTraffic] = useState({});
  const [vehicles, setVehicles] = useState([]);

  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const [passageForm, setPassageForm] = useState({
    vehicleId: "",
    gantryId: "",
    trafficDensity: "LOW",
  });


  const loadData = async () => {

    try {

      setLoading(true);

      if (type === "Gantries") {

        const response =
          await getGantries();

        setData(response.data);
      }


      if (type === "Toll Passages") {

        const [
          passageResponse,
          vehicleResponse,
        ] = await Promise.all([
          getTollPassages(),
          getVehicles(),
        ]);

        setData(
          passageResponse.data
        );

        setVehicles(
          vehicleResponse.data
        );
      }


      if (type === "Traffic") {

        const response =
          await getTrafficStatistics();

        setTraffic(
          response.data
        );
      }

    } catch (error) {

      console.error(
        "Operations loading error:",
        error
      );

    } finally {

      setLoading(false);

    }
  };


  useEffect(() => {

    setShowForm(false);

    loadData();

  }, [type]);


  const handlePassageChange = (event) => {

    const { name, value } =
      event.target;

    setPassageForm({
      ...passageForm,
      [name]: value,
    });

  };


  const createPassage = async (event) => {

    event.preventDefault();

    try {

      await axios.post(
        "http://localhost:8090/api/tolls/passages",
        {
          vehicle: {
            id: Number(
              passageForm.vehicleId
            ),
          },

          gantry: {
            id: Number(
              passageForm.gantryId
            ),
          },

          trafficDensity:
            passageForm.trafficDensity,
        }
      );


      alert(
        "Toll passage recorded successfully!"
      );


      setPassageForm({
        vehicleId: "",
        gantryId: "",
        trafficDensity: "LOW",
      });


      setShowForm(false);

      loadData();

    } catch (error) {

      console.error(error);

      alert(
        error.response?.data?.message ||
        "Failed to create toll passage"
      );

    }
  };


  /* ================= TRAFFIC ================= */

  if (type === "Traffic") {

    const total =
      traffic.totalPassages || 0;

    return (

      <div className="page">

        <div className="page-heading">

          <div>

            <p className="eyebrow">
              REAL-TIME ANALYTICS
            </p>

            <h1>
              Traffic Analytics
            </h1>

            <p className="subtitle">
              Monitor traffic density across
              toll infrastructure.
            </p>

          </div>


          <button
            className="refresh-button"
            onClick={loadData}
          >

            <RefreshCw size={16} />

            Refresh

          </button>

        </div>


        <div className="metrics-grid">

          <Metric
            title="Total Passages"
            value={total}
            icon={Activity}
          />

          <Metric
            title="Low Traffic"
            value={
              traffic.lowTraffic || 0
            }
            icon={Activity}
          />

          <Metric
            title="Medium Traffic"
            value={
              traffic.mediumTraffic || 0
            }
            icon={Activity}
          />

          <Metric
            title="High Traffic"
            value={
              traffic.highTraffic || 0
            }
            icon={Activity}
          />

        </div>


        <div className="panel">

          <div className="panel-header">

            <div>

              <h3>
                Traffic Distribution
              </h3>

              <span>
                Current traffic density
              </span>

            </div>

            <div className="live-badge">

              <span></span>

              LIVE

            </div>

          </div>


          <TrafficBar
            label="Low Traffic"
            value={traffic.lowTraffic}
            total={total}
          />

          <TrafficBar
            label="Medium Traffic"
            value={traffic.mediumTraffic}
            total={total}
          />

          <TrafficBar
            label="High Traffic"
            value={traffic.highTraffic}
            total={total}
          />

        </div>

      </div>

    );
  }


  const isGantry =
    type === "Gantries";


  const isPassage =
    type === "Toll Passages";


  return (

    <div className="page">


      {/* ================= HEADER ================= */}

      <div className="page-heading">

        <div>

          <p className="eyebrow">

            {isGantry
              ? "INFRASTRUCTURE"
              : "TOLL OPERATIONS"}

          </p>


          <h1>
            {type}
          </h1>


          <p className="subtitle">

            {isGantry
              ? "Monitor and manage toll gantries."
              : "Record and review toll transactions."}

          </p>

        </div>


        <div className="page-actions">

          <button
            className="refresh-button"
            onClick={loadData}
          >

            <RefreshCw size={16} />

            Refresh

          </button>


          {isGantry && (

            <button
              className="primary-button"
              onClick={() =>
                setShowForm(true)
              }
            >

              <Plus size={17} />

              Add Gantry

            </button>

          )}


          {isPassage && (

            <button
              className="primary-button"
              onClick={() =>
                setShowForm(true)
              }
            >

              <Plus size={17} />

              Record Passage

            </button>

          )}

        </div>

      </div>


      {/* ================= TOLL PASSAGE FORM ================= */}

      {isPassage && showForm && (

        <div className="panel form-panel">

          <div className="panel-header">

            <div>

              <h3>
                Record Toll Passage
              </h3>

              <span>
                Select vehicle, gantry and
                current traffic density.
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
            onSubmit={createPassage}
          >


            {/* VEHICLE */}

            <div className="form-group">

              <label>
                Vehicle
              </label>

              <select
                name="vehicleId"
                value={
                  passageForm.vehicleId
                }
                onChange={
                  handlePassageChange
                }
                required
              >

                <option value="">
                  Select vehicle
                </option>


                {vehicles.map(
                  (vehicle) => (

                    <option
                      key={vehicle.id}
                      value={vehicle.id}
                    >

                      {vehicle.vehicleNumber}
                      {" - "}
                      {vehicle.vehicleClass}

                    </option>

                  )
                )}

              </select>

            </div>


            {/* GANTRY */}

            <GantrySelect
              value={
                passageForm.gantryId
              }
              onChange={
                handlePassageChange
              }
            />


            {/* TRAFFIC */}

            <div className="form-group">

              <label>
                Traffic Density
              </label>

              <select
                name="trafficDensity"
                value={
                  passageForm.trafficDensity
                }
                onChange={
                  handlePassageChange
                }
              >

                <option value="LOW">
                  LOW
                </option>

                <option value="MEDIUM">
                  MEDIUM
                </option>

                <option value="HIGH">
                  HIGH
                </option>

              </select>

            </div>


            <div className="form-info">

              <Activity size={18} />

              <span>
                Toll fee will be calculated
                automatically using the
                vehicle class and traffic
                density.
              </span>

            </div>


            {/* BUTTONS */}

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

                <Receipt size={16} />

                Record Passage

              </button>

            </div>

          </form>

        </div>

      )}


      {/* ================= GANTRY FORM ================= */}

      {isGantry && showForm && (

        <GantryForm
          onClose={() =>
            setShowForm(false)
          }
          onSuccess={loadData}
        />

      )}


      {/* ================= TABLE ================= */}

      <div className="panel">

        <div className="panel-header">

          <div>

            <h3>
              {type} Registry
            </h3>

            <span>
              {data.length} records
            </span>

          </div>

        </div>


        {loading ? (

          <div className="empty-state">
            Loading...
          </div>

        ) : data.length === 0 ? (

          <div className="empty-state">

            <Activity size={35} />

            <p>
              No records found
            </p>

          </div>

        ) : isGantry ? (

          <GantryTable data={data} />

        ) : (

          <PassageTable data={data} />

        )}

      </div>

    </div>

  );
}


/* ================= GANTRY SELECT ================= */

function GantrySelect({
  value,
  onChange,
}) {

  const [gantries, setGantries] =
    useState([]);


  useEffect(() => {

    getGantries()
      .then((response) =>
        setGantries(
          response.data
        )
      )
      .catch((error) =>
        console.error(error)
      );

  }, []);


  return (

    <div className="form-group">

      <label>
        Toll Gantry
      </label>

      <select
        name="gantryId"
        value={value}
        onChange={onChange}
        required
      >

        <option value="">
          Select gantry
        </option>


        {gantries.map(
          (gantry) => (

            <option
              key={gantry.id}
              value={gantry.id}
            >

              {gantry.gantryCode}
              {" - "}
              {gantry.location}

            </option>

          )
        )}

      </select>

    </div>

  );
}


/* ================= GANTRY FORM ================= */

function GantryForm({
  onClose,
  onSuccess,
}) {

  const [form, setForm] =
    useState({
      gantryCode: "",
      location: "",
      zone: "",
      status: "ACTIVE",
    });


  const handleChange = (event) => {

    setForm({
      ...form,
      [event.target.name]:
        event.target.value,
    });

  };


  const submit = async (event) => {

    event.preventDefault();

    try {

      await axios.post(
        "http://localhost:8090/api/tolls/gantries",
        form
      );

      alert(
        "Gantry registered successfully!"
      );

      onClose();

      onSuccess();

    } catch (error) {

      alert(
        error.response?.data?.message ||
        "Failed to register gantry"
      );

    }
  };


  return (

    <div className="panel form-panel">

      <div className="panel-header">

        <div>

          <h3>
            Register New Gantry
          </h3>

          <span>
            Add toll infrastructure.
          </span>

        </div>


        <button
          className="close-button"
          onClick={onClose}
        >

          <X size={18} />

        </button>

      </div>


      <form
        className="vehicle-form"
        onSubmit={submit}
      >

        <div className="form-group">

          <label>
            Gantry Code
          </label>

          <input
            name="gantryCode"
            placeholder="GAN-002"
            value={form.gantryCode}
            onChange={handleChange}
            required
          />

        </div>


        <div className="form-group">

          <label>
            Location
          </label>

          <input
            name="location"
            placeholder="Salem Highway"
            value={form.location}
            onChange={handleChange}
            required
          />

        </div>


        <div className="form-group">

          <label>
            Zone
          </label>

          <select
            name="zone"
            value={form.zone}
            onChange={handleChange}
            required
          >

            <option value="">
              Select zone
            </option>

            <option value="Zone A">
              Zone A
            </option>

            <option value="Zone B">
              Zone B
            </option>

            <option value="Zone C">
              Zone C
            </option>

          </select>

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
            onClick={onClose}
          >
            Cancel
          </button>


          <button
            type="submit"
            className="primary-button"
          >

            <Plus size={16} />

            Register Gantry

          </button>

        </div>

      </form>

    </div>

  );
}


/* ================= GANTRY TABLE ================= */

function GantryTable({ data }) {

  return (

    <div className="vehicle-table">

      <div className="table-header">

        <span>Gantry</span>

        <span>Location</span>

        <span>Zone</span>

        <span>Status</span>

      </div>


      {data.map((gantry) => (

        <div
          className="table-row gantry-row"
          key={gantry.id}
        >

          <div className="vehicle-name">

            <div className="vehicle-icon">

              <RadioTower size={17} />

            </div>

            <div>

              <strong>
                {gantry.gantryCode}
              </strong>

              <span>
                ID #{gantry.id}
              </span>

            </div>

          </div>


          <span>
            {gantry.location || "-"}
          </span>


          <span>
            {gantry.zone || "-"}
          </span>


          <span>

            <b
              className={
                gantry.status === "ACTIVE"
                  ? "status-active"
                  : "status-inactive"
              }
            >

              {gantry.status ||
                "UNKNOWN"}

            </b>

          </span>

        </div>

      ))}

    </div>

  );
}


/* ================= PASSAGE TABLE ================= */

function PassageTable({ data }) {

  return (

    <div className="vehicle-table">

      <div className="table-header">

        <span>
          Vehicle
        </span>

        <span>
          Gantry
        </span>

        <span>
          Traffic
        </span>

        <span>
          Total Fee
        </span>

      </div>


      {data.map((passage) => (

        <div
          className="table-row passage-row"
          key={passage.id}
        >

          <div className="vehicle-name">

            <div className="vehicle-icon">

              <Car size={17} />

            </div>

            <div>

              <strong>

                {passage.vehicle
                  ?.vehicleNumber ||
                  "Unknown"}

              </strong>

              <span>
                Passage #{passage.id}
              </span>

            </div>

          </div>


          <span>

            {passage.gantry
              ?.gantryCode || "-"}

          </span>


          <span>

            {passage.trafficDensity ||
              "-"}

          </span>


          <strong>

            ₹{Number(
              passage.totalFee || 0
            ).toLocaleString("en-IN")}

          </strong>

        </div>

      ))}

    </div>

  );
}


/* ================= METRIC ================= */

function Metric({
  title,
  value,
  icon: Icon,
}) {

  return (

    <div className="metric-card blue">

      <div className="metric-top">

        <div className="metric-icon">

          <Icon size={21} />

        </div>

        <span className="metric-label">
          {title}
        </span>

      </div>

      <div className="metric-value">
        {value}
      </div>

      <div className="metric-subtitle">
        Recorded by system
      </div>

    </div>

  );
}


/* ================= TRAFFIC BAR ================= */

function TrafficBar({
  label,
  value,
  total,
}) {

  const percentage =
    total > 0
      ? Math.round(
          ((value || 0) / total) * 100
        )
      : 0;


  return (

    <div className="traffic-row">

      <div className="traffic-label">

        <span>
          {label}
        </span>

        <strong>
          {value || 0}
        </strong>

      </div>


      <div className="bar-background">

        <div
          className="bar-fill"
          style={{
            width:
              `${percentage}%`,
          }}
        />

      </div>


      <span className="percentage">
        {percentage}%
      </span>

    </div>

  );
}


export default Operations;