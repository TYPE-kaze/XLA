const path = require('path');
const { execFileSync } = require('node:child_process')
const multer = require('multer');
const express = require('express');
const ExpressError = require('./ExpressError')

const port = 10000;

const app = express();
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "./uploads/");
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    },
});

const upload = multer({ storage: storage });

app.use(express.static(path.join(__dirname, 'public')))
// app.set("views", path.join(__dirname, "views"))

app.get('/', (req, res) => res.sendFile('index.html', { root: __dirname }))

app.post('/filter', upload.single('image'), (req, res, next) => {
    if (!req.file) next(new ExpressError(400, "No file is uploaded"));

    const { filter } = req.body;
    const { path: imagePath } = req.file;
    const fullImagePath = path.join(__dirname, imagePath);
    const outPath = path.join(__dirname, 'uploads/output.png');
    const filterDir = path.join(__dirname, 'filters');

    switch (filter) { //Strict comparation
        case 'test':
            execFileSync('magick', [`${fullImagePath}`, '-colorspace', 'Gray', `${outPath}`]);
            // const testFilterPath = path.join(filterDir, 'test.py');
            // spawnSync('python3', [`${testFilterPath}`, '1', '2', '3', 'hello world']);
            break;

        case 'grayscale':
            const gsFilterPath = path.join(filterDir, 'grayscale.py');
            execFileSync('python3', [`${gsFilterPath}`, `${fullImagePath}`, `${outPath}`]);
            break;

        case 'average':
            const avgFilterPath = path.join(filterDir, 'average.py');
            const { width: w, height: h } = req.body;
            execFileSync('python3', [`${avgFilterPath}`, `${fullImagePath}`, `${outPath}`, `${w}`, `${h}`]);
            break;

        case 'gaussian':
            const gauFilterPath = path.join(filterDir, 'gaussian.py');
            const { width: g_w, height: g_h, deviation: g_d } = req.body;
            execFileSync('python3', [`${gauFilterPath}`, `${fullImagePath}`, `${outPath}`, `${g_w}`, `${g_h}`, `${g_d}`]);
            break;

        case 'median':
            const meFilterPath = path.join(filterDir, 'median.py');
            const { size: me_s } = req.body;
            execFileSync('python3', [`${meFilterPath}`, `${fullImagePath}`, `${outPath}`, `${me_s}`]);
            break;

        case 'hpf3x3':
            const h3Path = path.join(filterDir, 'hpf3x3.py');
            execFileSync('python3', [`${h3Path}`, `${fullImagePath}`, `${outPath}`]);
            break;


        case 'hpf5x5':
            const h5Path = path.join(filterDir, 'hpf5x5.py');
            execFileSync('python3', [`${h5Path}`, `${fullImagePath}`, `${outPath}`]);
            break;

        case 'fft-hpf':
            const fftHpfPath = path.join(filterDir, 'fft_hpf.py');
            const { intensity: fft_hpf_i, size: fft_hpf_s } = req.body;
            execFileSync('python3', [`${fftHpfPath}`, `${fullImagePath}`, `${outPath}`, `${fft_hpf_s}`, `${fft_hpf_i}`]);
            break;

        case 'fft-lpf':
            const fftLpfPath = path.join(filterDir, 'fft_lpf.py');
            const { intensity: fft_lpf_i, size: fft_lpf_s } = req.body;
            execFileSync('python3', [`${fftLpfPath}`, `${fullImagePath}`, `${outPath}`, `${fft_lpf_s}`, `${fft_lpf_i}`]);
            break;

        default:
            next(new ExpressError(400, "The specified filter is not supported"));
    }
    // send the processed image back
    res.sendFile(outPath);
})

app.all("*", (req, res, next) => next(new ExpressError(404, "Page Not Found")))

// Customize the default error handler
// app.use((err, req, res, next) => res.status(err instanceof ExpressError ? err.statusCode : 500).send(err))

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})