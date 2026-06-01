# Panduan Pengecekan Batas Baris Kode
> Stack: React 19, Vite, TypeScript (frontend) — Node.js, Express.js, TypeScript (backend)

---

## Aturan

| Aturan | Batas |
|---|---|
| Jumlah baris per file | Maksimal 200 baris |
| Jumlah baris per fungsi | Maksimal 15 baris |

---

## 1. Instalasi

**Frontend**
```bash
cd frontend
npm install --save-dev eslint @typescript-eslint/eslint-plugin @typescript-eslint/parser eslint-plugin-react-hooks
```

**Backend**
```bash
cd backend
npm install --save-dev eslint @typescript-eslint/eslint-plugin @typescript-eslint/parser
```

---

## 2. Konfigurasi ESLint

**`frontend/.eslintrc.json`**
```json
{
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaVersion": "latest",
    "sourceType": "module",
    "ecmaFeatures": { "jsx": true }
  },
  "plugins": ["@typescript-eslint", "react-hooks"],
  "rules": {
    "max-lines": ["warn", { "max": 200, "skipBlankLines": true, "skipComments": true }],
    "max-lines-per-function": ["warn", { "max": 15, "skipBlankLines": true, "skipComments": true }],
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn"
  },
  "ignorePatterns": ["node_modules/", "dist/", "*.config.ts"]
}
```

**`backend/.eslintrc.json`**
```json
{
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaVersion": "latest",
    "sourceType": "module"
  },
  "plugins": ["@typescript-eslint"],
  "rules": {
    "max-lines": ["warn", { "max": 200, "skipBlankLines": true, "skipComments": true }],
    "max-lines-per-function": ["warn", { "max": 15, "skipBlankLines": true, "skipComments": true }]
  },
  "ignorePatterns": ["node_modules/", "dist/"]
}
```

---

## 3. Script `package.json`

```json
"scripts": {
  "lint": "eslint . --ext .ts,.tsx",
  "lint:fix": "eslint . --ext .ts,.tsx --fix"
}
```

---

## 4. Menjalankan Pengecekan

```bash
# Cek semua pelanggaran
npm run lint

# Cek folder tertentu
npx eslint src/ --ext .ts,.tsx
```

**Cek manual via terminal (tanpa ESLint):**
```bash
find . -name "*.ts" -o -name "*.tsx" | grep -v node_modules | while read f; do
  lines=$(wc -l < "$f")
  [ "$lines" -gt 200 ] && echo "$lines baris -> $f"
done | sort -rn
```

---

## 5. Integrasi VS Code

Install ekstensi **ESLint** dari VS Code Marketplace, lalu tambahkan di `.vscode/settings.json`:

```json
{
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  },
  "eslint.validate": ["typescript", "typescriptreact"]
}
```

Pelanggaran akan langsung ditandai di editor tanpa perlu menjalankan command.
