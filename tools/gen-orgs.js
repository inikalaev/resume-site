// Генерирует orgs.js из переменной окружения ORGS_JSON.
// Пример: ORGS_JSON='{"lab":"ООО Ромашка","space":"...","kiskis":"...","college":"...","onlineUni":"...","uni":"...","school":"..."}'
// Без переменной копирует orgs.example.js.
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const out = path.join(root, 'orgs.js');
const raw = process.env.ORGS_JSON;

if (!raw || !raw.trim()) {
  fs.copyFileSync(path.join(root, 'orgs.example.js'), out);
  console.log('ORGS_JSON не задан, взят orgs.example.js');
  process.exit(0);
}

// Переносы строк и табы внутри значений заменяются пробелами: при вставке в GitHub они легко попадают в секрет.
let orgs;
try {
  orgs = JSON.parse(raw.replace(/[\u0000-\u001F]+/g, ' '));
} catch {
  // Текст ошибки не печатаем: в нём может оказаться кусок значения, а лог публичный.
  console.error('ORGS_JSON не разбирается как JSON. Проверь кавычки и запятые.');
  process.exit(1);
}
for (const k of Object.keys(orgs)) if (typeof orgs[k] === 'string') orgs[k] = orgs[k].replace(/\s+/g, ' ').trim();
const required = ['lab', 'space', 'kiskis', 'college', 'onlineUni', 'uni', 'school'];
const missing = required.filter(k => typeof orgs[k] !== 'string' || !orgs[k].trim());
if (missing.length) {
  console.error(`В ORGS_JSON нет ключей: ${missing.join(', ')}`);
  process.exit(1);
}
fs.writeFileSync(out, `// Сгенерировано tools/gen-orgs.js, не коммитить.\nconst ORGS = ${JSON.stringify(orgs, null, 2)};\n`);
console.log('orgs.js собран из ORGS_JSON');
