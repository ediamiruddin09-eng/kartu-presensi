// api/student/[nisn].js (Vercel Serverless Function, CommonJS)
const { getStudentData } = require('../../lib/getData');


module.exports = async (req, res) => {
try {
const { nisn } = req.query;
if (!nisn) return res.status(400).json({ error: 'Parameter nisn wajib' });


const data = await getStudentData(nisn);
if (!data) return res.status(404).json({ error: 'Siswa tidak ditemukan' });


res.status(200).json(data);
} catch (err) {
console.error(err);
res.status(500).json({ error: err.message || 'Internal error' });
}
};