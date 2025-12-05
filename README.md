# Gerador de Certificados – Aplicação Fullstack

Aplicação fullstack que gera certificados em PDF a partir de um template `.docx` usando **FastAPI + React**.  
O usuário preenche um formulário no frontend e o backend gera automaticamente um certificado personalizado em PDF.

---

## 🚀 Tecnologias Utilizadas

### 🔧 Backend (Python)
- **FastAPI**
- **docxtpl** — substituição perfeita de placeholders + preservação de formatação  
- **docx2pdf** — conversão DOCX → PDF (necessita Word instalado no Windows)
- **python-multipart**
- **Uvicorn**

### 🖥️ Frontend (React)
- React + Vite
- Fetch API enviando `FormData`

---

## 📁 Estrutura do Projeto

```
gerador-certificados/
├─ backend/
│  ├─ app/
│  │  ├─ main.py
│  │  ├─ utils.py
│  │  └─ template.docx
│  ├─ requirements.txt
│
├─ frontend/
│  ├─ index.html
│  ├─ vite.config.js
│  ├─ package.json
│  └─ src/
│     ├─ main.jsx
│     └─ App.jsx
│
└─ README.md
```

---

## ▶️ Como Rodar o Backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate  # Windows
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

⚠️ **Importante:**  
`docx2pdf` exige **Microsoft Word instalado** (Windows ou macOS).  

---

## ▶️ Como Rodar o Frontend

```bash
cd frontend
npm install
npm run dev
```

Acesse:

```
http://localhost:5173
```

---

## 📝 Como funciona a geração do certificado

1. O usuário preenche o formulário (React).
2. O frontend envia os dados via `POST` usando `FormData`.
3. O backend carrega `template.docx`.
4. `docxtpl` substitui placeholders preservando a formatação original.
5. `docx2pdf` converte automaticamente o `.docx` para `.pdf`.
6. O PDF é retornado como download no navegador.

---

## 🏷️ Template DOCX

O template deve conter variáveis no formato:

```
{{ nome }}
{{ evento }}
{{ periodo }}
{{ horas }}
{{ dia }}
{{ mes }}
{{ ano }}
```

A formatação original do documento é preservada.