import { useState } from "react";

export default function App() {
  const [form, setForm] = useState({
    nome: "",
    evento: "",
    periodo: "",
    horas: "",
    dia: "",
    mes: "",
    ano: "",
  });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const fd = new FormData();
    Object.keys(form).forEach((k) => fd.append(k, form[k]));

    const res = await fetch("http://localhost:8000/generate", {
      method: "POST",
      body: fd,
    });

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `certificado_${form.nome}.pdf`;
    a.click();
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-8">
      
      {/* CARD RESPONSIVO CORRIGIDO */}
      <div className="bg-white w-full max-w-2xl sm:max-w-lg md:max-w-xl 
                mx-auto rounded-2xl shadow-xl p-6 sm:p-8">

        <h1 className="text-2xl sm:text-3xl font-bold text-center text-blue-700 mb-8">
          Gerador de Certificados
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">

          {Object.keys(form).map((key) => (
            <div key={key} className="flex flex-col">
              <label
                htmlFor={key}
                className="text-base sm:text-lg font-semibold text-gray-700 mb-2 capitalize"
              >
                {key}
              </label>

              <input
                id={key}
                name={key}
                value={form[key]}
                placeholder={`Digite o ${key}`}
                onChange={handleChange}
                required
                className="border border-gray-300 rounded-xl px-4 py-3 sm:py-4
                           bg-white text-base sm:text-lg
                           focus:ring-2 focus:ring-blue-500 focus:border-transparent
                           transition-all shadow-sm"
              />
            </div>
          ))}

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800
                       text-white py-3 sm:py-4 rounded-xl font-semibold text-lg sm:text-xl
                       shadow-md hover:shadow-xl transition-all"
          >
            Gerar PDF
          </button>
        </form>
      </div>
    </div>
  );
}
