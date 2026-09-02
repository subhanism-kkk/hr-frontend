import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { getOrderById, createOrder, updateOrder } from "../api/orderApi";

export default function OrderForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  const [loading, setLoading] = useState(isEditMode);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const [formData, setFormData] = useState({
    orderNumber: "",
    orderTypeId: "",
    orderDate: new Date().toISOString().split("T")[0],
    statusId: "",
    note: "",
  });

  useEffect(() => {
    if (isEditMode) {
      fetchOrderData();
    }
  }, [id]);

  const fetchOrderData = async () => {
    try {
      setLoading(true);
      const data = await getOrderById(id);
      setFormData({
        orderNumber: data.orderNumber || "",
        orderTypeId: data.orderTypeId || "",
        orderDate: data.orderDate || "",
        statusId: data.statusId || "",
        note: data.note || "",
      });
    } catch (err) {
      console.error("Failed to fetch order details:", err);
      setErrorMessage("Could not load order details.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSubmitting(true);

    try {
      if (isEditMode) {
        await updateOrder(id, formData);
      } else {
        await createOrder(formData);
      }
      navigate("/orders");
    } catch (err) {
      console.error("Failed to save order:", err);
      setErrorMessage(
        err?.response?.data?.message || "Failed to save order. Please check inputs."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex h-96 items-center justify-center">
        <Loader2 className="animate-spin text-indigo-600" size={32} />
      </div>
    );
  }

  return (
    <div className="min-h-full bg-slate-50 p-6 lg:p-8 space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/orders")}
          className="rounded-lg border border-slate-200 bg-white p-2 text-slate-600 hover:bg-slate-50 transition-colors cursor-pointer"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            {isEditMode ? "Edit Order" : "Create New Order"}
          </h1>
          <p className="mt-0.5 text-sm text-slate-500">
            {isEditMode
              ? "Update existing order parameters."
              : "Fill in the information to generate a new order."}
          </p>
        </div>
      </div>

      {/* Form Card */}
      <form
        onSubmit={handleSubmit}
        className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm space-y-6"
      >
        {errorMessage && (
          <div className="rounded-lg bg-red-50 p-4 text-sm text-red-700 border border-red-200">
            {errorMessage}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Order Number */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Order Number <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="orderNumber"
              required
              value={formData.orderNumber}
              onChange={handleChange}
              placeholder="e.g. STF-2026-000085"
              className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          {/* Order Date */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Order Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="orderDate"
              required
              value={formData.orderDate}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>

          {/* Order Type */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Order Type <span className="text-red-500">*</span>
            </label>
            <select
              name="orderTypeId"
              required
              value={formData.orderTypeId}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer bg-white"
            >
              <option value="">Select Order Type</option>
              <option value="1">Staffing Plan (STF)</option>
              <option value="2">Appointment (APT)</option>
              <option value="3">Bonus (BNS)</option>
              <option value="4">Salary Adjustment (SAL)</option>
              <option value="5">Transfer (TRF)</option>
              <option value="6">Promotion (PRO)</option>
            </select>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Status <span className="text-red-500">*</span>
            </label>
            <select
              name="statusId"
              required
              value={formData.statusId}
              onChange={handleChange}
              className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer bg-white"
            >
              <option value="">Select Status</option>
              <option value="1">Active</option>
              <option value="2">Inactive</option>
              <option value="3">Closed</option>
            </select>
          </div>
        </div>

        {/* Note / Description */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Notes / Details
          </label>
          <textarea
            name="note"
            rows={4}
            value={formData.note}
            onChange={handleChange}
            placeholder="Add relevant order notes or instructions..."
            className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 resize-none"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={() => navigate("/orders")}
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-5 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50 transition-colors cursor-pointer"
          >
            {submitting ? (
              <Loader2 className="animate-spin" size={16} />
            ) : (
              <Save size={16} />
            )}
            {isEditMode ? "Update Order" : "Save Order"}
          </button>
        </div>
      </form>
    </div>
  );
}