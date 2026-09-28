import { useEffect, useState } from "react";
import {
  CircleDollarSign,
  RefreshCw,
  Save,
  Activity,
} from "lucide-react";

import {
  getTollRates,
  getCongestionRates,
  updateTollRate,
  updateCongestionRate,
} from "../api";


function Rates() {

  const [tollRates, setTollRates] = useState([]);
  const [congestionRates, setCongestionRates] =
    useState([]);

  const [loading, setLoading] = useState(true);


  const loadRates = async () => {

    try {

      setLoading(true);

      const [
        tollResponse,
        congestionResponse,
      ] = await Promise.all([
        getTollRates(),
        getCongestionRates(),
      ]);

      setTollRates(
        tollResponse.data
      );

      setCongestionRates(
        congestionResponse.data
      );

    } catch (error) {

      console.error(
        "Rates loading error:",
        error
      );

    } finally {

      setLoading(false);

    }
  };


  useEffect(() => {
    loadRates();
  }, []);


  const saveTollRate = async (
    vehicleClass,
    value
  ) => {

    try {

      await updateTollRate(
        vehicleClass,
        value
      );

      alert(
        `${vehicleClass} toll rate updated`
      );

      loadRates();

    } catch (error) {

      console.error(error);

      alert(
        "Failed to update toll rate"
      );

    }
  };


  const saveCongestionRate = async (
    density,
    value
  ) => {

    try {

      await updateCongestionRate(
        density,
        value
      );

      alert(
        `${density} congestion rate updated`
      );

      loadRates();

    } catch (error) {

      console.error(error);

      alert(
        "Failed to update congestion rate"
      );

    }
  };


  return (

    <div className="page">

      {/* HEADER */}

      <div className="page-heading">

        <div>

          <p className="eyebrow">
            PRICING CONTROL
          </p>

          <h1>
            Toll & Congestion Rates
          </h1>

          <p className="subtitle">
            Configure dynamic toll pricing
            for the traffic authority.
          </p>

        </div>


        <button
          className="refresh-button"
          onClick={loadRates}
        >

          <RefreshCw size={16} />

          Refresh

        </button>

      </div>


      {loading ? (

        <div className="panel">

          <div className="empty-state">
            Loading rates...
          </div>

        </div>

      ) : (

        <>

          {/* TOLL RATES */}

          <div className="panel">

            <div className="panel-header">

              <div>

                <h3>
                  Vehicle Toll Rates
                </h3>

                <span>
                  Base toll amount by
                  vehicle class
                </span>

              </div>

              <div className="stat-icon">

                <CircleDollarSign
                  size={20}
                />

              </div>

            </div>


            <div className="rate-grid">

              {tollRates.map(
                (rate) => (

                  <RateCard
                    key={rate.id}
                    title={
                      rate.vehicleClass
                    }
                    value={
                      rate.baseRate
                    }
                    prefix="₹"
                    onSave={
                      saveTollRate
                    }
                  />

                )
              )}

            </div>

          </div>


          {/* CONGESTION */}

          <div className="panel rate-panel">

            <div className="panel-header">

              <div>

                <h3>
                  Congestion Multipliers
                </h3>

                <span>
                  Additional pricing based
                  on traffic density
                </span>

              </div>

              <div className="stat-icon">

                <Activity size={20} />

              </div>

            </div>


            <div className="rate-grid">

              {congestionRates.map(
                (rate) => (

                  <CongestionCard
                    key={rate.id}
                    density={
                      rate.trafficDensity
                    }
                    value={
                      rate.multiplier
                    }
                    onSave={
                      saveCongestionRate
                    }
                  />

                )
              )}

            </div>

          </div>

        </>

      )}

    </div>

  );
}


/* ================= TOLL CARD ================= */

function RateCard({
  title,
  value,
  prefix,
  onSave,
}) {

  const [amount, setAmount] =
    useState(value);


  return (

    <div className="rate-card">

      <div className="rate-card-top">

        <div className="rate-icon">

          <CircleDollarSign
            size={20}
          />

        </div>

        <span>
          {title}
        </span>

      </div>


      <label>
        Base Rate
      </label>


      <div className="rate-input">

        <span>
          {prefix}
        </span>

        <input
          type="number"
          min="0"
          value={amount}
          onChange={(e) =>
            setAmount(
              e.target.value
            )
          }
        />

      </div>


      <button
        className="primary-button"
        onClick={() =>
          onSave(
            title,
            amount
          )
        }
      >

        <Save size={15} />

        Save Rate

      </button>

    </div>

  );
}


/* ================= CONGESTION CARD ================= */

function CongestionCard({
  density,
  value,
  onSave,
}) {

  const [multiplier, setMultiplier] =
    useState(value);


  return (

    <div className="rate-card">

      <div className="rate-card-top">

        <div className="rate-icon">

          <Activity size={20} />

        </div>

        <span>
          {density}
        </span>

      </div>


      <label>
        Multiplier
      </label>


      <div className="rate-input">

        <span>
          ×
        </span>

        <input
          type="number"
          min="0"
          step="0.05"
          value={multiplier}
          onChange={(e) =>
            setMultiplier(
              e.target.value
            )
          }
        />

      </div>


      <button
        className="primary-button"
        onClick={() =>
          onSave(
            density,
            multiplier
          )
        }
      >

        <Save size={15} />

        Save Rate

      </button>

    </div>

  );
}


export default Rates;