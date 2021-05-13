import * as express from 'express';
import * as cors from 'cors';
import * as pupeeteer from 'puppeteer';

const app_port = 5000;
const app = express();
app.use(express.json({limit: '10mb'}));
app.use(cors());
let chromium:pupeeteer.Browser;

app.listen(app_port, async () => {
    console.log(`Servidor iniciado na porta ${app_port}`);
    chromium = await launchChromium();
});

app.post('/v1/generate/pdf', async(req, res) => {
    try {
        let htmlTemplate = req.body.html;
        let generatedPdf = await generatePdfChromium(htmlTemplate);
        res.send({pdf: generatedPdf.toString('base64')});
    } catch(err) {
        console.log(err);
        res.status(500).send('Erro Interno Servidor');
    }
});

async function launchChromium() {
    const chromium = await pupeeteer.launch({
        headless: true,
        args: [
            '--no-sandbox'
        ]
    });
    return chromium;
}

async function generatePdfChromium(html:string) {
    const page = await chromium.newPage();
    await page.setContent(html, {waitUntil: 'networkidle2'});
    await sleep(2000);
    const pdfBuffer = await page.pdf({format: 'a4', pageRanges: '1', printBackground: true});
    await page.close();
    return pdfBuffer; 
}

async function sleep(time:number) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {resolve(true)}, time)
    });
}