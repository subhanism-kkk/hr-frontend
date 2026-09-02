import { useEffect, useMemo, useState } from "react";
import StructureTree from "../components/structure/StructureTree";
import { getStructures } from "../api/structureApi";
import { structurePageSchema } from "../schemas/structureSchema";

export default function StructuresPage() {
  const [structures, setStructures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [isClosed, setIsClosed] = useState("");

  const [sortBy, setSortBy] = useState("id");
  const [sortDirection, setSortDirection] = useState("asc");

  const [page, setPage] = useState(0);
  const pageSize = 10;

  /*
   * Load all structures without status/isClosed query params
   * so the backend returns the full tree hierarchy.
   */
  const loadStructures = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await getStructures({
        page: 0,
        size: 1000,
        sort: `${sortBy},${sortDirection}`,
      });

      const parsed = structurePageSchema.parse(response);
      setStructures(parsed.content);
    } catch (err) {
      console.error("Failed to load structures:", err);
      setError(
        err?.response?.data?.message ||
          err?.response?.data?.error ||
          "Failed to load structures."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStructures();
  }, [sortBy, sortDirection]);

  /*
   * Filter structures while keeping ancestor paths intact.
   */
  const filteredStructures = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    if (!keyword && !status && isClosed === "") {
      return structures;
    }

    const structureById = new Map(
      structures.map((structure) => [structure.id, structure])
    );

    const visibleIds = new Set();

    structures.forEach((structure) => {
      // 1. Search keyword match
      const matchesSearch =
        !keyword || structure.name?.toLowerCase().includes(keyword);

      // 2. Status match (checks status code, statusName, or status field)
      const matchesStatus =
        !status ||
        structure.statusCode === status ||
        structure.statusName?.toUpperCase() === status ||
        structure.status === status;

      // 3. Closed match
      const matchesClosed =
        isClosed === "" || String(structure.isClosed) === isClosed;

      if (matchesSearch && matchesStatus && matchesClosed) {
        visibleIds.add(structure.id);

        // Add all ancestors so the child remains attached to its root
        let parentId = structure.parentStructureId;

        while (parentId != null) {
          if (visibleIds.has(parentId)) {
            break;
          }

          visibleIds.add(parentId);
          const parent = structureById.get(parentId);

          if (!parent) {
            break;
          }

          parentId = parent.parentStructureId;
        }
      }
    });

    return structures.filter((structure) => visibleIds.has(structure.id));
  }, [structures, search, status, isClosed]);

  const rootStructures = useMemo(() => {
    return filteredStructures.filter(
      (structure) => structure.parentStructureId == null
    );
  }, [filteredStructures]);

  const paginatedRoots = useMemo(() => {
    const start = page * pageSize;
    return rootStructures.slice(start, start + pageSize);
  }, [rootStructures, page]);

  const totalPages = Math.ceil(rootStructures.length / pageSize);

  useEffect(() => {
    setPage(0);
  }, [search, status, isClosed, sortBy, sortDirection]);

  useEffect(() => {
    if (totalPages === 0) {
      setPage(0);
      return;
    }

    if (page >= totalPages) {
      setPage(totalPages - 1);
    }
  }, [page, totalPages]);

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Structures</h1>
        <p className="mt-1 text-sm text-gray-500">
          View and explore the structure hierarchy.
        </p>
      </div>

      {/* Filters */}
      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          {/* Search */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Search
            </label>
            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search structures..."
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"
            />
          </div>

          {/* Status */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              value={status}
              onChange={(event) => setStatus(event.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"
            >
              <option value="">All statuses</option>
              <option value="ACTIVE">ACTIVE</option>
              <option value="INACTIVE">INACTIVE</option>
            </select>
          </div>

          {/* Closed */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Closed
            </label>
            <select
              value={isClosed}
              onChange={(event) => setIsClosed(event.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"
            >
              <option value="">All</option>
              <option value="false">Open</option>
              <option value="true">Closed</option>
            </select>
          </div>

          {/* Sort */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Sort
            </label>
            <select
              value={`${sortBy},${sortDirection}`}
              onChange={(event) => {
                const [field, direction] = event.target.value.split(",");
                setSortBy(field);
                setSortDirection(direction);
              }}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500"
            >
              <option value="id,asc">ID ↑</option>
              <option value="id,desc">ID ↓</option>
              <option value="name,asc">Name ↑</option>
              <option value="name,desc">Name ↓</option>
            </select>
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="py-10 text-center text-sm text-gray-500">
          Loading structures...
        </div>
      ) : (
        <>
          <StructureTree
            structures={filteredStructures}
            visibleRootIds={paginatedRoots.map((structure) => structure.id)}
          />

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <button
                type="button"
                disabled={page === 0}
                onClick={() =>
                  setPage((previous) => Math.max(previous - 1, 0))
                }
                className="rounded-md border border-gray-300 px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
              >
                Previous
              </button>

              <span className="text-sm text-gray-600">
                Page {page + 1} of {totalPages}
              </span>

              <button
                type="button"
                disabled={totalPages === 0 || page >= totalPages - 1}
                onClick={() =>
                  setPage((previous) =>
                    Math.min(previous + 1, totalPages - 1)
                  )
                }
                className="rounded-md border border-gray-300 px-4 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}