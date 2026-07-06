import { useEffect, useState } from "react";
import {
  Building2,
  CheckCircle2,
  Globe2,
  Store,
  Tag,
  Users,
  XCircle,
} from "lucide-react";

import DashboardLayout from "../layouts/DashboardLayout";
import { useAuth } from "../context/AuthContext";

import {
  getBrands,
  getCompanies,
  getCountries,
  getStores,
  getEmployees,
} from "../services/dataService";

import KpiCard from "../components/widgets/KpiCard";
import BrandCard from "../components/widgets/BrandCard";

const brandLogoMap: Record<string, string> = {
  ALB: "/brand-logos/allo-beirut.png",
  WSP: "/brand-logos/wingstop.png",
  CSC: "/brand-logos/coldstone.png",
  SLI: "/brand-logos/sushi-library.png",
  NAN: "/brand-logos/nandos.png",
  JMP: "/brand-logos/jamies-pizzeria.png",
  JMT: "/brand-logos/jamies-italian.png",
  MCC: "/brand-logos/molten.png",
};

function Overview() {
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [brands, setBrands] = useState<any[]>([]);
  const [stores, setStores] = useState<any[]>([]);

  const [kpis, setKpis] = useState({
    stores: 0,
    brands: 0,
    companies: 0,
    countries: 0,
    employees: 0,
    activeStores: 0,
    inactiveStores: 0,
  });

  const hour = new Date().getHours();

  const greeting =
    hour < 12 ? "Good Morning" : hour < 17 ? "Good Afternoon" : "Good Evening";

  const getBrandCode = (item: any) => {
    return String(item.brand_code || "").trim().toUpperCase();
  };

  const getBrandName = (item: any) => {
    return String(item.brand_name || item.brand_desc || "Brand").trim();
  };

  const getCountry = (item: any) => {
    return String(item.country_code || "").trim().toUpperCase();
  };

  const getStatus = (item: any) => {
    return String(item.status || "").trim().toLowerCase();
  };

  useEffect(() => {
    async function loadOverviewData() {
      try {
        const [brandData, companyData, countryData, storeData, employeeData] =
          await Promise.all([
            getBrands(),
            getCompanies(),
            getCountries(),
            getStores(),
            getEmployees(),
          ]);

        const activeStores = storeData.filter((store: any) => {
          const status = getStatus(store);
          return status === "yes" || status === "active";
        }).length;

        const inactiveStores = storeData.filter((store: any) => {
          const status = getStatus(store);
          return status === "no" || status === "inactive";
        }).length;

        setBrands(brandData);
        setStores(storeData);

        setKpis({
          stores: storeData.length,
          brands: brandData.length,
          companies: companyData.length,
          countries: countryData.length,
          employees: employeeData.length,
          activeStores,
          inactiveStores,
        });
      } catch (error) {
        console.error("Overview data loading failed:", error);
      } finally {
        setLoading(false);
      }
    }

    loadOverviewData();
  }, []);

  const brandCards = brands.map((brand) => {
    const code = getBrandCode(brand);
    const name = getBrandName(brand);

    const brandStores = stores.filter((store) => getBrandCode(store) === code);

    const countryCount = new Set(
      brandStores.map((store) => getCountry(store)).filter(Boolean)
    ).size;

    return {
      code,
      name,
      logo: brandLogoMap[code] || "",
      stores: brandStores.length,
      countries: countryCount,
    };
  });

  const activePercent =
    kpis.stores > 0 ? Math.round((kpis.activeStores / kpis.stores) * 100) : 0;

  const inactivePercent =
    kpis.stores > 0 ? Math.round((kpis.inactiveStores / kpis.stores) * 100) : 0;

  return (
    <DashboardLayout>
      <section className="mb-8 overflow-hidden rounded-3xl border border-blue-100 bg-gradient-to-r from-blue-50 via-white to-blue-100 p-8 shadow-sm">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <h1 className="text-4xl font-extrabold text-slate-900">
              {greeting}, {user?.emp_name} 👋
            </h1>

            <p className="mt-3 text-lg font-semibold text-slate-700">
              Welcome to Sprinklez General Trading F&amp;B Division
            </p>

            <p className="mt-2 text-slate-500">
              Executive Overview Dashboard
            </p>
          </div>

          <div className="hidden items-end justify-end lg:flex">
            <div className="w-full rounded-3xl bg-white/60 p-6 text-right text-blue-500">
              <p className="text-sm font-semibold">Business Overview</p>
              <p className="mt-2 text-5xl font-black text-blue-600">
                F&amp;B
              </p>
              <p className="mt-2 text-sm text-slate-500">
                Brands · Stores · Countries · Companies
              </p>
            </div>
          </div>
        </div>
      </section>

      {loading ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-8 text-slate-500 shadow-sm">
          Loading overview data...
        </div>
      ) : (
        <>
          <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            <KpiCard
              title="Total Stores"
              value={kpis.stores}
              subtitle="Across all brands"
              icon={<Store size={30} />}
              accent="blue"
            />

            <KpiCard
              title="Total Brands"
              value={kpis.brands}
              subtitle="Brand portfolio"
              icon={<Tag size={30} />}
              accent="green"
            />

            <KpiCard
              title="Total Companies"
              value={kpis.companies}
              subtitle="Company entities"
              icon={<Building2 size={30} />}
              accent="purple"
            />

            <KpiCard
              title="Total Countries"
              value={kpis.countries}
              subtitle="Global presence"
              icon={<Globe2 size={30} />}
              accent="orange"
            />
          </section>

          <section className="mt-6 grid gap-6 lg:grid-cols-3">
            <KpiCard
              title="Active Stores"
              value={kpis.activeStores}
              subtitle={`${activePercent}% operating stores`}
              icon={<CheckCircle2 size={34} />}
              accent="green"
            />

            <KpiCard
              title="Inactive Stores"
              value={kpis.inactiveStores}
              subtitle={`${inactivePercent}% non-operational stores`}
              icon={<XCircle size={34} />}
              accent="red"
            />

            <KpiCard
              title="Total Employees"
              value={kpis.employees}
              subtitle="Across all companies"
              icon={<Users size={34} />}
              accent="blue"
            />
          </section>

          <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex flex-col justify-between gap-2 md:flex-row md:items-center">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Our Brand Portfolio
                </h2>
                <p className="text-sm text-slate-500">
                  Click on any brand to view detailed performance
                </p>
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
              {brandCards.map((brand) => (
                <BrandCard
                  key={brand.code}
                  name={brand.name}
                  code={brand.code}
                  logo={brand.logo}
                  stores={brand.stores}
                  countries={brand.countries}
                />
              ))}
            </div>
          </section>

          <section className="mt-8 grid gap-6 lg:grid-cols-3">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="font-bold text-slate-900">Stores by Country</h3>
              <p className="mt-2 text-sm text-slate-500">
                Country contribution summary will be added in chart sprint.
              </p>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="font-bold text-slate-900">
                Top Brands by Store Count
              </h3>

              <div className="mt-5 space-y-4">
                {[...brandCards]
                  .sort((a, b) => b.stores - a.stores)
                  .slice(0, 5)
                  .map((brand) => (
                    <div key={brand.code}>
                      <div className="mb-1 flex justify-between text-sm">
                        <span className="font-medium text-slate-700">
                          {brand.name}
                        </span>
                        <span className="font-semibold text-slate-900">
                          {brand.stores}
                        </span>
                      </div>

                      <div className="h-2 rounded-full bg-slate-100">
                        <div
                          className="h-2 rounded-full bg-blue-600"
                          style={{
                            width: `${
                              kpis.stores > 0
                                ? Math.min(
                                    100,
                                    (brand.stores / kpis.stores) * 100
                                  )
                                : 0
                            }%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="font-bold text-slate-900">Companies Overview</h3>
              <p className="mt-2 text-sm text-slate-500">
                Company-wise analysis will be connected in the next sprint.
              </p>
            </div>
          </section>
        </>
      )}
    </DashboardLayout>
  );
}

export default Overview;