import { useEffect, useState } from "react";

import {
  Receipt,
  Wallet,
  Wrench,
  BarChart3,
  RefreshCw,
  Plus,
  X,
} from "lucide-react";

import {
  getInvoices,
  getPayments,
  getMaintenance,
  getProfitLoss,
  getBudgetReport,
  getBalanceSheet,
  getGantries,
  getVendors,
  getVendorBills,
  createPayment,
} from "../api";

import axios from "axios";


function ManagementPages({ type }) {

  const [data, setData] = useState([]);
  const [report, setReport] = useState(null);

  const [gantries, setGantries] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [vendorBills, setVendorBills] = useState([]);

  const [loading, setLoading] = useState(true);

  const [showMaintenanceForm, setShowMaintenanceForm] =
    useState(false);

  const [showPaymentForm, setShowPaymentForm] =
    useState(false);


  const [maintenanceForm, setMaintenanceForm] =
    useState({
      maintenanceNumber: "",
      description: "",
      cost: "",
      status: "PENDING",
      gantryId: "",
      vendorId: "",
    });


  const [paymentForm, setPaymentForm] =
    useState({
      paymentNumber: "",
      amount: "",
      vendorBillId: "",
    });


  /* ================= LOAD DATA ================= */

  const loadData = async () => {

    try {

      setLoading(true);

      setData([]);
      setReport(null);


      if (type === "Invoices") {

        const response =
          await getInvoices();

        setData(response.data);
      }


      if (type === "Payments") {

        const [
          paymentResponse,
          billResponse,
        ] = await Promise.all([
          getPayments(),
          getVendorBills(),
        ]);

        setData(
          paymentResponse.data
        );

        setVendorBills(
          billResponse.data
        );
      }


      if (type === "Maintenance") {

        const [
          maintenanceResponse,
          gantryResponse,
          vendorResponse,
        ] = await Promise.all([
          getMaintenance(),
          getGantries(),
          getVendors(),
        ]);

        setData(
          maintenanceResponse.data
        );

        setGantries(
          gantryResponse.data
        );

        setVendors(
          vendorResponse.data
        );
      }


      if (type === "Reports") {

        const [
          profitLoss,
          budget,
          balanceSheet,
        ] = await Promise.all([
          getProfitLoss(),
          getBudgetReport(),
          getBalanceSheet(),
        ]);

        setReport({
          profitLoss: profitLoss.data,
          budget: budget.data,
          balanceSheet: balanceSheet.data,
        });
      }

    } catch (error) {

      console.error(
        `${type} loading error:`,
        error
      );

    } finally {

      setLoading(false);

    }
  };


  useEffect(() => {

    setShowMaintenanceForm(false);
    setShowPaymentForm(false);

    loadData();

  }, [type]);


  /* ================= PAYMENT ================= */

  const handlePaymentChange = (
    event
  ) => {

    const {
      name,
      value,
    } = event.target;

    setPaymentForm({
      ...paymentForm,
      [name]: value,
    });

  };


  const selectVendorBill = (
    event
  ) => {

    const billId =
      event.target.value;

    const selectedBill =
      vendorBills.find(
        (bill) =>
          String(bill.id) ===
          String(billId)
      );


    setPaymentForm({
      ...paymentForm,

      vendorBillId: billId,

      amount:
        selectedBill
          ? selectedBill.amount
          : "",
    });

  };


  const submitPayment = async (
    event
  ) => {

    event.preventDefault();

    try {

      if (!paymentForm.vendorBillId) {

        alert(
          "Please select a vendor bill."
        );

        return;
      }


      await createPayment({

        paymentNumber:
          paymentForm.paymentNumber,

        amount: Number(
          paymentForm.amount
        ),

        vendorBill: {
          id: Number(
            paymentForm.vendorBillId
          ),
        },

      });


      alert(
        "Payment recorded successfully!"
      );


      setPaymentForm({
        paymentNumber: "",
        amount: "",
        vendorBillId: "",
      });


      setShowPaymentForm(false);

      loadData();

    } catch (error) {

      console.error(
        "Payment error:",
        error
      );

      alert(
        error.response?.data?.message ||
        "Failed to record payment"
      );

    }

  };


  /* ================= MAINTENANCE ================= */

  const handleMaintenanceChange = (
    event
  ) => {

    const {
      name,
      value,
    } = event.target;

    setMaintenanceForm({
      ...maintenanceForm,
      [name]: value,
    });

  };


  const createMaintenanceRecord = async (
    event
  ) => {

    event.preventDefault();

    try {

      await axios.post(
        "http://localhost:8090/api/maintenance",
        {
          maintenanceNumber:
            maintenanceForm.maintenanceNumber,

          description:
            maintenanceForm.description,

          cost: Number(
            maintenanceForm.cost
          ),

          status:
            maintenanceForm.status,

          gantry: {
            id: Number(
              maintenanceForm.gantryId
            ),
          },

          vendor: {
            id: Number(
              maintenanceForm.vendorId
            ),
          },
        }
      );


      alert(
        "Maintenance created successfully!"
      );


      setMaintenanceForm({
        maintenanceNumber: "",
        description: "",
        cost: "",
        status: "PENDING",
        gantryId: "",
        vendorId: "",
      });


      setShowMaintenanceForm(false);

      loadData();

    } catch (error) {

      console.error(error);

      alert(
        error.response?.data?.message ||
        "Failed to create maintenance"
      );

    }

  };


  /* ================= REPORTS ================= */

  if (type === "Reports") {

    return (

      <div className="page">

        <PageHeading
          title="Financial Reports"
          subtitle="Municipal financial and operational reporting."
          eyebrow="FINANCIAL CONTROL"
          refresh={loadData}
        />

        {loading ? (

          <div className="panel">

            <div className="empty-state">
              Loading reports...
            </div>

          </div>

        ) : (

          <div className="dashboard-grid">

            <ReportCard
              title="Profit & Loss"
              icon={BarChart3}
              data={report?.profitLoss}
            />

            <ReportCard
              title="Budget Report"
              icon={BarChart3}
              data={report?.budget}
            />

            <ReportCard
              title="Balance Sheet"
              icon={Wallet}
              data={report?.balanceSheet}
            />

          </div>

        )}

      </div>

    );
  }


  const Icon =
    type === "Invoices"
      ? Receipt
      : type === "Payments"
        ? Wallet
        : Wrench;


  return (

    <div className="page">

      {/* ================= HEADER ================= */}

      <div className="page-heading">

        <div>

          <p className="eyebrow">
            TRAFFICX MANAGEMENT
          </p>

          <h1>
            {type}
          </h1>

          <p className="subtitle">
            Manage {type.toLowerCase()}
            records and operations.
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


          {type === "Maintenance" && (

            <button
              className="primary-button"
              onClick={() =>
                setShowMaintenanceForm(true)
              }
            >

              <Plus size={17} />

              Add Maintenance

            </button>

          )}


          {type === "Payments" && (

            <button
              className="primary-button"
              onClick={() =>
                setShowPaymentForm(true)
              }
            >

              <Plus size={17} />

              Record Payment

            </button>

          )}

        </div>

      </div>


      {/* ================= PAYMENT FORM ================= */}

      {type === "Payments" &&
        showPaymentForm && (

        <div className="panel form-panel">

          <div className="panel-header">

            <div>

              <h3>
                Record Vendor Payment
              </h3>

              <span>
                Select an unpaid vendor bill
                and record its payment.
              </span>

            </div>


            <button
              className="close-button"
              onClick={() =>
                setShowPaymentForm(false)
              }
            >

              <X size={18} />

            </button>

          </div>


          <form
            className="vehicle-form"
            onSubmit={submitPayment}
          >

            <div className="form-group">

              <label>
                Payment Number
              </label>

              <input
                name="paymentNumber"
                placeholder="PAY-002"
                value={
                  paymentForm.paymentNumber
                }
                onChange={
                  handlePaymentChange
                }
                required
              />

            </div>


            <div className="form-group">

              <label>
                Vendor Bill
              </label>

              <select
                name="vendorBillId"
                value={
                  paymentForm.vendorBillId
                }
                onChange={
                  selectVendorBill
                }
                required
              >

                <option value="">
                  Select unpaid bill
                </option>


                {vendorBills
                  .filter(
                    (bill) =>
                      bill.status !== "PAID"
                  )
                  .map((bill) => (

                    <option
                      key={bill.id}
                      value={bill.id}
                    >

                      {bill.billNumber}
                      {" - ₹"}
                      {Number(
                        bill.amount || 0
                      ).toLocaleString(
                        "en-IN"
                      )}

                    </option>

                  ))}

              </select>

            </div>


            <div className="form-group">

              <label>
                Payment Amount
              </label>

              <input
                type="number"
                name="amount"
                min="0"
                value={
                  paymentForm.amount
                }
                onChange={
                  handlePaymentChange
                }
                required
              />

            </div>


            <div className="form-info">

              <Wallet size={18} />

              <span>
                After submission, the selected
                vendor bill will be marked PAID
                and an expense ledger entry
                will be created automatically.
              </span>

            </div>


            <div className="form-actions">

              <button
                type="button"
                className="cancel-button"
                onClick={() =>
                  setShowPaymentForm(false)
                }
              >

                Cancel

              </button>


              <button
                type="submit"
                className="primary-button"
              >

                <Wallet size={16} />

                Record Payment

              </button>

            </div>

          </form>

        </div>

      )}


      {/* ================= MAINTENANCE FORM ================= */}

      {type === "Maintenance" &&
        showMaintenanceForm && (

        <div className="panel form-panel">

          <div className="panel-header">

            <div>

              <h3>
                Create Maintenance Record
              </h3>

              <span>
                Register gantry maintenance
                and vendor cost.
              </span>

            </div>


            <button
              className="close-button"
              onClick={() =>
                setShowMaintenanceForm(false)
              }
            >

              <X size={18} />

            </button>

          </div>


          <form
            className="vehicle-form"
            onSubmit={
              createMaintenanceRecord
            }
          >

            <div className="form-group">

              <label>
                Maintenance Number
              </label>

              <input
                name="maintenanceNumber"
                placeholder="MNT-002"
                value={
                  maintenanceForm
                    .maintenanceNumber
                }
                onChange={
                  handleMaintenanceChange
                }
                required
              />

            </div>


            <div className="form-group">

              <label>
                Description
              </label>

              <input
                name="description"
                placeholder="Gantry sensor maintenance"
                value={
                  maintenanceForm.description
                }
                onChange={
                  handleMaintenanceChange
                }
                required
              />

            </div>


            <div className="form-group">

              <label>
                Maintenance Cost
              </label>

              <input
                type="number"
                name="cost"
                min="0"
                placeholder="7500"
                value={
                  maintenanceForm.cost
                }
                onChange={
                  handleMaintenanceChange
                }
                required
              />

            </div>


            <div className="form-group">

              <label>
                Gantry
              </label>

              <select
                name="gantryId"
                value={
                  maintenanceForm.gantryId
                }
                onChange={
                  handleMaintenanceChange
                }
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


            <div className="form-group">

              <label>
                Vendor
              </label>

              <select
                name="vendorId"
                value={
                  maintenanceForm.vendorId
                }
                onChange={
                  handleMaintenanceChange
                }
                required
              >

                <option value="">
                  Select vendor
                </option>


                {vendors.map(
                  (vendor) => (

                    <option
                      key={vendor.id}
                      value={vendor.id}
                    >

                      {vendor.name}

                    </option>

                  )
                )}

              </select>

            </div>


            <div className="form-group">

              <label>
                Status
              </label>

              <select
                name="status"
                value={
                  maintenanceForm.status
                }
                onChange={
                  handleMaintenanceChange
                }
              >

                <option value="PENDING">
                  PENDING
                </option>

                <option value="IN_PROGRESS">
                  IN PROGRESS
                </option>

                <option value="COMPLETED">
                  COMPLETED
                </option>

              </select>

            </div>


            <div className="form-actions">

              <button
                type="button"
                className="cancel-button"
                onClick={() =>
                  setShowMaintenanceForm(false)
                }
              >

                Cancel

              </button>


              <button
                type="submit"
                className="primary-button"
              >

                <Plus size={16} />

                Create Maintenance

              </button>

            </div>

          </form>

        </div>

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

            <Icon size={40} />

            <p>
              No records found
            </p>

          </div>

        ) : (

          <div className="vehicle-table">

            <div className="table-header">

              <span>
                Reference
              </span>

              <span>
                Amount
              </span>

              <span>
                Status
              </span>

              <span>
                Details
              </span>

            </div>


            {data.map((item) => (

              <div
                className="table-row"
                key={item.id}
              >

                <div className="vehicle-name">

                  <div className="vehicle-icon">
                    <Icon size={17} />
                  </div>

                  <div>

                    <strong>
                      {getReference(
                        item,
                        type
                      )}
                    </strong>

                    <span>
                      ID #{item.id}
                    </span>

                  </div>

                </div>


                <strong>
                  ₹{Number(
                    item.amount ||
                    item.cost ||
                    0
                  ).toLocaleString(
                    "en-IN"
                  )}
                </strong>


                <span>

                  <b
                    className={
                      item.status === "PAID" ||
                      item.status === "COMPLETED"
                        ? "status-active"
                        : "status-inactive"
                    }
                  >

                    {item.status ||
                      "PENDING"}

                  </b>

                </span>


                <span>
                  {getDetails(
                    item,
                    type
                  )}
                </span>

              </div>

            ))}

          </div>

        )}

      </div>

    </div>

  );
}


/* ================= PAGE HEADING ================= */

function PageHeading({
  title,
  subtitle,
  eyebrow,
  refresh,
}) {

  return (

    <div className="page-heading">

      <div>

        <p className="eyebrow">
          {eyebrow}
        </p>

        <h1>
          {title}
        </h1>

        <p className="subtitle">
          {subtitle}
        </p>

      </div>


      <button
        className="refresh-button"
        onClick={refresh}
      >

        <RefreshCw size={16} />

        Refresh

      </button>

    </div>

  );
}


/* ================= REFERENCE ================= */

function getReference(
  item,
  type
) {

  if (type === "Invoices")
    return item.invoiceNumber ||
      `INV-${item.id}`;

  if (type === "Payments")
    return item.paymentNumber ||
      `PAY-${item.id}`;

  if (type === "Maintenance")
    return item.maintenanceNumber ||
      `MNT-${item.id}`;

  return `REC-${item.id}`;
}


/* ================= DETAILS ================= */

function getDetails(
  item,
  type
) {

  if (type === "Invoices") {

    return (
      item.fleetOperator?.name ||
      "Fleet Operator"
    );

  }


  if (type === "Payments") {

    return (
      item.vendorBill?.billNumber ||
      "Payment transaction"
    );

  }


  if (type === "Maintenance") {

    return (
      <>
        {item.gantry?.gantryCode ||
          "Gantry"}

        {" • "}

        {item.vendor?.name ||
          "Vendor"}
      </>
    );

  }


  return "-";
}


/* ================= REPORT CARD ================= */

function ReportCard({
  title,
  icon: Icon,
  data,
}) {

  return (

    <div className="panel">

      <div className="panel-header">

        <div>

          <h3>
            {title}
          </h3>

          <span>
            Financial report
          </span>

        </div>


        <div className="stat-icon">
          <Icon size={20} />
        </div>

      </div>


      <div className="report-data">

        {data &&
          Object.entries(data)
            .slice(0, 8)
            .map(
              ([key, value]) => (

                <div
                  className="overview-row"
                  key={key}
                >

                  <span>
                    {formatKey(key)}
                  </span>

                  <strong>

                    {typeof value ===
                      "number"

                      ? `₹${value.toLocaleString(
                          "en-IN"
                        )}`

                      : String(value)}

                  </strong>

                </div>

              )
            )}

      </div>

    </div>

  );
}


function formatKey(key) {

  return key
    .replace(
      /([A-Z])/g,
      " $1"
    )
    .replace(
      /^./,
      (char) =>
        char.toUpperCase()
    );

}


export default ManagementPages;