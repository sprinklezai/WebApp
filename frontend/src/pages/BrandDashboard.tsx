import { useParams } from "react-router-dom";
import {
  TrendingUp,
  Store,
  Globe2,
  Receipt,
} from "lucide-react";

import BrandLayout from "../layouts/BrandLayout";
import KpiCard from "../components/widgets/KpiCard";
import FilterBar from "../components/widgets/FilterBar";

const brandNameMap: Record<string, string> = {
  ALB: "Allo Beirut",
  WSP: "Wingstop",
  CSC: "Cold Stone Creamery",
  SLI: "Sushi Library",
  NAN: "Nando's",
  JMP: "Jamie's Pizzeria",
  JMT: "Jamie's Italian",
  MCC: "Molten Chocolate Café",
};

function BrandDashboard() {
  const { brandCode } = useParams();

  const code = String(brandCode || "").toUpperCase();

  const brandName = brandNameMap[code] || code;

  return (
    <BrandLayout
      brandCode={code}
      brandName={brandName}
    >
      {/* Hero */}

      <section className="mb-8 overflow-hidden rounded-3xl border border-blue-100 bg-gradient-to-r from-blue-50 via-white to-blue-100 p-8 shadow-sm">

        <p className="mb-2 text-sm font-semibold text-blue-600">
          Brand Dashboard
        </p>

        <h1 className="text-4xl font-extrabold text-slate-900">
          {brandName}
        </h1>

        <p className="mt-3 max-w-3xl text-slate-500 leading-7">
          Executive sales dashboard for {brandName}. Monitor sales,
          transactions, country contribution, store performance,
          delivery business and customer insights.
        </p>

      </section>

      {/* Filters */}

      <FilterBar showBrand={false} />

      {/* KPI Cards */}

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

        <KpiCard
          title="Net Sales"
          value="--"
          subtitle="Selected Period"
          icon={<TrendingUp size={30} />}
          accent="blue"
        />

        <KpiCard
          title="Transactions"
          value="--"
          subtitle="Total Bills"
          icon={<Receipt size={30} />}
          accent="green"
        />

        <KpiCard
          title="Stores"
          value="--"
          subtitle="Operating Stores"
          icon={<Store size={30} />}
          accent="orange"
        />

        <KpiCard
          title="Countries"
          value="--"
          subtitle="Brand Presence"
          icon={<Globe2 size={30} />}
          accent="purple"
        />

      </section>

      {/* Charts */}

      <section className="mt-8 grid gap-6 lg:grid-cols-2">

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

          <h3 className="text-lg font-bold text-slate-900">
            Sales Trend
          </h3>

          <p className="mt-3 text-sm text-slate-500">
            Daily / Weekly / Monthly sales trend chart
            will be connected from Sales.xlsx.
          </p>

          <div className="mt-8 flex h-72 items-center justify-center rounded-2xl bg-slate-50 text-slate-400">
            Sales Chart
          </div>

        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

          <h3 className="text-lg font-bold text-slate-900">
            Country Contribution
          </h3>

          <p className="mt-3 text-sm text-slate-500">
            Contribution by country.
          </p>

          <div className="mt-8 flex h-72 items-center justify-center rounded-2xl bg-slate-50 text-slate-400">
            Doughnut Chart
          </div>

        </div>

      </section>

      {/* Bottom Section */}

      <section className="mt-8 grid gap-6 lg:grid-cols-2">

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

          <h3 className="text-lg font-bold text-slate-900">
            Top Performing Stores
          </h3>

          <div className="mt-6 flex h-80 items-center justify-center rounded-2xl bg-slate-50 text-slate-400">
            Top Stores
          </div>

        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">

          <h3 className="text-lg font-bold text-slate-900">
            Store Performance
          </h3>

          <div className="mt-6 flex h-80 items-center justify-center rounded-2xl bg-slate-50 text-slate-400">
            Store Table
          </div>

        </div>

      </section>

    </BrandLayout>
  );
}

export default BrandDashboard;