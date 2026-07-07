import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Building2,
  CheckCircle2,
  Globe2,
  Store,
  XCircle,
} from "lucide-react";

import BrandLayout from "../layouts/BrandLayout";
import KpiCard from "../components/widgets/KpiCard";
import FilterBar from "../components/widgets/FilterBar";
import { getBrandDashboard } from "../api/brand";

function BrandDashboard() {
  const { brandCode } = useParams();
  const code = String(brandCode || "").toUpperCase();

  const [loading, setLoading] = useState(true);
  const [brandData, setBrandData] = useState<any>(null);

  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedCompany, setSelectedCompany] = useState("");
  const [selectedStore, setSelectedStore] = useState("");

  useEffect(() => {
    async function loadBrand() {
      try {
        const data = await getBrandDashboard(code);
        setBrandData(data);
      } catch (error) {
        console.error("Brand dashboard loading failed:", error);
      } finally {
        setLoading(false);
      }
    }

    if (code) loadBrand();
  }, [code]);

  const brandName = brandData?.brand?.brand_name || code;
  const allStores = brandData?.stores || [];

  const filteredStores = useMemo(() => {
    return allStores.filter((store: any) => {
      const countryMatch =
        !selectedCountry ||
        String(store.country_code).trim().toUpperCase() === selectedCountry;

      const companyMatch =
        !selectedCompany ||
        String(store.company_code).trim().toUpperCase() === selectedCompany;

      const storeMatch =
        !selectedStore || String(store.store_code).trim() === selectedStore;

      return countryMatch && companyMatch && storeMatch;
    });
  }, [allStores, selectedCountry, selectedCompany, selectedStore]);

  const activeStores = filteredStores.filter((store: any) => {
    const status = String(store.status || "").trim().toLowerCase();
    return status === "yes" || status === "active";
  }).length;

  const inactiveStores = filteredStores.filter((store: any) => {
    const status = String(store.status || "").trim().toLowerCase();
    return status === "no" || status === "inactive";
  }).length;

  const countryOptions = useMemo(() => {
    const map = new Map<string, string>();

    allStores.forEach((store: any) => {
      const code = String(store.country_code || "").trim().toUpperCase();
      const name = String(store.country_name || code).trim();

      if (code) map.set(code, name);
    });

    return Array.from(map.entries()).map(([value, label]) => ({
      value,
      label,
    }));
  }, [allStores]);

  const companyOptions = useMemo(() => {
    const map = new Map<string, string>();

    allStores.forEach((store: any) => {
      const code = String(store.company_code || "").trim().toUpperCase();
      const name = String(store.company_name || code).trim();

      if (code) map.set(code, name);
    });

    return Array.from(map.entries()).map(([value, label]) => ({
      value,
      label,
    }));
  }, [allStores]);

  const storeOptions = useMemo(() => {
    return filteredStores.map((store: any) => ({
      value: String(store.store_code),
      label: `${store.store_code} - ${store.store_name}`,
    }));
  }, [filteredStores]);

  const countrySummary = useMemo(() => {
    const map = new Map<string, any>();

    filteredStores.forEach((store: any) => {
      const countryCode = String(store.country_code || "").trim().toUpperCase();
      const countryName = String(store.country_name || countryCode).trim();

      if (!countryCode) return;

      map.set(countryCode, {
        country_code: countryCode,
        country_name: countryName,
        stores: (map.get(countryCode)?.stores || 0) + 1,
      });
    });

    return Array.from(map.values()).sort((a, b) => b.stores - a.stores);
  }, [filteredStores]);

  const companySummary = useMemo(() => {
    const map = new Map<string, any>();

    filteredStores.forEach((store: any) => {
      const companyCode = String(store.company_code || "").trim().toUpperCase();
      const companyName = String(store.company_name || companyCode).trim();

      if (!companyCode) return;

      map.set(companyCode, {
        company_code: companyCode,
        company_name: companyName,
        stores: (map.get(companyCode)?.stores || 0) + 1,
      });
    });

    return Array.from(map.values()).sort((a, b) => b.stores - a.stores);
  }, [filteredStores]);

  const kpis = {
    stores: filteredStores.length,
    countries: countrySummary.length,
    companies: companySummary.length,
    activeStores,
    inactiveStores,
  };

  const handleReset = () => {
    setSelectedCountry("");
    setSelectedCompany("");
    setSelectedStore("");
  };

  return (
    <BrandLayout brandCode={code} brandName={brandName}>
      <section className="mb-8 overflow-hidden rounded-3xl border border-blue-100 bg-gradient-to-r from-blue-50 via-white to-blue-100 p-8 shadow-sm">
        <p className="mb-2 text-sm font-semibold text-blue-600">
          Brand Dashboard
        </p>

        <h1 className="text-4xl font-extrabold text-slate-900">
          {brandName}
        </h1>

        <p className="mt-3 max-w-3xl leading-7 text-slate-500">
          Executive brand dashboard showing store footprint, country presence,
          company distribution and operational status.
        </p>
      </section>

      {loading ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-8 text-slate-500 shadow-sm">
          Loading brand dashboard...
        </div>
      ) : (
        <>
          <FilterBar
            brandName={brandName}
            countries={countryOptions}
            companies={companyOptions}
            stores={storeOptions}
            selectedCountry={selectedCountry}
            selectedCompany={selectedCompany}
            selectedStore={selectedStore}
            onCountryChange={setSelectedCountry}
            onCompanyChange={setSelectedCompany}
            onStoreChange={setSelectedStore}
            onReset={handleReset}
          />

          <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-5">
            <KpiCard
              title="Total Stores"
              value={kpis.stores}
              subtitle="Filtered brand footprint"
              icon={<Store size={30} />}
              accent="blue"
            />

            <KpiCard
              title="Countries"
              value={kpis.countries}
              subtitle="Filtered presence"
              icon={<Globe2 size={30} />}
              accent="orange"
            />

            <KpiCard
              title="Companies"
              value={kpis.companies}
              subtitle="Filtered entities"
              icon={<Building2 size={30} />}
              accent="purple"
            />

            <KpiCard
              title="Active Stores"
              value={kpis.activeStores}
              subtitle="Operating stores"
              icon={<CheckCircle2 size={30} />}
              accent="green"
            />

            <KpiCard
              title="Inactive Stores"
              value={kpis.inactiveStores}
              subtitle="Non-operational"
              icon={<XCircle size={30} />}
              accent="red"
            />
          </section>

          <section className="mt-8 grid gap-6 lg:grid-cols-2">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900">
                Country Contribution
              </h3>

              <div className="mt-5 space-y-4">
                {countrySummary.map((country: any) => (
                  <div key={country.country_code}>
                    <div className="mb-1 flex justify-between text-sm">
                      <span className="font-medium text-slate-700">
                        {country.country_name}
                      </span>
                      <span className="font-semibold text-slate-900">
                        {country.stores}
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
                                  (country.stores / kpis.stores) * 100
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
              <h3 className="text-lg font-bold text-slate-900">
                Company Contribution
              </h3>

              <div className="mt-5 space-y-4">
                {companySummary.map((company: any) => (
                  <div key={company.company_code}>
                    <div className="mb-1 flex justify-between text-sm">
                      <span className="font-medium text-slate-700">
                        {company.company_name}
                      </span>
                      <span className="font-semibold text-slate-900">
                        {company.stores}
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
                                  (company.stores / kpis.stores) * 100
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
          </section>

          <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900">
              Store Directory
            </h3>

            <div className="mt-5 overflow-x-auto">
              <table className="w-full min-w-[1000px] text-left text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500">
                    <th className="py-3 font-semibold">Store Code</th>
                    <th className="py-3 font-semibold">Store Name</th>
                    <th className="py-3 font-semibold">Company</th>
                    <th className="py-3 font-semibold">Country</th>
                    <th className="py-3 font-semibold">Status</th>
                    <th className="py-3 font-semibold">Oracle Code</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredStores.map((store: any) => (
                    <tr
                      key={store.store_code}
                      className="border-b border-slate-100 text-slate-700"
                    >
                      <td className="py-4 font-semibold">
                        {store.store_code}
                      </td>
                      <td className="py-4">{store.store_name}</td>
                      <td className="py-4">{store.company_name}</td>
                      <td className="py-4">{store.country_name}</td>
                      <td className="py-4">
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${
                            String(store.status).toLowerCase() === "yes"
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-red-50 text-red-700"
                          }`}
                        >
                          {String(store.status).toLowerCase() === "yes"
                            ? "Active"
                            : "Inactive"}
                        </span>
                      </td>
                      <td className="py-4">{store.store_oracle_code}</td>
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

export default BrandDashboard;