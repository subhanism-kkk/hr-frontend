import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  FilePlus,
  Layers,
  Send,
  Calendar,
  FileText,
  MousePointerClick,
  AlertCircle,
} from "lucide-react";

import { createOrder } from "../api/orderApi";
import { orderTypeApi } from "../api/orderTypeApi";

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

export default function OrderCreatePage() {
  const navigate = useNavigate();

  const [orderTypes, setOrderTypes] = useState([]);
  const [orderTypeId, setOrderTypeId] = useState("");
  const [orderDate, setOrderDate] = useState("");
  const [data, setData] = useState({});

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const today = getTodayLocalDate();

  useEffect(() => {
    const loadOrderTypes = async () => {
      try {
        const response = await orderTypeApi.getAll({
          page: 0,
          size: 100,
        });
        setOrderTypes(response?.content || []);
      } catch (error) {
        console.error("Failed to load order types:", error);
      } finally {
        setLoading(false);
      }
    };

    loadOrderTypes();
  }, []);

  const selectedOrderType = orderTypes.find(
    (type) => type.id === Number(orderTypeId)
  );

  const handleOrderTypeChange = (event) => {
    const value = event.target.value;
    setOrderTypeId(value);
    setData({});
  };

  const handleDataChange = (newData) => {
    setData(newData || {});
  };

  const renderOrderForm = () => {
    if (!selectedOrderType) return null;

    switch (selectedOrderType.code) {
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
              Unsupported order type: <strong>{selectedOrderType.code}</strong>
            </span>
          </div>
        );
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!orderTypeId) {
      alert("Please select an order type.");
      return;
    }

    if (!selectedOrderType) {
      alert("Please select a valid order type.");
      return;
    }

    if (!orderDate) {
      alert("Please select an order date.");
      return;
    }

    if (orderDate > today) {
      alert("Order date cannot be in the future.");
      return;
    }

    if (!data || Object.keys(data).length === 0) {
      alert("Please fill in the order details.");
      return;
    }

    try {
      setSubmitting(true);

      const payload = {
        orderTypeId: Number(orderTypeId),
        orderDate,
        data: [data],
      };

      const createdOrder = await createOrder(payload);
      navigate(`/orders/${createdOrder.id}`);
    } catch (error) {
      console.error("Failed to create order:", error);
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

      alert(message || "Failed to create order.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center text-sm font-medium text-slate-500">
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
          Loading order configuration...
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6 pb-12">
      {/* Redesigned Header Section */}
      <div className="border-b border-slate-200 pb-5">
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate("/orders")}
            disabled={submitting}
            className="group inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 shadow-2xs transition-all hover:border-slate-300 hover:bg-slate-50 hover:text-slate-900 focus:ring-2 focus:ring-indigo-500/20 disabled:opacity-50"
          >
            <ArrowLeft
              size={14}
              className="transition-transform group-hover:-translate-x-0.5"
            />
            <span>Back to Orders</span>
          </button>

          <div className="flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50/60 px-3 py-1 text-xs font-medium text-indigo-700">
            <span className="h-2 w-2 rounded-full bg-indigo-600 animate-pulse" />
            New Draft
          </div>
        </div>

        <div className="mt-4">
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Create New Order
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Select an order category and configure the required parameters.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: General Information */}
        <div className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center gap-2 border-b border-slate-100 pb-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
              <FilePlus size={18} />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-slate-900">
                General Information
              </h2>
              <p className="text-xs text-slate-400">
                Basic classification and issuance date
              </p>
            </div>
          </div>

          <div className="grid gap-5 md:grid-cols-2">
            {/* Order Type */}
            <div>
              <label className="mb-1.5 block text-sm font-medium text-slate-700">
                Order Type <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <FileText
                  size={16}
                  className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
                <select
                  value={orderTypeId}
                  onChange={handleOrderTypeChange}
                  disabled={submitting}
                  className="w-full rounded-lg border border-slate-300 bg-white py-2.5 pl-9 pr-3.5 text-sm text-slate-900 shadow-sm transition-all focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:bg-slate-50"
                >
                  <option value="">Select order type...</option>
                  {orderTypes.map((type) => (
                    <option key={type.id} value={type.id}>
                      {type.name} ({type.code})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Order Date */}
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
              <p className="mt-1.5 text-xs text-slate-400">
                Cannot be set to a future date.
              </p>
            </div>
          </div>
        </div>

        {/* Section 2: Specific Order Details OR Dynamic Placeholder */}
        {selectedOrderType ? (
          <div className="rounded-xl border border-slate-200/80 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600">
                  <Layers size={18} />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-slate-900">
                    {selectedOrderType.name} Details
                  </h2>
                  <p className="text-xs text-slate-400">
                    Fill out the form fields for this order action
                  </p>
                </div>
              </div>
              <span className="rounded-md bg-indigo-50 px-2.5 py-1 text-xs font-semibold text-indigo-700">
                {selectedOrderType.code}
              </span>
            </div>

            {renderOrderForm()}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50/60 p-10 text-center">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-white border border-slate-200 text-slate-400 shadow-xs">
              <MousePointerClick size={22} />
            </div>
            <h3 className="text-sm font-semibold text-slate-800">
              Select an Order Type
            </h3>
            <p className="mt-1 max-w-sm text-xs text-slate-500">
              Choose an order type from the section above to unlock and configure specific details.
            </p>
          </div>
        )}

        {/* Action Buttons Footer */}
        <div className="flex items-center justify-end gap-3 rounded-xl border border-slate-200/80 bg-white p-4 shadow-sm">
          <button
            type="button"
            onClick={() => navigate("/orders")}
            disabled={submitting}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-all hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-200 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={submitting || !selectedOrderType}
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2 text-sm font-medium text-white shadow-sm transition-all hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Send size={15} />
            {submitting ? "Creating..." : "Create Order"}
          </button>
        </div>
      </form>
    </div>
  );
}