// server.ts
import express, { Request, Response } from 'express';
import multer from 'multer';
import xlsx from 'xlsx';
import cors from 'cors';
import path from 'path';
import fs from 'fs';

const app = express();
const port = 5000;

// Middleware
app.use(cors());
const upload = multer({ dest: 'uploads/' });

// Load dataset from Excel file
const loadDataset = (filePath: string) => {
  const workbook = xlsx.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  return xlsx.utils.sheet_to_json(sheet);
};

// Calculate engagement metrics
const calculateEngagementMetrics = (data: any[]) => {
  return data.map(item => {
    const viewsPerSubscriber = item.total_views / item.subscribers || 0;
    const avgMonthlyIncome = (item.income_low + item.income_high) / 2 || 0;
    const incomePerSubscriber = avgMonthlyIncome / item.subscribers || 0;

    return {
      name: item.channel_name,
      views_per_subscriber: viewsPerSubscriber,
      avg_monthly_income: avgMonthlyIncome,
      income_per_subscriber: incomePerSubscriber
    };
  });
};

// Route to process uploaded file
app.post('/process', upload.single('file'), (req: Request, res: Response): void => {
  console.log(req.file); // Log the uploaded file
  if (!req.file) {
    res.status(400).json({ error: 'No file provided' });
    return; // Ensure to return after sending a response
  }

  const filePath = path.join(__dirname, req.file.path);
  const data = loadDataset(filePath);
  const metrics = calculateEngagementMetrics(data);

  // Prepare chart data (example)
  const chartData = {
    labels: metrics.map(item => item.name),
    values: metrics.map(item => item.views_per_subscriber)
  };

  // Clean up the uploaded file
  fs.unlinkSync(filePath);

  res.json({ metrics, chartData });
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
