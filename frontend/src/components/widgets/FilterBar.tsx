interface FilterBarProps {
  showBrand?: boolean;
}

function FilterBar({ showBrand = true }: FilterBarProps) {
  return (
    <section className="mb-8 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="font-bold text-slate-900">Dashboard Filters</h3>
          <p className="text-sm text-slate-500">
            Filter data by date, brand, country, company and store
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-7">
        <div>
          <label className="mb-2 block text-xs font-semibold text-slate-500">
            Date From
          </label>
          <input
            type="date"
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
          />
        </div>

        <div>
          <label className="mb-2 block text-xs font-semibold text-slate-500">
            Date To
          </label>
          <input
            type="date"
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100"
          />
        </div>

        {showBrand && (
          <div>
            <label className="mb-2 block text-xs font-semibold text-slate-500">
              Brand
            </label>
            <select className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100">
              <option>All Brands</option>
            </select>
          </div>
        )}

        <div>
          <label className="mb-2 block text-xs font-semibold text-slate-500">
            Country
          </label>
          <select className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100">
            <option>All Countries</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-xs font-semibold text-slate-500">
            Company
          </label>
          <select className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100">
            <option>All Companies</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-xs font-semibold text-slate-500">
            Store
          </label>
          <select className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-100">
            <option>All Stores</option>
          </select>
        </div>

        <div className="flex items-end gap-2">
          <button className="flex-1 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700">
            Refresh
          </button>

          <button className="rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-100">
            Reset
          </button>
        </div>
      </div>
    </section>
  );
}

export default FilterBar;