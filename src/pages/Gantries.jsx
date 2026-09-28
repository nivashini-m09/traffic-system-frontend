import { useEffect, useState } from "react";
import {
  RadioTower,
  RefreshCw,
  Search,
} from "lucide-react";

import { getGantries } from "../api";


function Gantries() {

  const [gantries, setGantries] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);


  const loadGantries = async () => {

    try {

      setLoading(true);

      const response =
        await getGantries();

      setGantries(response.data);

    } catch (error) {

      console.error(
        "Gantry loading error:",
        error
      );

    } finally {

      setLoading(false);

    }
  };


  useEffect(() => {
    loadGantries();
  }, []);


  const filteredGantries =
    gantries.filter((gantry) =>
      gantry.gantryCode
        ?.toLowerCase()
        .includes(search.toLowerCase())
    );


  return (

    <div className="page">

      <div className="page-heading">

        <div>

          <p className="eyebrow">
            INFRASTRUCTURE MANAGEMENT
          </p>

          <h1>
            Toll Gantries
          </h1>

          <p className="subtitle">
            Monitor and manage municipal toll gantries.
          </p>

        </div>


        <button
          className="refresh-button"
          onClick={loadGantries}
        >

          <RefreshCw size={16} />

          Refresh

        </button>

      </div>


      <div className="panel">

        <div className="panel-header">

          <div>

            <h3>
              Gantry Registry
            </h3>

            <span>
              {gantries.length} gantries configured
            </span>

          </div>


          <div className="search-box">

            <Search size={17} />

            <input
              placeholder="Search gantry..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

          </div>

        </div>


        {loading ? (

          <div className="empty-state">
            Loading gantries...
          </div>

        ) : filteredGantries.length === 0 ? (

          <div className="empty-state">

            <RadioTower size={35} />

            <p>
              No gantries found
            </p>

          </div>

        ) : (

          <div className="vehicle-table">

            <div className="table-header">

              <span>
                Gantry
              </span>

              <span>
                Location
              </span>

              <span>
                Zone
              </span>

              <span>
                Status
              </span>

            </div>


            {filteredGantries.map(
              (gantry) => (

                <div
                  className="table-row"
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
                      {gantry.status || "UNKNOWN"}
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


export default Gantries;