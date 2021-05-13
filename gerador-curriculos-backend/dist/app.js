"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const cors = require("cors");
const pupeeteer = require("puppeteer");
const app_port = 5000;
const app = express();
app.use(express.json({ limit: '10mb' }));
app.use(cors());
let chromium;
app.listen(app_port, () => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`Servidor iniciado na porta ${app_port}`);
    chromium = yield launchChromium();
}));
app.post('/v1/generate/pdf', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let htmlTemplate = req.body.html;
        let generatedPdf = yield generatePdfChromium(htmlTemplate);
        res.send({ pdf: generatedPdf.toString('base64') });
    }
    catch (err) {
        console.log(err);
        res.status(500).send('Erro Interno Servidor');
    }
}));
function launchChromium() {
    return __awaiter(this, void 0, void 0, function* () {
        const chromium = yield pupeeteer.launch({
            headless: true,
            args: [
                '--no-sandbox'
            ]
        });
        return chromium;
    });
}
function generatePdfChromium(html) {
    return __awaiter(this, void 0, void 0, function* () {
        const page = yield chromium.newPage();
        yield page.setContent(html, { waitUntil: 'networkidle2' });
        yield sleep(2000);
        const pdfBuffer = yield page.pdf({ format: 'a4', pageRanges: '1', printBackground: true });
        yield page.close();
        return pdfBuffer;
    });
}
function sleep(time) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            setTimeout(() => { resolve(true); }, time);
        });
    });
}
//# sourceMappingURL=app.js.map