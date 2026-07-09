const { google } = require("googleapis");

const SALES_FOLDER_ID = process.env.GOOGLE_DRIVE_SALES_FOLDER_ID;

function parseServiceAccountJson() {
  let raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;

  if (!raw) {
    throw new Error("GOOGLE_SERVICE_ACCOUNT_JSON is missing");
  }

  raw = raw.trim();

  // Fix Hostinger escaped JSON issue
  if (raw.startsWith("\\{")) {
    raw = raw.replace(/^\\/, "");
  }

  raw = raw.replace(/\\"/g, '"');
  raw = raw.replace(/\\n/g, "\n");

  return JSON.parse(raw);
}

function getDriveClient() {
  const credentials = parseServiceAccountJson();

  const auth = new google.auth.JWT({
    email: credentials.client_email,
    key: credentials.private_key,
    scopes: ["https://www.googleapis.com/auth/drive.readonly"],
  });

  return google.drive({ version: "v3", auth });
}

async function findSalesZipFile(month = "2026_06") {
  const drive = getDriveClient();
  const fileName = `${month}_sales.zip`;

  const response = await drive.files.list({
    q: `'${SALES_FOLDER_ID}' in parents and name='${fileName}' and trashed=false`,
    fields: "files(id, name, size, modifiedTime)",
  });

  const file = response.data.files?.[0];

  if (!file) {
    throw new Error(`Sales ZIP not found in Google Drive: ${fileName}`);
  }

  return file;
}

async function downloadSalesZipFromDrive(month = "2026_06") {
  const drive = getDriveClient();
  const file = await findSalesZipFile(month);

  const response = await drive.files.get(
    {
      fileId: file.id,
      alt: "media",
    },
    {
      responseType: "arraybuffer",
    }
  );

  return Buffer.from(response.data);
}

module.exports = {
  downloadSalesZipFromDrive,
};