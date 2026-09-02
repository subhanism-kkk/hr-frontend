import { hrmsServer } from "./axios";

export const createOrder = async (data) => {
  const response = await hrmsServer.post("/orders", data);

  return response.data;
};

export const getOrders = async (params = {}) => {
  const response = await hrmsServer.get("/orders", {
    params,
  });

  return response.data;
};

export const getOrderDetails = async (id) => {
  const response = await hrmsServer.get(
    `/orders/${id}/details`
  );

  return response.data;
};

export const updateOrder = async (id, data) => {
  const response = await hrmsServer.put(
    `/orders/${id}`,
    data
  );

  return response.data;
};

export const deleteOrder = async (id) => {
  await hrmsServer.delete(`/orders/${id}`);
};

export const restoreOrder = async (id) => {
  await hrmsServer.patch(`/orders/${id}/restore`);
};

export const activateOrder = async (id) => {
  const response = await hrmsServer.patch(
    `/orders/${id}/activate`
  );

  return response.data;
};

export const deactivateOrder = async (id) => {
  const response = await hrmsServer.patch(
    `/orders/${id}/deactivate`
  );

  return response.data;
};

export const closeOrder = async (id) => {
  const response = await hrmsServer.patch(
    `/orders/${id}/close`
  );

  return response.data;
};

export const reopenOrder = async (id) => {
  const response = await hrmsServer.patch(
    `/orders/${id}/reopen`
  );

  return response.data;
};