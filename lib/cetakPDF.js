// lib/cetakPDF.js (CommonJS)
const PDFDocument = require('pdfkit');
const axios = require('axios');
const { getStudentData } = require('./getData');
async function createStudentCardPdfByNISN(nisn) {
const student = await getStudentData(nisn);
if (!student) throw new Error('Siswa tidak ditemukan');
// Ambil QR image sebagai buffer
const qrResp = await axios.get(student.qrcodeUrl, { responseType:
'arraybuffer' });
const qrBuffer = Buffer.from(qrResp.data);
// Buat PDF ke dalam buffer (collect chunks)
const doc = new PDFDocument({ size: 'A4', margin: 50 });
const chunks = [];
return await new Promise((resolve, reject) => {
doc.on('data', (c) => chunks.push(c));
doc.on('end', () => resolve(Buffer.concat(chunks)));
doc.on('error', reject);
// Heading
doc.fontSize(20).text('KARTU PRESENSI SISWA', { align: 'center' });
3
doc.moveDown(1.2);
// Card box
const cardW = 300;
const cardH = 420;
const x = (doc.page.width - cardW) / 2;
const y = 120;
doc.roundedRect(x, y, cardW, cardH, 12).stroke();
// Isi kartu
const pad = 18;
let cursorY = y + pad;
doc.fontSize(14).text(`Kelas: ${student.kelas}`, x + pad, cursorY, { width:
cardW - pad * 2 });
cursorY += 24;
doc.text(`NISN: ${student.nisn}`, x + pad, cursorY, { width: cardW - pad *
2 });
cursorY += 24;
doc.text(`Nama: ${student.nama}`, x + pad, cursorY, { width: cardW - pad *
2 });
// QR (centered)
const qrSize = 150;
const qrX = x + (cardW - qrSize) / 2;
const qrY = y + cardH / 2 - qrSize / 2;
doc.image(qrBuffer, qrX, qrY, { width: qrSize, height: qrSize });
// Keterangan
doc.text(`Keterangan: ${student.ket}`, x + pad, y + cardH - pad - 18, {
width: cardW - pad * 2,
align: 'center',
});
doc.end();
});
}
module.exports = { createStudentCardPdfByNISN };