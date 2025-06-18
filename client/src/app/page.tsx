// /src/app/page.tsx

"use client";

import { useState, useRef } from "react";
import type { DragEvent, ChangeEvent } from "react";
import axios from "axios";
import Image from "next/image";

import logoBB from "@/assets/logobb.svg";
import { Loader2, Receipt, Upload, X } from "lucide-react";
import { ResultDialog } from "@/components/ui/result-dialog";

interface ReimbursementResult {
  status: string;
  motivo?: string;
  categoria: string;
  valor: number;
  cnpj_fornecedor: string;
  data: string;
}

export default function Home() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [result, setResult] = useState<ReimbursementResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      setSelectedFile(event.dataTransfer.files[0]);
      setError("");
    }
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFile(event.target.files[0]);
      setError("");
    }
  };

  const handleBrowseClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveFile = () => {
    setSelectedFile(null);
  };

  const handleAnalyzeClick = async () => {
    if (!selectedFile) {
      setError("Por favor, selecione um arquivo primeiro.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    setIsLoading(true);
    setError("");

    try {
      const response = await axios.post(
        "http://localhost:8000/api/v1/process-reimbursement/",
        formData
      );

      setResult(response.data);
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.detail || "Erro ao conectar com o servidor.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
      setSelectedFile(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 font-sans">
      <header className="bg-yellow-bb w-full px-8 py-3">
        <div className="max-w-[1000px] w-full mx-auto">
          <div className="flex justify-start items-center gap-4">
            <Image
              src={logoBB}
              alt="Logo do Banco do Brasil"
              className="w-12"
            />
            <h1 className="text-blue-600 font-bold text-xl tracking-tight font-bb">
              ReembolsaBB
            </h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-6">
        <section className="mb-8 max-w-[1000px] mx-auto w-full">
          <div className="bg-white rounded-lg p-6 border border-zinc-200">
            <h2 className="text-2xl font-bb font-bold text-blue-600 tracking-tight mb-1">
              Abrir solicitação
            </h2>
            <p className="text-zinc-600 text-base mb-8 font-normal font-bb">
              Envie seu comprovante para análise de forma facilitada e receba a
              resposta na hora.
            </p>

            <div className="bg-white border-2 border-dashed border-zinc-200 rounded-lg p-6 w-full">
              {!selectedFile ? (
                <div
                  className="rounded-md p-6 text-center cursor-pointer hover:border-blue-600 transition-colors"
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onClick={handleBrowseClick}
                >
                  <Upload className="h-10 w-10 text-zinc-400 mx-auto mb-2" />
                  <p className="text-sm text-zinc-600">
                    <span className="font-semibold text-blue-600">
                      Clique para enviar
                    </span>{" "}
                    ou arraste e solte
                  </p>
                  <p className="text-xs text-zinc-500 mt-1">
                    PNG, JPG, PDF (MAX. 8MB)
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <h3 className="text-sm font-medium text-zinc-800">
                    Arquivo Selecionado:
                  </h3>
                  <div className="flex items-center justify-between p-2 border rounded-md bg-gray-50">
                    <span className="truncate pr-2 font-medium text-zinc-700">
                      {selectedFile.name}
                    </span>
                    <button
                      onClick={handleRemoveFile}
                      className="text-zinc-400 hover:text-red-600 focus:outline-none flex-shrink-0"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            <input
              type="file"
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/png, image/jpeg, application/pdf"
            />

            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

            <button
              onClick={handleAnalyzeClick}
              disabled={!selectedFile || isLoading}
              className="bg-yellow-bb text-blue-600 px-4 py-3 rounded-xl w-full mt-8 cursor-pointer hover:bg-yellow-bb/60
              transition-colors duration-200 flex justify-center items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="text-blue-600 animate-spin w-5 h-5" />
                  <span className="font-bb font-medium tracking-tight">
                    Analisando...
                  </span>
                </>
              ) : (
                <>
                  <Receipt className="text-blue-600 w-5 h-5" />
                  <span className="font-bb font-medium tracking-tight">
                    Analisar comprovante
                  </span>
                </>
              )}
            </button>
          </div>
        </section>
      </main>

      <ResultDialog
        isOpen={!!result}
        onClose={() => setResult(null)}
        result={result}
      />
    </div>
  );
}
