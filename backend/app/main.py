from fastapi import FastAPI, Form, HTTPException
from fastapi.responses import FileResponse
from fastapi.middleware.cors import CORSMiddleware
from starlette.background import BackgroundTask
from uuid import uuid4
from pathlib import Path
from .utils import fill_template, convert_docx_to_pdf

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_methods=['*'],
    allow_headers=['*']
)

BASE_DIR = Path(__file__).parent
TEMPLATE_PATH = BASE_DIR / "template.docx"

@app.post("/generate")
async def generate(
    nome: str = Form(...),
    evento: str = Form(...),
    periodo: str = Form(...),
    horas: str = Form(...),
    dia: str = Form(...),
    mes: str = Form(...),
    ano: str = Form(...),
):
    context = {
        "nome": nome,
        "evento": evento,
        "periodo": periodo,
        "horas": horas,
        "dia": dia,
        "mes": mes,
        "ano": ano
    }

    token = uuid4().hex
    out_docx = BASE_DIR / f"out_{token}.docx"
    out_pdf = BASE_DIR / f"out_{token}.pdf"

    fill_template(str(TEMPLATE_PATH), str(out_docx), context)
    convert_docx_to_pdf(str(out_docx), str(out_pdf))

    def cleanup():
        out_docx.unlink(missing_ok=True)
        out_pdf.unlink(missing_ok=True)

    return FileResponse(
        str(out_pdf),
        media_type="application/pdf",
        filename=f"certificado_{nome}.pdf",
        background=BackgroundTask(cleanup)
    )