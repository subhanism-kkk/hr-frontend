import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Edit3,
  Layers,
  Save,
  Calendar,
  FileText,
  AlertCircle,
  Loader2,
} from "lucide-react";

import { getOrderDetails, updateOrder } from "../api/orderApi";

import AppointmentForm from "../components/order/AppointmentForm";
import DismissalForm from "../components/order/DismissalForm";
import LeaveForm from "../components/order/LeaveForm";
import PromotionForm from "../components/order/PromotionForm";
import SalaryForm from "../components/order/SalaryForm";
import TransferForm from "../components/order/TransferForm";
import BonusForm from "../components/order/BonusForm";
import StaffingPlanForm from "../components/order/StaffingPlanForm";
import StructureForm from "../components/order/StructureForm";

const getTodayLocalDate = () => {
  const date = new Date();
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

/**
 * Recursively normalizes nested backend entities so inputs relying on
 * entity IDs (e.g. personId, leaveTypeId) or original objects can bind smoothly.
 */
const normalizeFormData = (obj) => {
  if (!obj || typeof obj !== "object" || Array.isArray(obj)) {
    return obj;
  }

  const result = { ...obj };

  Object.entries(obj).forEach(([key, val]) => {
    if (val && typeof val === "object" && !Array.isArray(val)) {
      // Recursively process deeper objects first
      const processedNestedObj = normalizeFormData(val);
      result[key] = processedNestedObj;

      // Extract 'id' to create corresponding '*Id' property (e.g. person -> personId)
      if ("id" in processedNestedObj && processedNestedObj.id !== undefined) {
        const idKey = `${key}Id`;
        if (result[idKey] === undefined || result[idKey] === null) {
          result[idKey] = processedNestedObj.id;
        }
      }
    }
  });

  return result;
};

export default function OrderEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [orderDate, setOrderDate] = useState("");
  const [data, setData] = useState({});

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const today = getTodayLocalDate();

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const response = await getOrderDetails(id);
        setOrder(response);

        if (response.orderDate) {
          setOrderDate(response.orderDate);
        }

        // Extract sub-form data array or object
        const rawSubData =
          Array.isArray(response.data) && response.data.length > 0
            ? response.data[0]
            : response.data || {};

        // Recursively normalize sub-form data
        const normalizedData = normalizeFormData(rawSubData);

        setData(normalizedData);
      } catch (error) {
        console.error("Failed to fetch order details:", error);
        setErrorMessage("Failed to load order details for editing.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchOrder();
    }
  }, [id]);

  const handleDataChange = (newData) => {
    setData(newData || {});
  };

  const getOrderTypeCode = () => {
    return order?.orderType?.code || order?.orderTypeCode || "";
  };

  const getOrderTypeName = () => {
    return (
      order?.orderType?.name || order?.orderTypeName || getOrderTypeCode()
    );
  };

  const renderOrderForm = () => {
    const code = getOrderTypeCode();

    switch (code) {
      case "APT":
        return <AppointmentForm value={data} onChange={handleDataChange} />;
      case "DIS":
        return <DismissalForm value={data} onChange={handleDataChange} />;
      case "LEV":
        return <LeaveForm value={data} onChange={handleDataChange} />;
      case "PRO":
        return <PromotionForm value={data} onChange={handleDataChange} />;
      case "SAL":
        return <SalaryForm value={data} onChange={handleDataChange} />;
      case "TRF":
        return <TransferForm value={data} onChange={handleDataChange} />;
      case "BNS":
        return <BonusForm value={data} onChange={handleDataChange} />;
      case "STF":
        return <StaffingPlanForm value={data} onChange={handleDataChange} />;
      case "STR":
        return <StructureForm value={data} onChange={handleDataChange} />;
      default:
        return (
          <div className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
            <AlertCircle size={18} className="shrink-0 text-amber-600" />
            <span>
              Unsupported order type: <strong>{code || "Unknown"}</strong>
            </span>
          </div>
        );
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!orderDate) {
      alert("Please select an order date.");
      return;
    }

    if (orderDate > today) {
      alert("Order date cannot be in the future.");
      return;
    }

    if (!data || Object.keys(data).length === 0) {
      alert("Please fill in the required order details.");
      return;
    }

    try {
      setSubmitting(true);

      const payload = {
        orderDate,
        data: [data],
      };

      await updateOrder(id, payload);
      navigate("/orders");
    } catch (error) {
      console.error("Failed to update order:", error);
      const responseData = error?.response?.data;
      let message = responseData?.message || responseData?.error;

      if (!message && responseData && typeof responseData === "object") {
        const validationMessages = Object.values(responseData).filter(
          (value) => typeof value === "string"
        );
        if (validationMessages.length > 0) {
          message = validationMessages.join("\n");
        }
      }

      alert(message || "Failed to update order.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center text-sm font-medium text-slate-500">
        <div className="flex items-center gap-2">
          <Loader2 className="animate-spin text-indigo-600" size={20} />
          Loading order details...
        </div>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="mx-auto max-w-4xl space-y-4 pt-8">
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {errorMessage}
        </div>
        <button
          onClick={() => navigate("/orders")}
          className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 shadow-2xs hover:bg-slate-50"
        >
          <ArrowLeft size={14} /> Back to Orders
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 pb-12">
      <div className="border-b border-slate-200 pb-5">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate("/orders")}
            disabled={submitting}
            className="group inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 shadow-2xs transition-all hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-50 cursor-pointer"
          >
            <ArrowLeft
              size={14}
              className="transition-transform group-hover:-translate-x-0.5"
            />
            <span>Back to Orders</span>
          </button>

          <div className="flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800">
            Order #{order?.orderNumber || id}
          </div>
        </div>

        <div className="mt-4">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Edit Order
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Update the date and dynamic parameter details for this order.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center gap-2 border-b border-slate-100 pb-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
              <Edit3 size={18} />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-slate-900">
                General Information
              </h2>
              <p className="text-xs text-slate-400">
                Order classification (Read-only) & issuance date
              </p>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Order Type
              </label>
              <div className="relative">
                <FileText
                  size={16}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="text"
                  disabled
                  value={`${getOrderTypeName()} (${getOrderTypeCode()})`}
                  className="w-full rounded-lg border border-slate-200 bg-slate-100 py-2.5 pl-9 pr-3.5 text-sm font-medium text-slate-600 cursor-not-allowed"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Order Date <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Calendar
                  size={16}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <input
                  type="date"
                  value={orderDate}
                  max={today}
                  onChange={(event) => setOrderDate(event.target.value)}
                  disabled={submitting}
                  className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-9 pr-3.5 text-sm text-slate-900 shadow-sm transition-all focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:bg-slate-50"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                <Layers size={18} />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-slate-900">
                  {getOrderTypeName()} Details
                </h2>
                <p className="text-xs text-slate-400">
                  Modify parameters for this order
                </p>
              </div>
            </div>
            <span className="rounded-md bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700">
              {getOrderTypeCode()}
            </span>
          </div>

          {renderOrderForm()}
        </div>

        <div className="flex items-center justify-end gap-3 rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm">
          <button
            type="button"
            onClick={() => navigate("/orders")}
            disabled={submitting}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-all hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-200 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2 text-sm font-medium text-white shadow-sm transition-all hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer"
          >
            <Save size={15} />
            {submitting ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}