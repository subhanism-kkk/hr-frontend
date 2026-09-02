import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  ArrowLeft,
  CheckCircle,
  XCircle,
  Lock,
  RotateCcw,
  Pencil,
  Trash2,
  FileText,
  Calendar,
  Tag,
  Activity,
  Building2,
  BriefcaseBusiness,
  User,
  Wallet,
  Users,
} from "lucide-react";

import {
  getOrderDetails,
  deleteOrder,
  activateOrder,
  deactivateOrder,
  closeOrder,
  reopenOrder,
} from "../api/orderApi";

export default function OrderDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] =
    useState(null);

  const [loading, setLoading] =
    useState(true);

  const [actionLoading, setActionLoading] =
    useState(false);

  const loadOrder = async () => {
    try {
      setLoading(true);

      const response =
        await getOrderDetails(id);

      console.log(
        "Order details response:",
        response
      );

      setOrder(response);
    } catch (error) {
      console.error(
        "Failed to load order:",
        error
      );

      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Failed to load order details.";

      alert(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrder();
  }, [id]);

  const handleAction = async (
    action
  ) => {
    try {
      setActionLoading(true);

      await action(id);

      await loadOrder();
    } catch (error) {
      console.error(
        "Order action failed:",
        error
      );

      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Order action failed.";

      alert(message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    const confirmed =
      window.confirm(
        "Are you sure you want to delete this order?"
      );

    if (!confirmed) {
      return;
    }

    try {
      setActionLoading(true);

      await deleteOrder(id);

      navigate("/orders");
    } catch (error) {
      console.error(
        "Failed to delete order:",
        error
      );

      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Failed to delete order.";

      alert(message);
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadge = (
    statusName
  ) => {
    const status =
      statusName?.toUpperCase() || "";

    if (status === "ACTIVE") {
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    }

    if (
      status === "INACTIVE" ||
      status === "DEACTIVATED"
    ) {
      return "bg-slate-100 text-slate-600 border-slate-200";
    }

    if (status === "CLOSED") {
      return "bg-amber-50 text-amber-700 border-amber-200";
    }

    return "bg-indigo-50 text-indigo-700 border-indigo-200";
  };

  const detail =
    order?.details?.[0];

  const renderField = (
    label,
    value,
    Icon
  ) => {
    return (
      <div className="rounded-lg border border-slate-200 bg-slate-50/60 p-4">

        <div className="flex items-start gap-3">

          <div className="rounded-lg bg-white p-2 text-slate-500 shadow-sm">
            <Icon size={17} />
          </div>

          <div className="min-w-0">

            <p className="text-xs font-medium text-slate-500">
              {label}
            </p>

            <p className="mt-1 break-words text-sm font-semibold text-slate-900">
              {value !== null &&
              value !== undefined &&
              value !== ""
                ? value
                : "—"}
            </p>

          </div>

        </div>
      </div>
    );
  };

  /*
   * SALARY
   *
   * These fields come directly from:
   *
   * OrderPersonSalaryResponse
   *
   * There is NO person field here.
   * There is NO reason field here.
   */
  const renderSalaryDetails = () => {
    if (!detail) {
      return (
        <p className="text-sm text-slate-500">
          No salary details were
          found for this order.
        </p>
      );
    }

    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

        {renderField(
          "Staffing Plan",
          detail.staffingPlanId,
          BriefcaseBusiness
        )}

        {renderField(
          "Old Salary",
          detail.oldSalary,
          Wallet
        )}

        {renderField(
          "New Salary",
          detail.newSalary,
          Wallet
        )}

        {renderField(
          "Effective Date",
          detail.effectiveDate,
          Calendar
        )}

        {renderField(
          "Status",
          detail.statusName,
          Activity
        )}

        {renderField(
          "Salary Record ID",
          detail.id,
          FileText
        )}

      </div>
    );
  };

  /*
   * APT
   */
  const renderAppointmentDetails = () => {
    if (!detail) {
      return (
        <p className="text-sm text-slate-500">
          No appointment details
          were found.
        </p>
      );
    }

    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

        {renderField(
          "Person",
          detail.personName,
          User
        )}

        {renderField(
          "Staffing Plan",
          detail.staffingPlanId,
          BriefcaseBusiness
        )}

        {renderField(
          "Structure",
          detail.structureName,
          Building2
        )}

        {renderField(
          "Position",
          detail.positionName,
          BriefcaseBusiness
        )}

        {renderField(
          "Start Date",
          detail.startDate,
          Calendar
        )}

        {renderField(
          "End Date",
          detail.endDate,
          Calendar
        )}

        {renderField(
          "Closed",
          detail.isClosed
            ? "Yes"
            : "No",
          Activity
        )}

        {renderField(
          "Status",
          detail.statusName,
          Activity
        )}

      </div>
    );
  };

  /*
   * DIS
   */
  const renderDismissalDetails = () => {
    if (!detail) {
      return (
        <p className="text-sm text-slate-500">
          No dismissal details
          were found.
        </p>
      );
    }

    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

        {renderField(
          "Person",
          detail.personFullName,
          User
        )}

        {renderField(
          "Dismissal Date",
          detail.dismissalDate,
          Calendar
        )}

        {renderField(
          "Description",
          detail.description,
          FileText
        )}

        {renderField(
          "Status",
          detail.statusName,
          Activity
        )}

      </div>
    );
  };

  /*
   * LEV
   */
  const renderLeaveDetails = () => {
    if (!detail) {
      return (
        <p className="text-sm text-slate-500">
          No leave details
          were found.
        </p>
      );
    }

    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

        {renderField(
          "Person",
          detail.personFullName,
          User
        )}

        {renderField(
          "Leave Type",
          detail.leaveTypeName,
          Tag
        )}

        {renderField(
          "Start Date",
          detail.startDate,
          Calendar
        )}

        {renderField(
          "End Date",
          detail.endDate,
          Calendar
        )}

        {renderField(
          "Reason",
          detail.reason,
          FileText
        )}

        {renderField(
          "Status",
          detail.statusName,
          Activity
        )}

      </div>
    );
  };

  /*
   * PRO
   */
  const renderPromotionDetails = () => {
    if (!detail) {
      return (
        <p className="text-sm text-slate-500">
          No promotion details
          were found.
        </p>
      );
    }

    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

        {renderField(
          "Person",
          detail.personFullName,
          User
        )}

        {renderField(
          "Old Position",
          detail.oldPositionName,
          BriefcaseBusiness
        )}

        {renderField(
          "New Position",
          detail.newPositionName,
          BriefcaseBusiness
        )}

        {renderField(
          "Effective Date",
          detail.effectiveDate,
          Calendar
        )}

        {renderField(
          "Status",
          detail.statusName,
          Activity
        )}

      </div>
    );
  };

  /*
   * TRF
   */
  const renderTransferDetails = () => {
    if (!detail) {
      return (
        <p className="text-sm text-slate-500">
          No transfer details
          were found.
        </p>
      );
    }

    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

        {renderField(
          "Person",
          detail.personFullName,
          User
        )}

        {renderField(
          "Old Structure",
          detail.oldStructureName,
          Building2
        )}

        {renderField(
          "New Structure",
          detail.newStructureName,
          Building2
        )}

        {renderField(
          "Old Position",
          detail.oldPositionName,
          BriefcaseBusiness
        )}

        {renderField(
          "New Position",
          detail.newPositionName,
          BriefcaseBusiness
        )}

        {renderField(
          "Effective Date",
          detail.effectiveDate,
          Calendar
        )}

        {renderField(
          "Status",
          detail.statusName,
          Activity
        )}

      </div>
    );
  };

  /*
   * BNS
   */
  const renderBonusDetails = () => {
    if (!detail) {
      return (
        <p className="text-sm text-slate-500">
          No bonus details
          were found.
        </p>
      );
    }

    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

        {renderField(
          "Person",
          detail.personName,
          User
        )}

        {renderField(
          "Bonus Type",
          detail.bonusTypeName,
          Tag
        )}

        {renderField(
          "Calculation Type",
          detail.calculationType,
          Activity
        )}

        {renderField(
          "Amount",
          detail.amount,
          Wallet
        )}

        {renderField(
          "Start Date",
          detail.startDate,
          Calendar
        )}

        {renderField(
          "End Date",
          detail.endDate,
          Calendar
        )}

        {renderField(
          "Reason",
          detail.reason,
          FileText
        )}

        {renderField(
          "Status",
          detail.statusName,
          Activity
        )}

      </div>
    );
  };

  /*
   * STF
   */
  const renderStaffingPlanDetails =
    () => {
      if (!detail) {
        return (
          <p className="text-sm text-slate-500">
            No staffing plan details
            were found.
          </p>
        );
      }

      return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

          {renderField(
            "Structure",
            detail.structureName,
            Building2
          )}

          {renderField(
            "Position",
            detail.positionName,
            BriefcaseBusiness
          )}

          {renderField(
            "Salary",
            detail.salary,
            Wallet
          )}

          {renderField(
            "Capacity",
            detail.capacity,
            Users
          )}

          {renderField(
            "Closed",
            detail.isClosed
              ? "Yes"
              : "No",
            Activity
          )}

          {renderField(
            "Status",
            detail.statusName,
            Activity
          )}

        </div>
      );
    };

  /*
   * STR
   */
  const renderStructureDetails =
    () => {
      if (!detail) {
        return (
          <p className="text-sm text-slate-500">
            No structure details
            were found.
          </p>
        );
      }

      return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

          {renderField(
            "Name",
            detail.name,
            Building2
          )}

          {renderField(
            "Parent Structure",
            detail.parentStructureName,
            Building2
          )}

          {renderField(
            "Closed",
            detail.isClosed
              ? "Yes"
              : "No",
            Activity
          )}

          {renderField(
            "Status",
            detail.statusName,
            Activity
          )}

        </div>
      );
    };

  const renderOrderSpecificDetails =
    () => {
      switch (
        order.orderTypeCode
      ) {
        case "SAL":
          return renderSalaryDetails();

        case "APT":
          return renderAppointmentDetails();

        case "DIS":
          return renderDismissalDetails();

        case "LEV":
          return renderLeaveDetails();

        case "PRO":
          return renderPromotionDetails();

        case "TRF":
          return renderTransferDetails();

        case "BNS":
          return renderBonusDetails();

        case "STF":
          return renderStaffingPlanDetails();

        case "STR":
          return renderStructureDetails();

        default:
          return (
            <p className="text-sm text-slate-500">
              No detail renderer exists
              for this order type.
            </p>
          );
      }
    };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16 text-sm text-slate-500">
        Loading order details...
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-full bg-slate-50 p-6 lg:p-8">

        <div className="rounded-xl border border-slate-200 bg-white p-8 text-center">

          <p className="text-slate-600">
            Order not found or has
            been removed.
          </p>

          <button
            type="button"
            onClick={() =>
              navigate("/orders")
            }
            className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-indigo-600"
          >
            <ArrowLeft size={16} />
            Back to Orders
          </button>

        </div>
      </div>
    );
  }

  const status =
    order.statusName?.toUpperCase();

  const isActive =
    status === "ACTIVE";

  const isInactive =
    status === "INACTIVE" ||
    status === "DEACTIVATED";

  const isStaffingPlanOrder =
    order.orderTypeCode === "STF";

  const staffingPlanClosed =
    isStaffingPlanOrder &&
    detail?.isClosed === true;

  return (
    <div className="min-h-full space-y-6 bg-slate-50 p-6 lg:p-8">

      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-5">

        <div>

          <button
            type="button"
            onClick={() =>
              navigate("/orders")
            }
            className="mb-2 inline-flex items-center gap-1.5 text-xs font-medium text-slate-500 hover:text-slate-800"
          >
            <ArrowLeft size={14} />
            Back to Orders
          </button>

          <div className="flex flex-wrap items-center gap-3">

            <h1 className="text-2xl font-semibold text-slate-900">
              {order.orderNumber}
            </h1>

            <span
              className={`rounded-full border px-2.5 py-0.5 text-xs font-medium ${getStatusBadge(
                order.statusName
              )}`}
            >
              {order.statusName ||
                "UNKNOWN"}
            </span>

          </div>

          <p className="mt-1 text-sm text-slate-500">
            {order.orderTypeName}

            {order.orderTypeCode
              ? ` (${order.orderTypeCode})`
              : ""}
          </p>

        </div>

        {/* Actions */}
        <div className="flex flex-wrap items-center gap-2">

          {!isActive && (
            <button
              type="button"
              disabled={actionLoading}
              onClick={() =>
                handleAction(
                  activateOrder
                )
              }
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
            >
              <CheckCircle
                size={14}
                className="text-emerald-600"
              />

              Activate
            </button>
          )}

          {isActive && (
            <button
              type="button"
              disabled={actionLoading}
              onClick={() =>
                handleAction(
                  deactivateOrder
                )
              }
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-300 bg-white px-3 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-50"
            >
              <XCircle
                size={14}
                className="text-slate-500"
              />

              Deactivate
            </button>
          )}

          {isStaffingPlanOrder &&
            !staffingPlanClosed && (
              <button
                type="button"
                disabled={actionLoading}
                onClick={() =>
                  handleAction(
                    closeOrder
                  )
                }
                className="inline-flex items-center gap-1.5 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-medium text-amber-700 hover:bg-amber-100 disabled:opacity-50"
              >
                <Lock size={14} />
                Close
              </button>
            )}

          {isStaffingPlanOrder &&
            staffingPlanClosed && (
              <button
                type="button"
                disabled={actionLoading}
                onClick={() =>
                  handleAction(
                    reopenOrder
                  )
                }
                className="inline-flex items-center gap-1.5 rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-2 text-xs font-medium text-indigo-700 hover:bg-indigo-100 disabled:opacity-50"
              >
                <RotateCcw size={14} />
                Reopen
              </button>
            )}

          <button
            type="button"
            disabled={actionLoading}
            onClick={() =>
              navigate(
                `/orders/${order.id}/edit`
              )
            }
            className="inline-flex items-center gap-1.5 rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-2 text-xs font-medium text-indigo-700 hover:bg-indigo-100 disabled:opacity-50"
          >
            <Pencil size={14} />
            Edit
          </button>

          <button
            type="button"
            disabled={actionLoading}
            onClick={
              handleDelete
            }
            className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-700 hover:bg-red-100 disabled:opacity-50"
          >
            <Trash2 size={14} />
            Delete
          </button>

        </div>
      </div>

      {/* Summary */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

        <SummaryCard
          icon={FileText}
          label="Order Number"
          value={
            order.orderNumber
          }
        />

        <SummaryCard
          icon={Tag}
          label="Order Type"
          value={`${order.orderTypeName}${
            order.orderTypeCode
              ? ` (${order.orderTypeCode})`
              : ""
          }`}
        />

        <SummaryCard
          icon={Calendar}
          label="Order Date"
          value={order.orderDate}
        />

        <SummaryCard
          icon={Activity}
          label="Current Status"
          value={
            order.statusName ||
            "UNKNOWN"
          }
        />

      </div>

      {/* Details */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">

        <div className="mb-5 border-b border-slate-100 pb-4">

          <h2 className="text-base font-semibold text-slate-900">
            {order.orderTypeName}
            {" "}Details
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Information associated
            with this order.
          </p>

        </div>

        {renderOrderSpecificDetails()}

      </div>

    </div>
  );
}

function SummaryCard({
  icon: Icon,
  label,
  value,
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">

      <div className="flex items-center gap-3">

        <div className="rounded-lg bg-indigo-50 p-2.5 text-indigo-600">
          <Icon size={18} />
        </div>

        <div className="min-w-0">

          <p className="text-xs font-medium text-slate-500">
            {label}
          </p>

          <p className="mt-1 truncate text-sm font-semibold text-slate-900">
            {value ?? "—"}
          </p>

        </div>

      </div>
    </div>
  );
}