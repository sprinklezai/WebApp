const fs = require("fs");
const path = require("path");
const os = require("os");
const { google } = require("googleapis");

const SALES_FOLDER_ID = process.env.GOOGLE_DRIVE_SALES_FOLDER_ID;

// ---- Config validation (fails fast at startup, not mid-request) ----
function getConfig() {
  const clientEmail = process.env.GOOGLE_CLIENT_EMAIL;
  const rawKey = process.env.GOOGLE_PRIVATE_KEY;
  const folderId = process.env.GOOGLE_DRIVE_SALES_FOLDER_ID;

  if (!clientEmail) throw new Error("GOOGLE_CLIENT_EMAIL is missing");
  if (!rawKey) throw new Error("GOOGLE_PRIVATE_KEY is missing");
  if (!folderId) throw new Error("GOOGLE_DRIVE_SALES_FOLDER_ID is missing");

  const privateKey = rawKey.replace(/\\n/g, "\n");

  if (!privateKey.includes("BEGIN PRIVATE KEY")) {
    throw new Error(
      "GOOGLE_PRIVATE_KEY is malformed — missing '-----BEGIN PRIVATE KEY-----' marker. " +
      "Check that the full key was pasted into the Render env variable."
    );
  }

  return { clientEmail, privateKey, folderId };
}

// ---- Singleton Drive client (avoid re-authenticating every call) ----
let driveClient = null;

function getDriveClient() {
  if (driveClient) return driveClient;

  const { clientEmail, privateKey } = getConfig();

  const auth = new google.auth.JWT({
    email: clientEmail,
    key: privateKey,
    scopes: ["https://www.googleapis.com/auth/drive.readonly"],
  });

  driveClient = google.drive({ version: "v3", auth });
  return driveClient;
}

// ---- Find the file metadata ----
async function findSalesZipFile(month) {
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

// ---- Stream download to disk instead of buffering in memory ----
// Large files loaded via `arraybuffer` sit entirely in RAM, which is the
// most common cause of crashes/timeouts on Render for big Drive files.
// Streaming to a temp file keeps memory flat regardless of file size.
async function downloadSalesZipFromDrive(month = "2026_06") {
  const drive = getDriveClient();
  const file = await findSalesZipFile(month);

  const tempPath = path.join(os.tmpdir(), `${month}_sales_${Date.now()}.zip`);
  const destStream = fs.createWriteStream(tempPath);

  const response = await drive.files.get(
    { fileId: file.id, alt: "media" },
    { responseType: "stream" }
  );

  await new Promise((resolve, reject) => {
    response.data
      .on("end", resolve)
      .on("error", reject)
      .pipe(destStream)
      .on("error", reject);
  });

  return { filePath: tempPath, fileName: file.name, size: file.size };
}

// ---- Optional: clean up temp file after processing ----
function cleanupTempFile(filePath) {
  fs.unlink(filePath, (err) => {
    if (err) console.warn(`Failed to delete temp file: ${filePath}`, err.message);
  });
}

module.exports = {
  downloadSalesZipFromDrive,
  cleanupTempFile,
};