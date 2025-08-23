// lib/getData.js (CommonJS)


async function getStudentData(nisn) {
const auth = getAuth();
const sheets = google.sheets({ version: 'v4', auth });
const res = await sheets.spreadsheets.values.get({
spreadsheetId: SPREADSHEET_ID,
range: RANGE,
});


const rows = res.data.values || [];
if (rows.length === 0) return null;


const headers = rows[0];
const nisnIdx = headers.indexOf('nisn');
const namaIdx = headers.indexOf('nama');
const kelasIdx = headers.indexOf('kelas');
const ketIdx = headers.indexOf('ket');


if (nisnIdx === -1 || namaIdx === -1 || kelasIdx === -1 || ketIdx === -1) {
throw new Error('Kolom wajib (nisn, nama, kelas, ket) tidak ditemukan di baris header Sheet1');
}


for (let i = 1; i < rows.length; i++) {
const row = rows[i] || [];
if (String(row[nisnIdx]) === String(nisn)) {
const qrData = String(row[nisnIdx] || '');
const qrcodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(qrData)}`;
return {
kelas: row[kelasIdx] || '',
nisn: row[nisnIdx] || '',
nama: row[namaIdx] || '',
qrcodeUrl,
ket: row[ketIdx] || '',
};
}
}
return null;
}


module.exports = { getStudentData };