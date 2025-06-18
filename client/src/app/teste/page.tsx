"use client";

import React, { useState } from "react";
import axios from "axios";

interface ReimbursementResult {
  status: string;
  motivo?: string;
  categoria: string;
  valor: number;
  cnpj_fornecedor: string;
  data: string;
}

function Teste() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [result, setResult] = useState<ReimbursementResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (event: any) => {
    setSelectedFile(event.target.files[0]);
    setResult(null);
    setError("");
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("file", selectedFile);

    setIsLoading(true);
    setError("");

    try {
      const response = await axios.post(
        "http://localhost:8000/api/v1/process-reimbursement/",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setResult(response.data);
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.detail || "Erro ao conectar com o servidor.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen">
      <h1 className="text-blue-600 font-bold font-bb">ReembolsaBB</h1>
      <p className="text-zinc-700 font-normal font-bb text-sm">
        Envie um comprovante para análise automática.
      </p>

      <div className="upload-section">
        <input type="file" onChange={handleFileChange} accept="image/*" />
        <button
          onClick={handleUpload}
          disabled={!selectedFile || isLoading}
          className="bg-blue-600 px-6 py-4 rounded-xl text-white font-bb"
        >
          {isLoading ? "Analisando..." : "Analisar Comprovante"}
        </button>
      </div>

      {error && (
        <div className="result-card error">
          <p>{error}</p>
        </div>
      )}

      {result && (
        <div
          className={`result-card ${
            result.status.includes("Aprovado") ? "aprovado" : "reprovado"
          }`}
        >
          <h3>Resultado da Análise</h3>
          <p>
            <strong>Status:</strong> {result.status}
          </p>
          {result.motivo && (
            <p>
              <strong>Motivo:</strong> {result.motivo}
            </p>
          )}
          <p>
            <strong>Categoria:</strong> {result.categoria}
          </p>
          <p>
            <strong>Valor:</strong> R$ {result.valor.toFixed(2)}
          </p>
          <p>
            <strong>CNPJ:</strong> {result.cnpj_fornecedor}
          </p>
          <p>
            <strong>Data:</strong> {result.data}
          </p>
        </div>
      )}
    </div>
  );
}

export default Teste;
