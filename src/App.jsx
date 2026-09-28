import { useEffect, useState } from "react";

import {
  LayoutDashboard,
  Car,
  RadioTower,
  Receipt,
  Wallet,
  Wrench,
  BarChart3,
  Settings,
  Bell,
  Search,
  TrendingUp,
  TrendingDown,
  Activity,
  Menu,
} from "lucide-react";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

import {
  getDashboardSummary,
  getTrafficStatistics,
} from "./api";

import Vehicles from "./pages/Vehicles";
import Operations from "./pages/Operations";
import ManagementPages from "./pages/ManagementPages";
import Rates from "./pages/Rates";


function App() {

  const [dashboard, setDashboard] = useState({});
  const [traffic, setTraffic] = useState({});
  const [currentPage, setCurrentPage] =
    useState("Dashboard");


  useEffect(() => {
    loadDashboard();
  }, []);


  const loadDashboard = async () => {

    try {

      const [
        dashboardResponse,
        trafficResponse,
      ] = await Promise.all([
        getDashboardSummary(),
        getTrafficStatistics(),
      ]);

      setDashboard(
        dashboardResponse.data
      );

      setTraffic(
        trafficResponse.data
      );

    } catch (error) {

      console.error(
        "Dashboard loading error:",
        error
      );

    }

  };


  const formatMoney = (value) =>
    `₹${Number(
      value || 0
    ).toLocaleString("en-IN")}`;


  const menuItems = [
    ["Dashboard", LayoutDashboard],
    ["Gantries", RadioTower],
    ["Vehicles", Car],
    ["Toll Passages", Receipt],
    ["Traffic", Activity],
    ["Invoices", Receipt],
    ["Vendor Bills", Receipt],
    ["Payments", Wallet],
    ["Maintenance", Wrench],
    ["Reports", BarChart3],
    ["Rates", Wallet],
  ];


  const renderPage = () => {

    if (currentPage === "Dashboard") {

      return (
        <Dashboard
          dashboard={dashboard}
          traffic={traffic}
          refresh={loadDashboard}
          formatMoney={formatMoney}
        />
      );

    }


    if (currentPage === "Vehicles") {
      return <Vehicles />;
    }


    if (
      currentPage === "Gantries" ||
      currentPage === "Toll Passages" ||
      currentPage === "Traffic"
    ) {

      return (
        <Operations
          type={currentPage}
        />
      );

    }


    if (
      currentPage === "Invoices" ||
      currentPage === "Vendor Bills" ||
      currentPage === "Payments" ||
      currentPage === "Maintenance" ||
      currentPage === "Reports"
    ) {

      return (
        <ManagementPages
          type={currentPage}
        />
      );

    }


    if (currentPage === "Rates") {
      return <Rates />;
    }


    return null;

  };


  return (

    <div className="app">


      {/* SIDEBAR */}

      <aside className="sidebar">

        <div className="logo">

          <div className="logo-icon">
            <RadioTower size={24} />
          </div>

          <div>
            <h2>TrafficX</h2>
            <span>Control Center</span>
          </div>

        </div>


        <div className="menu-title">
          MAIN MENU
        </div>


        <nav>

          {menuItems.map(
            ([name, Icon]) => (

              <div
                key={name}
                className={
                  `menu-item ${
                    currentPage === name
                      ? "active"
                      : ""
                  }`
                }
                onClick={() =>
                  setCurrentPage(name)
                }
              >

                <Icon size={19} />

                <span>
                  {name}
                </span>

              </div>

            )
          )}

        </nav>


        <div className="sidebar-bottom">

          <div className="menu-item">

            <Settings size={19} />

            <span>
              Settings
            </span>

          </div>


          <div className="system-status">

            <div className="status-dot"></div>

            <div>

              <strong>
                System Online
              </strong>

              <span>
                All services operational
              </span>

            </div>

          </div>

        </div>

      </aside>


      {/* MAIN */}

      <main className="main">


        {/* TOPBAR */}

        <header className="topbar">

          <div className="mobile-menu">
            <Menu size={22} />
          </div>


          <div className="search-box">

            <Search size={18} />

            <input
              placeholder="Search system..."
            />

          </div>


          <div className="topbar-right">

            <button className="icon-button">

              <Bell size={20} />

            </button>


            <div className="profile">

              <div className="avatar">
                N
              </div>

              <div className="profile-info">

                <strong>
                  Admin
                </strong>

                <span>
                  Traffic Authority
                </span>

              </div>

            </div>

          </div>

        </header>


        <section className="content">

          {renderPage()}

        </section>


      </main>

    </div>

  );

}


/* ================================================= */
/* ================= DASHBOARD ===================== */
/* ================================================= */

function Dashboard({
  dashboard,
  traffic,
  refresh,
  formatMoney,
}) {


  const financialData = [

    {
      name: "Revenue",
      amount:
        Number(
          dashboard.totalRevenue || 0
        ),
    },

    {
      name: "Expense",
      amount:
        Number(
          dashboard.totalExpense || 0
        ),
    },

    {
      name: "Net",
      amount:
        Number(
          dashboard.netProfitOrLoss || 0
        ),
    },

  ];


  const trafficData = [

    {
      name: "Low",
      value:
        Number(
          traffic.lowTraffic || 0
        ),
    },

    {
      name: "Medium",
      value:
        Number(
          traffic.mediumTraffic || 0
        ),
    },

    {
      name: "High",
      value:
        Number(
          traffic.highTraffic || 0
        ),
    },

  ];


  return (

    <div className="page">


      {/* HEADER */}

      <div className="page-heading">

        <div>

          <p className="eyebrow">
            MUNICIPAL TRAFFIC AUTHORITY
          </p>

          <h1>
            Traffic Dashboard
          </h1>

          <p className="subtitle">
            Real-time overview of urban
            traffic, tolls and financial
            operations.
          </p>

        </div>


        <button
          className="refresh-button"
          onClick={refresh}
        >

          <Activity size={17} />

          Refresh Data

        </button>

      </div>


      {/* FINANCIAL METRICS */}

      <div className="metrics-grid">


        <Metric
          title="Total Revenue"
          value={formatMoney(
            dashboard.totalRevenue
          )}
          icon={TrendingUp}
          type="green"
        />


        <Metric
          title="Total Expenses"
          value={formatMoney(
            dashboard.totalExpense
          )}
          icon={TrendingDown}
          type="red"
        />


        <Metric
          title="Net Profit / Loss"
          value={formatMoney(
            dashboard.netProfitOrLoss
          )}
          icon={Wallet}
          type="blue"
        />


        <Metric
          title="Unpaid Vendor Bills"
          value={
            dashboard.unpaidVendorBills ||
            0
          }
          icon={Receipt}
          type="orange"
        />

      </div>


      {/* SMALL STATS */}

      <div className="small-stats">


        <Stat
          title="Gantries"
          value={
            dashboard.totalGantries
          }
          icon={RadioTower}
        />


        <Stat
          title="Vehicles"
          value={
            dashboard.totalVehicles
          }
          icon={Car}
        />


        <Stat
          title="Toll Passages"
          value={
            dashboard.totalTollPassages
          }
          icon={Receipt}
        />


        <Stat
          title="Traffic Events"
          value={
            traffic.totalPassages
          }
          icon={Activity}
        />

      </div>


      {/* CHARTS */}

      <div className="dashboard-chart-grid">


        {/* FINANCIAL CHART */}

        <div className="panel chart-panel">


          <div className="panel-header">

            <div>

              <h3>
                Financial Overview
              </h3>

              <span>
                Current revenue and expense
                summary
              </span>

            </div>

          </div>


          <div className="chart-container">

            <ResponsiveContainer
              width="100%"
              height={300}
            >

              <BarChart
                data={financialData}
              >

                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="rgba(255,255,255,0.08)"
                />

                <XAxis
                  dataKey="name"
                  stroke="#8b93a7"
                />

                <YAxis
                  stroke="#8b93a7"
                />

                <Tooltip
                  formatter={(value) =>
                    `₹${Number(
                      value
                    ).toLocaleString(
                      "en-IN"
                    )}`
                  }
                  contentStyle={{
                    background:
                      "#151a25",
                    border:
                      "1px solid #2b3242",
                    borderRadius:
                      "10px",
                    color: "#fff",
                  }}
                />

                <Bar
                  dataKey="amount"
                  radius={[
                    8,
                    8,
                    0,
                    0,
                  ]}
                  fill="#6c63ff"
                />

              </BarChart>

            </ResponsiveContainer>

          </div>

        </div>


        {/* TRAFFIC CHART */}

        <div className="panel chart-panel">


          <div className="panel-header">

            <div>

              <h3>
                Traffic Distribution
              </h3>

              <span>
                Toll passage density
              </span>

            </div>


            <div className="live-badge">

              <span></span>

              LIVE

            </div>

          </div>


          <div className="chart-container">

            <ResponsiveContainer
              width="100%"
              height={300}
            >

              <PieChart>

                <Pie
                  data={trafficData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="45%"
                  outerRadius={100}
                  label
                >

                  <Cell fill="#35d07f" />

                  <Cell fill="#f4b942" />

                  <Cell fill="#ff5d73" />

                </Pie>


                <Tooltip
                  contentStyle={{
                    background:
                      "#151a25",
                    border:
                      "1px solid #2b3242",
                    borderRadius:
                      "10px",
                    color: "#fff",
                  }}
                />


                <Legend />

              </PieChart>

            </ResponsiveContainer>

          </div>

        </div>

      </div>


      {/* LOWER SECTION */}

      <div className="dashboard-grid">


        {/* TRAFFIC BARS */}

        <div className="panel">

          <div className="panel-header">

            <div>

              <h3>
                Traffic Density
              </h3>

              <span>
                Current passage distribution
              </span>

            </div>

          </div>


          <TrafficBar
            label="Low Traffic"
            value={
              traffic.lowTraffic
            }
            total={
              traffic.totalPassages
            }
          />


          <TrafficBar
            label="Medium Traffic"
            value={
              traffic.mediumTraffic
            }
            total={
              traffic.totalPassages
            }
          />


          <TrafficBar
            label="High Traffic"
            value={
              traffic.highTraffic
            }
            total={
              traffic.totalPassages
            }
          />

        </div>


        {/* SYSTEM OVERVIEW */}

        <div className="panel">

          <div className="panel-header">

            <div>

              <h3>
                System Overview
              </h3>

              <span>
                Infrastructure status
              </span>

            </div>

          </div>


          <Overview
            label="Toll Gantries"
            value={
              dashboard.totalGantries ||
              0
            }
          />


          <Overview
            label="Registered Vehicles"
            value={
              dashboard.totalVehicles ||
              0
            }
          />


          <Overview
            label="Toll Transactions"
            value={
              dashboard.totalTollPassages ||
              0
            }
          />


          <Overview
            label="Unpaid Vendor Bills"
            value={
              dashboard.unpaidVendorBills ||
              0
            }
          />

        </div>

      </div>

    </div>

  );

}


/* ================================================= */
/* ================= METRIC ======================== */
/* ================================================= */

function Metric({
  title,
  value,
  icon: Icon,
  type,
}) {

  return (

    <div
      className={`metric-card ${type}`}
    >

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

        Live system data

      </div>

    </div>

  );

}


/* ================================================= */
/* ================= STAT ========================== */
/* ================================================= */

function Stat({
  title,
  value,
  icon: Icon,
}) {

  return (

    <div className="stat-box">

      <div className="stat-icon">

        <Icon size={20} />

      </div>


      <div>

        <span>
          {title}
        </span>

        <strong>
          {value || 0}
        </strong>

      </div>

    </div>

  );

}


/* ================================================= */
/* ================ TRAFFIC BAR ==================== */
/* ================================================= */

function TrafficBar({
  label,
  value,
  total,
}) {

  const percentage =
    total > 0
      ? Math.round(
          ((value || 0) / total) *
            100
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


/* ================================================= */
/* ================= OVERVIEW ====================== */
/* ================================================= */

function Overview({
  label,
  value,
}) {

  return (

    <div className="overview-row">

      <span>
        {label}
      </span>

      <strong>
        {value}
      </strong>

    </div>

  );

}


export default App;