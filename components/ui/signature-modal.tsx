'use client'

import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import Image from "next/image";
import { useEffect, useState } from "react";
import { SignatureCanvas } from "./signature-canvas";

type SignatureModalProps = {
  document: { id: string; name: string; status: "PENDING" | "SIGNED" };
  onClose: () => void;
  onSign: (signatureImg: string) => void;
};

export function SignatureModal({ document, onClose, onSign }: SignatureModalProps) {
  const [signature, setSignature] = useState<string | null>(null);
  const [signedAt, setSignedAt] = useState<string | null>(null);

  useEffect(() => {
    const fetchSignature = async () => {
      const response = await fetch(`/api/signatures?documentId=${document.id}`);
      const data = await response.json();

      if (data.length > 0) {
        setSignature(data[0].signatureImg);
        setSignedAt(new Date(data[0].signedAt).toLocaleString('pt-br'));
      }
    };

    if (document.status === "SIGNED") {
      fetchSignature();
    }
  }, [document.id, document.status]);

  const handleSign = async (signatureImg: string) => {
    await fetch("/api/signatures", {
      method: "POST",
      body: JSON.stringify({ documentId: document.id, signatureImg }),
      headers: { "Content-Type": "application/json" },
    });

    setSignature(signatureImg);
    setSignedAt(new Date().toLocaleString('pt-BR'));
    onSign(signatureImg);
  };

  return (
    <Modal title={document.name} open={true} onOpenChange={onClose}>
      {signature ? (
        <div>
          <h2 className="text-lg font-semibold">Assinatura:</h2>
          <Image width={800} height={800} src={signature} alt="Assinatura" className="border rounded-md mt-2" />
          <p className="text-sm text-gray-600 mt-2">Assinado em: {signedAt}</p>
        </div>
      ) : (
        <SignatureCanvas onSign={handleSign} />
      )}
      <Button onClick={onClose} className="mt-4 w-full">Fechar</Button>
    </Modal>
  );
}