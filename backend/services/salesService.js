const AdmZip = require("adm-zip");
const { parse } = require("csv-parse/sync");
const { getData } = require("./excelService");

const SALES_BASE_URL =
  process.env.SALES_BASE_URL ||
  "https://sprinkleztrading.com/sales-data/monthly";

function normalize(value) {
  return String(value || "").trim().toUpperCase();
}

function toNumber(value) {
  const num = Number(value || 0);
  return Number.isNaN(num) ? 0 : num;
}

function parseDate(value) {
  if (!value) return null;
  return String(value).split(" ")[0];
}

async function downloadZip(month = "2026_06") {
  const url = `${SALES_BASE_URL}/${month}_sales.zip`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Failed to download sales file: ${url}`);
  }

  const arrayBuffer = await response.arrayBuffer();
  return Buffer.from(arrayBuffer);
}

function buildStoreLookup() {
  const stores = getData("stores");
  const brands = getData("brands");
  const countries = getData("countries");
  const companies = getData("companies");

  const brandMap = new Map(
    brands.map((brand) => [normalize(brand.brand_code), brand.brand_name])
  );

  const countryMap = new Map(
    countries.map((country) => [
      normalize(country.country_code),
      country.country_name,
    ])
  );

  const companyMap = new Map(
    companies.map((company) => [
      normalize(company.company_code),
      company.company_name,
    ])
  );

  const storeMap = new Map();

  stores.forEach((store) => {
    const storeCode = String(store.store_code || "").trim();
    const brandCode = normalize(store.brand_code);
    const countryCode = normalize(store.country_code);
    const companyCode = normalize(store.company_code);

    storeMap.set(storeCode, {
      store_code: storeCode,
      store_name: store.store_name,
      brand_code: brandCode,
      brand_name: brandMap.get(brandCode) || brandCode,
      country_code: countryCode,
      country_name: countryMap.get(countryCode) || countryCode,
      company_code: companyCode,
      company_name: companyMap.get(companyCode) || companyCode,
      status: store.status,
    });
  });

  return storeMap;
}

function parseZipCsv(buffer) {
  const zip = new AdmZip(buffer);
  const entries = zip.getEntries();

  let allRows = [];

  entries.forEach((entry) => {
    if (!entry.entryName.toLowerCase().endsWith(".csv")) return;

    const csvText = entry.getData().toString("utf8");

    const rows = parse(csvText, {
      columns: true,
      skip_empty_lines: true,
      bom: true,
      relax_quotes: true,
      relax_column_count: true,
    });

    allRows = allRows.concat(rows);
  });

  return allRows;
}

async function getSalesDashboard({ brandCode, month = "2026_06" }) {
  const zipBuffer = await downloadZip(month);
  const rawRows = parseZipCsv(zipBuffer);
  const storeLookup = buildStoreLookup();

  const enrichedRows = rawRows
    .map((row) => {
      const storeCode = String(row["Store No_"] || "").trim();
      const store = storeLookup.get(storeCode);

      if (!store) return null;

      const quantity = Math.abs(toNumber(row["Quantity"]));
      const netAmount = Math.abs(toNumber(row["Net Amount"]));
      const discount = Math.abs(toNumber(row["Discount Amount"]));

      return {
        date: parseDate(row["Date"]),
        store_code: storeCode,
        store_name: store.store_name,
        brand_code: store.brand_code,
        brand_name: store.brand_name,
        country_code: store.country_code,
        country_name: store.country_name,
        company_code: store.company_code,
        company_name: store.company_name,
        receipt_no: row["Receipt No_"],
        transaction_no: row["Transaction No_"],
        item_no: row["Item No_"],
        item_description: row["Item Description"],
        category_code: row["Item Category Code"],
        retail_product_code: row["Retail Product Code"],
        sales_type: row["Sales Type"] || "UNKNOWN",
        quantity,
        net_amount: netAmount,
        discount,
        net_sales: netAmount,
      };
    })
    .filter(Boolean)
    .filter((row) => normalize(row.brand_code) === normalize(brandCode));

  const netRevenue = enrichedRows.reduce(
    (sum, row) => sum + row.net_sales,
    0
  );

  const discounts = enrichedRows.reduce((sum, row) => sum + row.discount, 0);

  const itemsSold = enrichedRows.reduce((sum, row) => sum + row.quantity, 0);

  const uniqueReceipts = new Set(enrichedRows.map((row) => row.receipt_no));
  const orders = uniqueReceipts.size;

  const avgOrderValue = orders ? netRevenue / orders : 0;

  const countryMap = new Map();
  const companyMap = new Map();
  const salesTypeMap = new Map();
  const storeMap = new Map();
  const itemMap = new Map();
  const dateMap = new Map();

  enrichedRows.forEach((row) => {
    countryMap.set(
      row.country_name,
      (countryMap.get(row.country_name) || 0) + row.net_sales
    );

    companyMap.set(
      row.company_name,
      (companyMap.get(row.company_name) || 0) + row.net_sales
    );

    salesTypeMap.set(
      row.sales_type,
      (salesTypeMap.get(row.sales_type) || 0) + row.net_sales
    );

    dateMap.set(row.date, (dateMap.get(row.date) || 0) + row.net_sales);

    if (!storeMap.has(row.store_code)) {
      storeMap.set(row.store_code, {
        store_code: row.store_code,
        store_name: row.store_name,
        country_name: row.country_name,
        company_name: row.company_name,
        net_sales: 0,
        orders: new Set(),
      });
    }

    const storeData = storeMap.get(row.store_code);
    storeData.net_sales += row.net_sales;
    storeData.orders.add(row.receipt_no);

    if (!itemMap.has(row.item_no)) {
      itemMap.set(row.item_no, {
        item_no: row.item_no,
        item_description: row.item_description,
        quantity: 0,
        net_sales: 0,
      });
    }

    const itemData = itemMap.get(row.item_no);
    itemData.quantity += row.quantity;
    itemData.net_sales += row.net_sales;
  });

  const topStores = Array.from(storeMap.values())
    .map((store) => ({
      ...store,
      orders: store.orders.size,
      avg_order_value: store.orders.size
        ? store.net_sales / store.orders.size
        : 0,
    }))
    .sort((a, b) => b.net_sales - a.net_sales)
    .slice(0, 10);

  const topItems = Array.from(itemMap.values())
    .sort((a, b) => b.net_sales - a.net_sales)
    .slice(0, 10);

  return {
    success: true,
    brandCode,
    month,
    kpis: {
      netRevenue,
      orders,
      avgOrderValue,
      discounts,
      itemsSold,
      rows: enrichedRows.length,
    },
    revenueTrend: Array.from(dateMap.entries()).map(([date, value]) => ({
      date,
      value,
    })),
    countrySales: Array.from(countryMap.entries()).map(([name, value]) => ({
      name,
      value,
    })),
    companySales: Array.from(companyMap.entries()).map(([name, value]) => ({
      name,
      value,
    })),
    salesTypeMix: Array.from(salesTypeMap.entries()).map(([name, value]) => ({
      name,
      value,
    })),
    topStores,
    topItems,
  };
}

module.exports = {
  getSalesDashboard,
};