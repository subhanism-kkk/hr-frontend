import { useMemo, useState } from "react";
import { ChevronRight } from "lucide-react";

export default function StructureTree({
  structures,
  visibleRootIds = [],
}) {
  const [expandedIds, setExpandedIds] = useState(new Set());

  /*
   * Build:
   *
   * parentId -> children[]
   *
   * Example:
   *
   * 1 -> [2, 3]
   * 2 -> [4, 5]
   *
   * So:
   * Company
   *   ├── IT
   *   │   ├── Backend
   *   │   └── Frontend
   *   └── HR
   */
  const childrenByParentId = useMemo(() => {
    const map = new Map();

    structures.forEach((structure) => {
      const parentId = structure.parentStructureId;

      if (parentId == null) {
        return;
      }

      if (!map.has(parentId)) {
        map.set(parentId, []);
      }

      map.get(parentId).push(structure);
    });

    return map;
  }, [structures]);

  /*
   * Only show the root structures belonging to the current page.
   *
   * IMPORTANT:
   * We keep ALL filtered structures in `structures`.
   * Otherwise children disappear because they may not be
   * part of the current root page.
   */
  const rootStructures = useMemo(() => {
    return structures.filter(
      (structure) =>
        structure.parentStructureId == null &&
        visibleRootIds.includes(structure.id)
    );
  }, [structures, visibleRootIds]);

  const toggleExpanded = (id) => {
    setExpandedIds((previous) => {
      const next = new Set(previous);

      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }

      return next;
    });
  };

  const renderStructure = (structure, level = 0) => {
    const children = childrenByParentId.get(structure.id) || [];

    const hasChildren = children.length > 0;
    const isExpanded = expandedIds.has(structure.id);

    return (
      <div key={structure.id}>
        {/* Structure row */}
        <div
          className="flex items-center border-b border-gray-200 py-3"
          style={{
            paddingLeft: `${level * 28 + 12}px`,
          }}
        >
          {/* Expand / collapse button */}
          <div className="w-8 shrink-0">
            {hasChildren && (
              <button
                type="button"
                onClick={() => toggleExpanded(structure.id)}
                className="flex h-7 w-7 items-center justify-center rounded hover:bg-gray-100"
                title={isExpanded ? "Collapse" : "Expand"}
              >
                <ChevronRight
                  size={18}
                  className={`transition-transform duration-200 ${
                    isExpanded ? "rotate-90" : ""
                  }`}
                />
              </button>
            )}
          </div>

          {/* ID */}
          <div className="w-20 shrink-0">
            <span className="font-mono text-sm text-gray-600">
              {structure.id}
            </span>
          </div>

          {/* Structure name */}
          <div className="min-w-0 flex-1">
            <span className="font-medium text-gray-900">
              {structure.name}
            </span>
          </div>

          {/* Parent */}
          <div className="w-52 shrink-0 text-sm text-gray-600">
            {structure.parentStructureName || "—"}
          </div>

          {/* Closed */}
          <div className="w-24 shrink-0">
            <span className="text-sm text-gray-600">
              {structure.isClosed ? "Yes" : "No"}
            </span>
          </div>

          {/* Status */}
          <div className="w-32 shrink-0">
            <span className="text-sm text-gray-600">
              {structure.statusName || "—"}
            </span>
          </div>
        </div>

        {/* Children */}
        {hasChildren && isExpanded && (
          <div>
            {children.map((child) =>
              renderStructure(child, level + 1)
            )}
          </div>
        )}
      </div>
    );
  };

  /*
   * No root structures for the current page.
   */
  if (rootStructures.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white py-10 text-center text-gray-500">
        No structures found.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
  <div className="min-w-[900px]">
      {/* Header */}
      <div className="flex items-center border-b border-gray-200 bg-gray-50 py-3">
        <div className="w-8 shrink-0" />

        <div className="w-20 shrink-0 text-xs font-semibold uppercase text-gray-500">
          ID
        </div>

        <div className="min-w-0 flex-1 text-xs font-semibold uppercase text-gray-500">
          Structure
        </div>

        <div className="w-52 shrink-0 text-xs font-semibold uppercase text-gray-500">
          Parent Structure
        </div>

        <div className="w-24 shrink-0 text-xs font-semibold uppercase text-gray-500">
          Closed
        </div>

        <div className="w-32 shrink-0 text-xs font-semibold uppercase text-gray-500">
          Status
        </div>
      </div>

      {/* Tree */}
      <div>
        {rootStructures.map((structure) =>
          renderStructure(structure)
        )}
      </div>
      </div>
</div>
  );
}