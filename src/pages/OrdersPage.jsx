import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Eye,
  Pencil,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Search,
  Filter,
  X,
} from "lucide-react";

import { getOrders, deleteOrder } from "../api/orderApi";

export default function OrdersPage() {
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("ALL");
  const [selectedType, setSelectedType] = useState("ALL");

  // Pagination States
  const [page, setPage] = useState(0);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);

  const loadOrders = useCallback(async () => {
    try {
      setLoading(true);

      const response = await getOrders({
        page,
        size: pageSize,
        keyword: searchQuery.trim() || undefined,
        orderTypeCode: selectedType !== "ALL" ? selectedType : undefined,
        statusCode: selectedStatus !== "ALL" ? selectedStatus : undefined,
      });

      setOrders(response.content || []);
      setTotalPages(response.totalPages || 0);
    } catch (error) {
      console.error("Failed to load orders:", error);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, searchQuery, selectedStatus, selectedType]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders]);

  // Reset pagination on filter change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setPage(0);
  };

  const handleStatusChange = (e) => {
    setSelectedStatus(e.target.value);
    setPage(0);
  };

  const handleTypeChange = (e) => {
    setSelectedType(e.target.value);
    setPage(0);
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedStatus("ALL");
    setSelectedType("ALL");
    setPage(0);
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this order?"
    );

    if (!confirmed) return;

    try {
      await deleteOrder(id);

      if (orders.length === 1 && page > 0) {
        setPage((prev) => prev - 1);
      } else {
        await loadOrders();
      }
    } catch (error) {
      console.error("Failed to delete order:", error);
    }
  };

  const getStatusBadge = (statusName) => {
    const status = statusName?.toUpperCase() || "";

    if (status.includes("ACTIVE")) {
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    }
    if (status.includes("CLOSE")) {
      return "bg-amber-50 text-amber-700 border-amber-200";
    }
    if (status.includes("DEACTIVATE") || status.includes("INACTIVE")) {
      return "bg-slate-100 text-slate-600 border-slate-200";
    }
    return "bg-indigo-50 text-indigo-700 border-indigo-200";
  };

  const isFiltered =
    searchQuery || selectedStatus !== "ALL" || selectedType !== "ALL";

  return (
    <div className="min-h-full bg-slate-50 p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Orders</h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage employee and organizational orders.
          </p>
        </div>

        <button
          onClick={() => navigate("/orders/create")}
          className="inline-flex items-center gap-2 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 transition-colors cursor-pointer"
        >
          <Plus size={18} />
          Create Order
        </button>
      </div>

      {/* Main Content Card */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {/* Search & Filter Toolbar */}
        <div className="border-b border-slate-200 bg-white p-4 sm:p-5">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="relative flex-1 max-w-md">
              <Search
                size={18}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder="Search by order number or type..."
                className="w-full rounded-lg border border-slate-200 bg-slate-50/50 pl-10 pr-4 py-2 text-sm text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
              />
            </div>

            {/* Select Controls */}
            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-2">
                <Filter size={16} className="text-slate-400 hidden sm:block" />
                <select
                  value={selectedType}
                  onChange={handleTypeChange}
                  className="rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-2 text-sm text-slate-700 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer"
                >
                  <option value="ALL">All Types</option>
                  <option value="STF">Staffing Plan (STF)</option>
                  <option value="APT">Appointment (APT)</option>
                  <option value="BNS">Bonus (BNS)</option>
                  <option value="SAL">Salary Adjustment (SAL)</option>
                  <option value="TRF">Transfer (TRF)</option>
                  <option value="PRO">Promotion (PRO)</option>
                  <option value="LEV">Leave (LEV)</option>
                  <option value="DIS">Dismissal (DIS)</option>
                  <option value="STR">Structure (STR)</option>
                </select>
              </div>

              <select
                value={selectedStatus}
                onChange={handleStatusChange}
                className="rounded-lg border border-slate-200 bg-slate-50/50 px-3 py-2 text-sm text-slate-700 focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 cursor-pointer"
              >
                <option value="ALL">All Statuses</option>
                <option value="ACTIVE">Active</option>
                <option value="INACTIVE">Inactive</option>
                <option value="CLOSED">Closed</option>
              </select>

              {isFiltered && (
                <button
                  onClick={clearFilters}
                  className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
                >
                  <X size={14} />
                  Reset
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="border-b border-slate-200 bg-slate-50/75 text-xs font-semibold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-6 py-3.5">Order Number</th>
                <th className="px-6 py-3.5">Type</th>
                <th className="px-6 py-3.5">Date</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-12 text-center text-slate-400"
                  >
                    Loading orders...
                  </td>
                </tr>
              ) : orders.length === 0 ? (
                <tr>
                  <td
                    colSpan="5"
                    className="px-6 py-12 text-center text-slate-400"
                  >
                    No orders found.
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-slate-50/60 transition-colors"
                  >
                    <td className="px-6 py-4 font-medium text-slate-900 whitespace-nowrap">
                      {order.orderNumber}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      {order.orderTypeName}
                      {order.orderTypeCode ? ` (${order.orderTypeCode})` : ""}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-slate-500">
                      {order.orderDate}
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${getStatusBadge(
                          order.statusName
                        )}`}
                      >
                        {order.statusName || "UNKNOWN"}
                      </span>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="inline-flex items-center gap-1">
                        <button
                          onClick={() => navigate(`/orders/${order.id}`)}
                          className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-indigo-600 transition-colors cursor-pointer"
                          title="View Details"
                        >
                          <Eye size={16} />
                        </button>

                        <button
                          onClick={() => navigate(`/orders/${order.id}/edit`)}
                          className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-amber-600 transition-colors cursor-pointer"
                          title="Edit Order"
                        >
                          <Pencil size={16} />
                        </button>

                        <button
                          onClick={() => handleDelete(order.id)}
                          className="rounded-md p-1.5 text-slate-400 hover:bg-slate-100 hover:text-red-600 transition-colors cursor-pointer"
                          title="Delete Order"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between border-t border-slate-200 px-6 py-4 bg-slate-50/50">
          <button
            disabled={page === 0}
            onClick={() => setPage((prev) => prev - 1)}
            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 shadow-sm hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            <ChevronLeft size={14} />
            Previous
          </button>

          <span className="text-xs text-slate-500 font-medium">
            Page {totalPages === 0 ? 0 : page + 1} of {totalPages}
          </span>

          <button
            disabled={totalPages === 0 || page + 1 >= totalPages}
            onClick={() => setPage((prev) => prev + 1)}
            className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 shadow-sm hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
          >
            Next
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}