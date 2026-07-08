import api from "./api";

export async function getSalesDashboard(brandCode: string, month = "2026_06") {
  const response = await api.get(`/sales/${brandCode}`, {
    params: { month },
  });

  return response.data;
}