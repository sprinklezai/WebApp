const xlsx = require("xlsx");
const path = require("path");

const fileMap = {
    brands: "Brand_Master.xlsx",
    companies: "Company_Master.xlsx",
    countries: "Country_Master.xlsx",
    stores: "Store_Master.xlsx"
};

function getData(type) {
    const fileName = fileMap[type.toLowerCase()];

    if (!fileName) {
        throw new Error("Invalid data type");
    }

    const filePath = path.join(__dirname, "../../data", fileName);

    const workbook = xlsx.readFile(filePath);
    const sheet = workbook.Sheets[workbook.SheetNames[0]];

    return xlsx.utils.sheet_to_json(sheet);
}

module.exports = { getData };