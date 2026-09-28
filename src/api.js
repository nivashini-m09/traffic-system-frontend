import axios from "axios";


const API = axios.create({
  baseURL: "http://localhost:8090/api",
});


/* ================= DASHBOARD ================= */

export const getDashboardSummary = () =>
  API.get("/dashboard/summary");


export const getTrafficStatistics = () =>
  API.get("/traffic/statistics");


/* ================= REPORTS ================= */

export const getProfitLoss = () =>
  API.get("/reports/profit-loss");


export const getBudgetReport = () =>
  API.get("/reports/budget");


export const getBalanceSheet = () =>
  API.get("/reports/balance-sheet");


/* ================= VEHICLES ================= */

export const getVehicles = () =>
  API.get("/vehicles");


export const createVehicle = (vehicle) =>
  API.post("/vehicles", vehicle);


/* ================= GANTRIES ================= */

export const getGantries = () =>
  API.get("/tolls/gantries");


export const createGantry = (gantry) =>
  API.post("/tolls/gantries", gantry);


/* ================= TOLL PASSAGES ================= */

export const getTollPassages = () =>
  API.get("/tolls/passages");


export const createTollPassage = (passage) =>
  API.post("/tolls/passages", passage);


/* ================= TOLL RATES ================= */

export const getTollRates = () =>
  API.get("/toll-rates");


export const updateTollRate = (
  vehicleClass,
  baseRate
) =>
  API.put(
    `/toll-rates/${vehicleClass}`,
    {
      baseRate: Number(baseRate),
    }
  );


/* ================= CONGESTION RATES ================= */

export const getCongestionRates = () =>
  API.get("/congestion-rates");


export const updateCongestionRate = (
  trafficDensity,
  multiplier
) =>
  API.put(
    `/congestion-rates/${trafficDensity}`,
    {
      multiplier: Number(multiplier),
    }
  );


/* ================= INVOICES ================= */

export const getInvoices = () =>
  API.get("/invoices");


/* ================= FLEET OPERATORS ================= */

export const getFleetOperators = () =>
  API.get("/fleet/operators");


export const createFleetOperator = (
  operator
) =>
  API.post(
    "/fleet/operators",
    operator
  );


/* ================= VENDORS ================= */

export const getVendors = () =>
  API.get("/vendors");


export const createVendor = (vendor) =>
  API.post("/vendors", vendor);


/* ================= VENDOR BILLS ================= */

export const getVendorBills = () =>
  API.get("/vendor-bills");


/* ================= PAYMENTS ================= */

export const getPayments = () =>
  API.get("/payments");


export const createPayment = (payment) =>
  API.post("/payments", payment);


/* ================= MAINTENANCE ================= */

export const getMaintenance = () =>
  API.get("/maintenance");


export const createMaintenance = (
  maintenance
) =>
  API.post(
    "/maintenance",
    maintenance
  );


/* ================= DEFAULT API ================= */

export default API;