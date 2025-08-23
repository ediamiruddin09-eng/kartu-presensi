// api/student/[nisn]/pdf.js (Vercel Serverless Function, CommonJS)
const { createStudentCardPdfByNISN } = require('../../../lib/cetakPDF');


module.exports = async (req, res) => {
try {
const { nisn } = req.query;
if (!nisn) return res.status(400).json({ error: 'Parameter nisn wajib' });


const pdfBuffer = await createStudentCardPdfByNISN(nisn);
res.setHeader('Content-Type', 'application/pdf');
res.setHeader('Content-Disposition', 'inline; filename="kartu-presensi.pdf"');
res.status(200).send(pdfBuffer);
} catch (err) {
console.error(err);
res.status(500).json({ error: err.message || 'Gagal membuat PDF' });
}
};