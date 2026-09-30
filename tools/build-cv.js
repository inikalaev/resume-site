// Собирает короткие PDF-резюме из index.html: node tools/build-cv.js
// Нужен playwright-core и Chrome/Chromium (путь через CHROME_PATH).
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright-core');

const root = path.resolve(__dirname, '..');
const chrome = process.env.CHROME_PATH || '/opt/google/chrome/chrome';

(async () => {
  const browser = await chromium.launch({ executablePath: chrome, args: ['--no-sandbox'] });
  for (const lang of ['ru', 'en']) {
    const page = await browser.newPage();
    await page.goto(`file://${root}/index.html?lang=${lang}`, { waitUntil: 'load', timeout: 60000 });
    await page.evaluate(() => Promise.race([document.fonts.ready, new Promise(r => setTimeout(r, 8000))]));
    await page.emulateMedia({ media: 'print' });
    fs.mkdirSync(path.join(root, 'cv'), { recursive: true });
    const out = path.join(root, 'cv', `Ivan_Nikolaev_CV_${lang}.pdf`);
    await page.pdf({ path: out, format: 'A4', printBackground: true, preferCSSPageSize: true });
    console.log(out);
    await page.close();
  }
  await browser.close();
})();
