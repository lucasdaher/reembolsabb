"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  XCircle,
  FileText,
  Banknote,
  Calendar,
  Landmark,
} from "lucide-react";

interface ReimbursementResult {
  status: string;
  motivo?: string;
  categoria: string;
  valor: number;
  cnpj_fornecedor: string;
  data: string;
}

interface ResultDialogProps {
  isOpen: boolean;
  onClose: () => void;
  result: ReimbursementResult | null;
}

export function ResultDialog({ isOpen, onClose, result }: ResultDialogProps) {
  if (!result) return null;

  const isApproved = result.status.includes("Aprovado");

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex justify-center mb-4">
            {isApproved ? (
              <CheckCircle2 className="h-16 w-16 text-green-500" />
            ) : (
              <XCircle className="h-16 w-16 text-red-500" />
            )}
          </div>
          <DialogTitle
            className={`text-center text-2xl font-bold ${
              isApproved ? "text-green-600" : "text-red-600"
            }`}
          >
            {isApproved ? "Reembolso Aprovado" : "Reembolso Reprovado"}
          </DialogTitle>
          <DialogDescription className="text-center pt-2">
            {isApproved
              ? "Sua solicitação foi processada e aprovada com sucesso."
              : result.motivo || "Sua solicitação foi reprovada."}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 pt-4 border-t">
          <h3 className="mb-4 font-semibold text-zinc-800">
            Detalhes da Análise:
          </h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between items-center">
              <span className="flex items-center text-zinc-500">
                <FileText className="w-4 h-4 mr-2" /> Categoria:
              </span>
              <span className="font-medium text-zinc-900">
                {result.categoria}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="flex items-center text-zinc-500">
                <Banknote className="w-4 h-4 mr-2" /> Valor:
              </span>
              <span
                className={`font-bold ${
                  isApproved ? "text-green-600" : "text-red-500"
                }`}
              >
                R$ {result.valor.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="flex items-center text-zinc-500">
                <Calendar className="w-4 h-4 mr-2" /> Data:
              </span>
              <span className="font-medium text-zinc-900">{result.data}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="flex items-center text-zinc-500">
                <Landmark className="w-4 h-4 mr-2" /> CNPJ:
              </span>
              <span className="font-medium text-zinc-900">
                {result.cnpj_fornecedor}
              </span>
            </div>
          </div>
        </div>

        <DialogFooter className="mt-6">
          <DialogClose asChild>
            <Button
              type="button"
              className="w-full bg-bb-blue hover:bg-bb-blue/90"
            >
              Fechar
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
