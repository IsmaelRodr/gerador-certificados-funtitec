import { useEffect, useState } from "react";

export default function App() {
  const [nome, setNome] = useState("");

  const [eventos, setEventos] = useState([]);
  const [eventoSelecionado, setEventoSelecionado] = useState("");

  const [modalOpen, setModalOpen] = useState(false);

  // Estado do formulário do modal
  const [eventoForm, setEventoForm] = useState({
    evento: "",
    periodo: "",
    horas: "",
  });

  // Atualizar formulário do modal
  function handleEventoChange(e) {
    setEventoForm({ ...eventoForm, [e.target.name]: e.target.value });
  }

  // Buscar eventos cadastrados ao carregar a página
  useEffect(() => {
    fetch("http://localhost:8000/eventos")
      .then(res => res.json())
      .then(data => {
        setEventos(data);
        if (data.length > 0) {
          setEventoSelecionado(data[0].evento);
        }
      });
  }, []);

  // Salvar novo evento no backend
  async function salvarEvento(e) {
    e.preventDefault();

    const fd = new FormData();
    Object.keys(eventoForm).forEach(k => fd.append(k, eventoForm[k]));

    await fetch("http://localhost:8000/eventos", {
      method: "POST",
      body: fd,
    });

    // Recarregar lista de eventos
    const lista = await fetch("http://localhost:8000/eventos").then(r => r.json());
    setEventos(lista);

    // Selecionar automaticamente o evento criado
    setEventoSelecionado(eventoForm.evento);

    // Fechar modal e resetar
    setModalOpen(false);
    setEventoForm({ evento: "", periodo: "", horas: "" });
  }

  // Gerar o certificado PDF
  async function handleSubmit(e) {
    e.preventDefault();

    const fd = new FormData();
    fd.append("nome", nome);
    fd.append("evento", eventoSelecionado);

    const res = await fetch("http://localhost:8000/generate", {
      method: "POST",
      body: fd,
    });

    if (!res.ok) {
      alert("Erro ao gerar PDF!");
      return;
    }

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `certificado_${nome}.pdf`;
    link.click();
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-8">
      <div className="bg-white w-full max-w-2xl sm:max-w-lg md:max-w-xl mx-auto rounded-2xl shadow-xl p-6 sm:p-8">

        <h1 className="text-2xl sm:text-3xl font-bold text-center text-blue-700 mb-8">
          Gerador de Certificados
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Campo Nome */}
          <div className="flex flex-col">
            <label className="text-base sm:text-lg font-semibold text-gray-700 mb-2">
              Nome do participante
            </label>

            <input
              value={nome}
              name="nome"
              placeholder="Digite o nome"
              onChange={(e) => setNome(e.target.value)}
              required
              className="border border-gray-300 rounded-xl px-4 py-3 sm:py-4
                         bg-white text-base sm:text-lg
                         focus:ring-2 focus:ring-blue-500 focus:border-transparent
                         transition-all shadow-sm"
            />
          </div>

          {/* Select de Eventos */}
          <div className="flex flex-col">
            <label className="text-base sm:text-lg font-semibold text-gray-700 mb-2">
              Selecione o evento
            </label>

            <select
              value={eventoSelecionado}
              onChange={(e) => setEventoSelecionado(e.target.value)}
              className="border border-gray-300 rounded-xl px-4 py-3 sm:py-4
                         bg-white text-base sm:text-lg shadow-sm"
            >
              {eventos.length === 0 && (
                <option disabled>Nenhum evento cadastrado</option>
              )}

              {eventos.map((ev, idx) => (
                <option key={idx} value={ev.evento}>
                  {ev.evento}
                </option>
              ))}
            </select>

            {/* Botão para abrir modal */}
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="mt-3 bg-gray-200 hover:bg-gray-300 text-gray-700 py-2 rounded-lg"
            >
              Cadastrar novo evento
            </button>
          </div>

          {/* Botão para gerar PDF */}
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

      {/* MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center px-4">
          <div className="bg-white w-full max-w-md p-6 rounded-xl shadow-xl">

            <h2 className="text-xl font-bold mb-4 text-center">
              Cadastrar Evento
            </h2>

            <form onSubmit={salvarEvento} className="space-y-4">

              {/* Inputs do Modal */}
              {["evento", "periodo", "horas"].map((campo) => (
                <div key={campo} className="flex flex-col">
                  <label className="font-semibold capitalize">{campo}</label>

                  <input
                    name={campo}
                    value={eventoForm[campo]}
                    onChange={handleEventoChange}
                    required
                    className="border border-gray-300 rounded-lg px-3 py-2"
                  />
                </div>
              ))}

              {/* Salvar */}
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 rounded-lg mt-2"
              >
                Salvar Evento
              </button>

              {/* Cancelar */}
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="w-full bg-gray-300 text-gray-700 py-2 rounded-lg mt-2"
              >
                Cancelar
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}