import { hrmsServer } from "./axios";

export const getStaffingPlans = async (params = {}) => {
  const response = await hrmsServer.get("/staffing-plans", {
    params,
  });

  return response.data;
};

export const getStaffingPlanById = async (id) => {
  const response = await hrmsServer.get(
    `/staffing-plans/${id}`
  );

  return response.data;
};