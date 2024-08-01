import express from 'express';
import qr from 'qr-image';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const port = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  const qrImageExists = fs.existsSync(path.join(__dirname, 'public', 'qr_img.png'));
  res.render('index', { qrImageExists });
});

app.post('/generate-qr', (req, res) => {
  const url = req.body.url;
  if (!url) {
    return res.status(400).send('URL is required.');
  }

  const qr_svg = qr.image(url);
  const filePath = path.join(__dirname, 'public', 'qr_img.png');
  qr_svg.pipe(fs.createWriteStream(filePath));

  res.redirect('/');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
