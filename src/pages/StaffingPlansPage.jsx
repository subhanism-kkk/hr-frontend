import { useCallback, useEffect, useState } from "react";
import {
  BriefcaseBusiness,
  RefreshCw,
  Search,
  X,
} from "lucide-react";

import { getStaffingPlans } from "../api/staffingPlanApi";
import StaffingPlanTable from "../components/staffingPlan/StaffingPlanTable";

export default function StaffingPlansPage() {
  const [staffingPlans, setStaffingPlans] = useState([]);

  const [search, setSearch] = useState("");
  const [activeSearch, setActiveSearch] = useState("");

  const [page, setPage] = useState(0);
  const [size] = useState(10);

  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Debounce search input to trigger search automatically 300ms after typing stops
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(0);
      setActiveSearch(search);
    }, 300);

    return () => clearTimeout(timer);
  }, [search]);

  const loadStaffingPlans = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const params = {
        page,
        size,
      };

      if (activeSearch.trim()) {
        params.search = activeSearch.trim();
      }

      const response = await getStaffingPlans(params);

      setStaffingPlans(response?.content || []);
      setTotalPages(response?.totalPages || 0);
      setTotalElements(response?.totalElements || 0);
    } catch (error) {
      console.error("Failed to load staffing plans:", error);

      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Failed to load staffing plans.";

      setError(message);
      setStaffingPlans([]);
    } finally {
      setLoading(false);
    }
  }, [page, size, activeSearch]);

  useEffect(() => {
    loadStaffingPlans();
  }, [loadStaffingPlans]);

  const handleClearSearch = () => {
    setSearch("");
  };

  const handlePreviousPage = () => {
    if (page > 0) {
      setPage((current) => current - 1);
    }
  };

  const handleNextPage = () => {
    if (page < totalPages - 1) {
      setPage((current) => current + 1);
    }
  };

  const handleRefresh = () => {
    loadStaffingPlans();
  };

  return (
    <section className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-indigo-50 p-2.5 text-indigo-600">
              <BriefcaseBusiness size={20} />
            </div>

            <div>
              <h1 className="text-2xl font-semibold text-slate-900">
                Staffing Plans
              </h1>

              <p className="mt-1 text-sm text-slate-500">
                View the current organizational staffing plans.
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleRefresh}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <RefreshCw
            size={15}
            className={loading ? "animate-spin" : ""}
          />
          Refresh
        </button>
      </div>

      {/* Auto-Search Input */}
      <div className="relative max-w-md">
        <Search
          size={17}
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
        />

        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search staffing plans..."
          className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-10 pr-10 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 shadow-sm"
        />

        {search && (
          <button
            type="button"
            onClick={handleClearSearch}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X size={16} />
          </button>
        )}
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Count */}
      {!loading && !error && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-slate-500">
            {totalElements} staffing plan
            {totalElements === 1 ? "" : "s"} found
          </p>

          {totalPages > 0 && (
            <p className="text-xs text-slate-400">
              Page {page + 1} of {totalPages}
            </p>
          )}
        </div>
      )}

      {/* Table */}
      <StaffingPlanTable
        staffingPlans={staffingPlans}
        loading={loading}
      />

      {/* Pagination */}
      {!loading && totalPages > 1 && (
        <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
          <button
            type="button"
            onClick={handlePreviousPage}
            disabled={page === 0}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Previous
          </button>

          <div className="flex items-center gap-1.5">
            {Array.from({ length: totalPages }, (_, index) => index)
              .slice(
                Math.max(0, page - 2),
                Math.min(totalPages, page + 3)
              )
              .map((pageNumber) => (
                <button
                  key={pageNumber}
                  type="button"
                  onClick={() => setPage(pageNumber)}
                  className={[
                    "min-w-9 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                    pageNumber === page
                      ? "bg-indigo-600 text-white"
                      : "text-slate-600 hover:bg-slate-100",
                  ].join(" ")}
                >
                  {pageNumber + 1}
                </button>
              ))}
          </div>

          <button
            type="button"
            onClick={handleNextPage}
            disabled={page >= totalPages - 1}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Next
          </button>
        </div>
      )}
    </section>
  );
}