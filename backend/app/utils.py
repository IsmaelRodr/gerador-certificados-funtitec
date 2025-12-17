from docxtpl import DocxTemplate
from pathlib import Path
import subprocess


def fill_template(src_path: str, dst_path: str, context: dict):
    doc = DocxTemplate(src_path)
    doc.render(context)
    doc.save(dst_path)


def convert_docx_to_pdf(docx_path: str, pdf_path: str):
    docx_path = Path(docx_path)
    output_dir = docx_path.parent

    # Chamada ao LibreOffice (soffice)
    subprocess.run(
        [
            "soffice",
            "--headless",
            "--convert-to",
            "pdf",
            "--outdir",
            str(output_dir),
            str(docx_path),
        ],
        check=True
    )

    generated_pdf = docx_path.with_suffix(".pdf")
    generated_pdf.rename(pdf_path)