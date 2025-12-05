from docxtpl import DocxTemplate
from docx2pdf import convert
from pathlib import Path
import shutil

def fill_template(src_path: str, dst_path: str, context: dict):
    doc = DocxTemplate(src_path)
    doc.render(context)
    doc.save(dst_path)

def convert_docx_to_pdf(docx_path: str, pdf_path: str):
    parent = Path(docx_path).parent
    convert(docx_path, parent)
    generated = Path(docx_path).with_suffix(".pdf")
    shutil.move(str(generated), pdf_path)