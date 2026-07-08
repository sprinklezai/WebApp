import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Banknote,
  Receipt,
  Percent,
  ShoppingBag,
  Package,
} from "lucide-react";

import BrandLayout from "../layouts/BrandLayout";
import KpiCard from "../components/widgets/KpiCard";
import PieChartCard from "../components/charts/PieChartCard";
import BarChartCard from "../components/charts/BarChartCard";
import LineChartCard from "../components/charts/LineChartCard";
import { getSalesDashboard } from "../api/sales";

function SalesDashboard() {
  const { brandCode } = useParams();

  const code = String(brandCode || "").toUpperCase();

  const [loading, setLoading] = useState(true);
  const [salesData, setSalesData] = useState<any>(null);

  useEffect(() => {
    async function loadSales() {
      try {
        const data = await getSalesDashboard(code, "2026_06");
        setSalesData(data);
      } catch (error) {
        console.error("Sales dashboard loading failed:", error);
      } finally {
        setLoading(false);
      }
    }

    if (code) loadSales();
  }, [code]);

  const kpis = salesData?.kpis || {
    netRevenue: 0,
    orders: 0,
    avgOrderValue: 0,
    discounts: 0,
    itemsSold: 0,
  };

  const formatMoney = (value: number) =>
    `د.ك ${Number(value || 0).toLocaleString(undefined, {
      maximumFractionDigits: 2,
    })}`;

  const formatNumber = (value: number) =>
    Number(value || 0).toLocaleString(undefined, {
      maximumFractionDigits: 0,
    });

  const brandName =
    salesData?.brandName || salesData?.brandCode || code;

  const revenueTrend =
    salesData?.revenueTrend?.map((item: any) => ({
      name: item.date,
      value: Number(item.value || 0),
    })) || [];

  const countrySales =
    salesData?.countrySales?.map((item: any) => ({
      name: item.name,
      value: Number(item.value || 0),
    })) || [];

  const salesTypeMix =
    salesData?.salesTypeMix?.map((item: any) => ({
      name: item.name || "Unknown",
      value: Number(item.value || 0),
    })) || [];

  const topStores =
    salesData?.topStores?.map((item: any) => ({
      name: item.store_name,
      value: Number(item.net_sales || 0),
    })) || [];

  return (
    <BrandLayout brandCode={code} brandName={brandName}>
      <section className="mb-8 rounded-3xl border border-blue-100 bg-gradient-to-r from-blue-50 via-white to-blue-100 p-8 shadow-sm">
        <p className="mb-2 text-sm font-semibold text-blue-600">
          Sales Dashboard
        </p>

        <h1 className="text-4xl font-extrabold text-slate-900">
          {brandName} Sales Performance
        </h1>

        <p className="mt-3 max-w-3xl text-slate-500">
          Live sales analytics from uploaded CSV files enriched with store,
          brand, company and country master data.
        </p>
      </section>

      {loading ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-8 text-slate-500 shadow-sm">
          Loading sales dashboard...
        </div>
      ) : (
        <>
          <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-5">
            <KpiCard
              title="Net Revenue"
              value={formatMoney(kpis.netRevenue)}
              subtitle="Selected period"
              icon={<Banknote size={30} />}
              accent="green"
            />

            <KpiCard
              title="Orders"
              value={formatNumber(kpis.orders)}
              subtitle="Unique receipts"
              icon={<Receipt size={30} />}
              accent="blue"
            />

            <KpiCard
              title="Avg Order Value"
              value={formatMoney(kpis.avgOrderValue)}
              subtitle="Revenue / orders"
              icon={<ShoppingBag size={30} />}
              accent="orange"
            />

            <KpiCard
              title="Discounts"
              value={formatMoney(kpis.discounts)}
              subtitle="Total discounts"
              icon={<Percent size={30} />}
              accent="red"
            />

            <KpiCard
              title="Items Sold"
              value={formatNumber(kpis.itemsSold)}
              subtitle="Total quantity"
              icon={<Package size={30} />}
              accent="purple"
            />
          </section>

          <section className="mt-8 grid gap-6 lg:grid-cols-[2fr_1fr]">
            <LineChartCard
              title="Revenue Trend"
              data={revenueTrend}
            />

            <PieChartCard
              title="Sales Type Mix"
              data={salesTypeMix}
            />
          </section>

          <section className="mt-8 grid gap-6 lg:grid-cols-2">
            <BarChartCard
              title="Revenue by Country"
              data={countrySales}
            />

            <BarChartCard
              title="Top Stores by Sales"
              data={topStores}
            />
          </section>

          <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900">
              Top Selling Items
            </h3>

            <div className="mt-5 overflow-x-auto">
              <table className="w-full min-w-[900px] text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500">
                    <th className="py-3">Item No</th>
                    <th className="py-3">Item Description</th>
                    <th className="py-3">Quantity</th>
                    <th className="py-3">Net Sales</th>
                  </tr>
                </thead>

                <tbody>
                  {(salesData?.topItems || []).map((item: any) => (
                    <tr
                      key={item.item_no}
                      className="border-b border-slate-100 text-slate-700"
                    >
                      <td className="py-4 font-semibold">{item.item_no}</td>
                      <td className="py-4">{item.item_description}</td>
                      <td className="py-4">{formatNumber(item.quantity)}</td>
                      <td className="py-4 font-semibold">
                        {formatMoney(item.net_sales)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}
    </BrandLayout>
  );
}

export default SalesDashboard;