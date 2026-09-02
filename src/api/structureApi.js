import { hrmsServer } from "./axios";

export const getStructures = async (params = {}) => {
  const response = await hrmsServer.get("/structures", {
    params,
  });

  return response.data;
};

export const getStructureById = async (id) => {
  const response = await hrmsServer.get(`/structures/${id}`);

  return response.data;
};