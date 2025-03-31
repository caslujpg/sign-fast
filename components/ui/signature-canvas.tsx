'use client'

import { Button } from "@/components/ui/button";
import { useRef } from "react";
import SignaturePad from "react-signature-canvas";

type SignatureCanvasProps = {
  onSign: (signatureImg: string) => void;
};

export function SignatureCanvas({ onSign }: SignatureCanvasProps) {
  const sigPadRef = useRef<SignaturePad | null>(null);

  const handleSave = () => {
    if (sigPadRef.current?.isEmpty()) return;
    const signatureImg = sigPadRef.current?.getTrimmedCanvas().toDataURL("image/png");
    if (signatureImg) {
      onSign(signatureImg);
    }
  };

  return (
    <div className="flex flex-col items-center">
      <SignaturePad
        ref={(ref) => {
          sigPadRef.current = ref;
        }}
        canvasProps={{ className: "border border-gray-300 rounded-md w-full h-32" }}
      />
      <div className="mt-4 flex gap-4">
        <Button onClick={() => sigPadRef.current?.clear()}>Limpar</Button>
        <Button onClick={handleSave}>Assinar</Button>
      </div>
    </div>
  );
}