import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Banknote,
  Receipt,
  Percent,
  ShoppingBag,
  Package,
  Store,
  TrendingUp,
  Building2,
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

  const [month, setMonth] = useState("2026_06");
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedCompany, setSelectedCompany] = useState("");
  const [selectedStore, setSelectedStore] = useState("");
  const [selectedSalesType, setSelectedSalesType] = useState("");
  const [search, setSearch] = useState("");

  const formatMoney = (value: number) =>
    `د.ك ${Number(value || 0).toLocaleString(undefined, {
      maximumFractionDigits: 2,
    })}`;

  const formatNumber = (value: number) =>
    Number(value || 0).toLocaleString(undefined, {
      maximumFractionDigits: 0,
    });

  const loadSales = async () => {
    try {
      setLoading(true);

      const data = await getSalesDashboard(code, month, {
        country: selectedCountry,
        company: selectedCompany,
        store: selectedStore,
        salesType: selectedSalesType,
        search,
      });

      setSalesData(data);
    } catch (error) {
      console.error("Sales dashboard loading failed:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (code) {
      loadSales();
    }
  }, [code, month, selectedCountry, selectedCompany, selectedStore, selectedSalesType]);

  const kpis = salesData?.kpis || {
    netRevenue: 0,
    orders: 0,
    avgOrderValue: 0,
    discounts: 0,
    itemsSold: 0,
    activeStores: 0,
    averageDailySales: 0,
    averageDailySalesPerOutlet: 0,
  };

  const brandName = salesData?.brandName || salesData?.brandCode || code;

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

  const resetFilters = () => {
    setSelectedCountry("");
    setSelectedCompany("");
    setSelectedStore("");
    setSelectedSalesType("");
    setSearch("");
  };

  return (
    <BrandLayout brandCode={code} brandName={brandName}>
      <section className="mb-6 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">
              Business Overview
            </h1>
            <p className="text-sm text-slate-500">
              {brandName} · Sales Performance · Selected Period
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-7">
            <select
              value={selectedStore}
              onChange={(e) => setSelectedStore(e.target.value)}
              className="rounded-xl border border-slate-300 px-4 py-3 text-sm"
            >
              <option value="">All Locations</option>
              {(salesData?.filters?.stores || []).map((store: any) => (
                <option key={store.store_code} value={store.store_code}>
                  {store.store_name}
                </option>
              ))}
            </select>

            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="rounded-xl border border-slate-300 px-4 py-3 text-sm"
            >
              <option value="">All Countries</option>
              {(salesData?.filters?.countries || []).map((country: string) => (
                <option key={country} value={country}>
                  {country}
                </option>
              ))}
            </select>

            <select
              value={selectedCompany}
              onChange={(e) => setSelectedCompany(e.target.value)}
              className="rounded-xl border border-slate-300 px-4 py-3 text-sm"
            >
              <option value="">All Companies</option>
              {(salesData?.filters?.companies || []).map((company: string) => (
                <option key={company} value={company}>
                  {company}
                </option>
              ))}
            </select>

            <select
              value={selectedSalesType}
              onChange={(e) => setSelectedSalesType(e.target.value)}
              className="rounded-xl border border-slate-300 px-4 py-3 text-sm"
            >
              <option value="">All Channels</option>
              {(salesData?.filters?.salesTypes || []).map((type: string) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>

            <select
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="rounded-xl border border-slate-300 px-4 py-3 text-sm"
            >
              <option value="2026_06">MTD - Jun 2026</option>
            </select>

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") loadSales();
              }}
              placeholder="Search products..."
              className="rounded-xl border border-slate-300 px-4 py-3 text-sm"
            />

            <div className="flex gap-2">
              <button
                onClick={loadSales}
                className="rounded-xl bg-emerald-700 px-4 py-3 text-sm font-semibold text-white hover:bg-emerald-800"
              >
                Refresh
              </button>

              <button
                onClick={resetFilters}
                className="rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-100"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      </section>

      {loading ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-8 text-slate-500 shadow-sm">
          Loading sales dashboard...
        </div>
      ) : (
        <>
          <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
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
              subtitle={`${Number(kpis.discountPercent || 0).toFixed(1)}% of revenue`}
              icon={<Percent size={30} />}
              accent="red"
            />
          </section>

          <section className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            <KpiCard
              title="Items Sold"
              value={formatNumber(kpis.itemsSold)}
              subtitle="Total quantity"
              icon={<Package size={30} />}
              accent="purple"
            />

            <KpiCard
              title="Active Stores"
              value={formatNumber(kpis.activeStores)}
              subtitle="Stores with sales"
              icon={<Store size={30} />}
              accent="blue"
            />

            <KpiCard
              title="Avg Daily Sales"
              value={formatMoney(kpis.averageDailySales)}
              subtitle="Daily average"
              icon={<TrendingUp size={30} />}
              accent="green"
            />

            <KpiCard
              title="ADS / Outlet"
              value={formatMoney(kpis.averageDailySalesPerOutlet)}
              subtitle="Avg daily sales per outlet"
              icon={<Building2 size={30} />}
              accent="orange"
            />
          </section>

          <section className="mt-8 grid gap-6 lg:grid-cols-[2fr_1fr]">
            <LineChartCard title="Revenue Trend" data={revenueTrend} />
            <PieChartCard title="Channel Mix" data={salesTypeMix} />
          </section>

          <section className="mt-8 grid gap-6 lg:grid-cols-2">
            <BarChartCard title="Revenue by Country" data={countrySales} />
            <BarChartCard title="Top Stores by Sales" data={topStores} />
          </section>

          <section className="mt-8 grid gap-6 lg:grid-cols-2">
            <RankingTable
              title="Top Selling Items"
              data={salesData?.topItems || []}
              formatMoney={formatMoney}
              formatNumber={formatNumber}
            />

            <RankingTable
              title="Bottom Selling Items"
              data={salesData?.bottomItems || []}
              formatMoney={formatMoney}
              formatNumber={formatNumber}
            />
          </section>

          <section className="mt-8 grid gap-6 lg:grid-cols-2">
            <StoreRankingTable
              title="Top Stores"
              data={salesData?.topStores || []}
              formatMoney={formatMoney}
              formatNumber={formatNumber}
            />

            <StoreRankingTable
              title="Bottom Stores"
              data={salesData?.bottomStores || []}
              formatMoney={formatMoney}
              formatNumber={formatNumber}
            />
          </section>
        </>
      )}
    </BrandLayout>
  );
}

function RankingTable({ title, data, formatMoney, formatNumber }: any) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="text-lg font-bold text-slate-900">{title}</h3>

      <div className="mt-5 overflow-x-auto">
        <table className="w-full min-w-[600px] text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-slate-500">
              <th className="py-3">Item No</th>
              <th className="py-3">Description</th>
              <th className="py-3">Qty</th>
              <th className="py-3">Net Sales</th>
            </tr>
          </thead>

          <tbody>
            {data.map((item: any) => (
              <tr key={item.item_no} className="border-b border-slate-100 text-slate-700">
                <td className="py-4 font-semibold">{item.item_no}</td>
                <td className="py-4">{item.item_description}</td>
                <td className="py-4">{formatNumber(item.quantity)}</td>
                <td className="py-4 font-semibold">{formatMoney(item.net_sales)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function StoreRankingTable({ title, data, formatMoney, formatNumber }: any) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <h3 className="text-lg font-bold text-slate-900">{title}</h3>

      <div className="mt-5 overflow-x-auto">
        <table className="w-full min-w-[700px] text-left text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-slate-500">
              <th className="py-3">Store</th>
              <th className="py-3">Country</th>
              <th className="py-3">Orders</th>
              <th className="py-3">Net Sales</th>
              <th className="py-3">Avg Order</th>
            </tr>
          </thead>

          <tbody>
            {data.map((store: any) => (
              <tr key={store.store_code} className="border-b border-slate-100 text-slate-700">
                <td className="py-4 font-semibold">{store.store_name}</td>
                <td className="py-4">{store.country_name}</td>
                <td className="py-4">{formatNumber(store.orders)}</td>
                <td className="py-4 font-semibold">{formatMoney(store.net_sales)}</td>
                <td className="py-4">{formatMoney(store.avg_order_value)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default SalesDashboard;