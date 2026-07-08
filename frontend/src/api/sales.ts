import api from "./api";

export async function getSalesDashboard(
  brandCode: string,
  month = "2026_06",
  filters: {
    country?: string;
    company?: string;
    store?: string;
    salesType?: string;
    search?: string;
  } = {}
) {
  const response = await api.get(`/sales/${brandCode}`, {
    params: {
      month,
      ...filters,
    },
  });

  return response.data;
}