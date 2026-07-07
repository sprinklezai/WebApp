import { useParams } from "react-router-dom";
import {
  BarChart3,
  Globe2,
  Store,
  TrendingUp,
} from "lucide-react";

import BrandLayout from "../layouts/BrandLayout";
import KpiCard from "../components/widgets/KpiCard";

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
    <BrandLayout brandCode={code} brandName={brandName}>
      <section className="mb-8 rounded-3xl border border-blue-100 bg-gradient-to-r from-blue-50 via-white to-blue-100 p-8 shadow-sm">
        <p className="mb-2 text-sm font-semibold text-blue-600">
          Brand Workspace
        </p>

        <h1 className="text-4xl font-extrabold text-slate-900">
          {brandName} Sales Dashboard
        </h1>

        <p className="mt-3 max-w-3xl text-slate-500">
          View brand-specific sales, store performance, country contribution,
          delivery business, customer reviews and project pipeline.
        </p>
      </section>

      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <KpiCard
          title="Net Sales"
          value="--"
          subtitle="Coming from Sales.xlsx"
          icon={<TrendingUp size={30} />}
          accent="blue"
        />

        <KpiCard
          title="Total Stores"
          value="--"
          subtitle="Brand store count"
          icon={<Store size={30} />}
          accent="green"
        />

        <KpiCard
          title="Countries"
          value="--"
          subtitle="Brand presence"
          icon={<Globe2 size={30} />}
          accent="orange"
        />

        <KpiCard
          title="Transactions"
          value="--"
          subtitle="Total bills"
          icon={<BarChart3 size={30} />}
          accent="purple"
        />
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="font-bold text-slate-900">Sales Trend</h3>
          <p className="mt-2 text-sm text-slate-500">
            Daily and monthly sales chart will be connected in the Sales sprint.
          </p>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="font-bold text-slate-900">Top Stores</h3>
          <p className="mt-2 text-sm text-slate-500">
            Store ranking will be calculated from sales and store master data.
          </p>
        </div>
      </section>
    </BrandLayout>
  );
}

export default BrandDashboard;