'use client'

import { Button, buttonVariants } from '@/components/ui/button';
import { Modal } from '@/components/ui/modal';
import { SignatureModal } from '@/components/ui/signature-modal';
import { StatusBadge } from '@/components/ui/status-badge';
import { UploadPdfFileInput } from '@/components/ui/upload-pdf-file';
import { cn } from '@/lib/utils';
import { $Enums } from '@prisma/client';
import { Download } from 'lucide-react';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { LuTrash2 } from 'react-icons/lu';

export interface Document {
  id: string;
  name: string;
  fileKey: string;
  status: $Enums.Status;
  signatureImg?: string;
  signedAt?: string;
}

export default function MyDocuments() {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [, setDeleteError] = useState<string | null>(null);
  const [signatureModalOpen, setSignatureModalOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);

  const { data: session } = useSession();

  const uploadRef = useRef(null);

  useEffect(() => {
    fetchDocuments();
  }, [session,]);

  const fetchDocuments = async () => {
    try {
      const response = await fetch("/api/documents");
      if (!response.ok) throw new Error("Erro ao buscar documentos");
      const data = await response.json();
      setDocuments(data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleFileSelect = (file: File | null) => {
    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    setUploadSuccess(false);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append('file', selectedFile);

      if (session?.user?.id) {
        formData.append('userId', session.user.id);
      } else {
        setUploadError("Erro ao obter ID do usuário");
        return;
      }

      const response = await fetch('/api/documents', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      if (response.ok) {
        setUploadSuccess(true);
        setSelectedFile(null);
        setModalOpen(false);
        setUploadSuccess(false);
        fetchDocuments();
      } else {
        setUploadError(result.error || 'Erro ao subir o arquivo');
      }
    } catch (error) {
      setUploadError('Aconteceu um erro inesperado. Tente novamente...');
      console.error(error);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Tem certeza que deseja excluir este documento?")) return;

    try {
      const response = await fetch("/api/documents", {
        method: "DELETE",
        body: JSON.stringify({ id }),
      });

      if (!response.ok) throw new Error("Erro ao deletar documento");

      setDocuments((prev) => prev.filter((doc) => doc.id !== id));
    } catch (error) {
      console.error(error);
      setDeleteError("Erro ao deletar documento");
    }
  };

  const handleOpenSignatureModal = (doc: Document) => {
    setSelectedDocument(doc);
    setSignatureModalOpen(true);
  };

  return (
    <>
      <div className="flex flex-row justify-between">
        <h1 className="text-3xl font-bold mb-6">Meus documentos</h1>
        <Modal
          title="Enviar um pdf"
          open={modalOpen}
          onOpenChange={setModalOpen}
          button={<Button variant='outline' onClick={() => setModalOpen(true)}>Enviar um pdf</Button>}
        >
          <UploadPdfFileInput onFileSelect={handleFileSelect} selectedFile={selectedFile} ref={uploadRef} />
          <div className="mt-4">
            {uploadSuccess && <p className="text-green-500">Arquivo enviado com sucesso!</p>}
            {uploadError && <p className="text-red-500">{uploadError}</p>}
            <Button
              onClick={handleUpload}
              disabled={uploading || !selectedFile}
              className="mt-4"
            >
              {uploading ? 'Enviando...' : 'Enviar'}
            </Button>
          </div>
        </Modal>
      </div>

      <div className="mb-4" />

      <div>
        {documents.length === 0 ? (
          <p>Nenhum documento encontrado.</p>
        ) : (
          <ul className="space-y-4">
            {documents.map((doc) => (
              <li key={doc.id} className="flex flex-col items-center gap-2 border p-4 rounded-lg sm:flex-row sm:gap-0 sm:justify-between">
                <span>{doc.name}</span>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <button onClick={() => handleOpenSignatureModal(doc)}>
                    <StatusBadge status={doc.status} />
                  </button>
                  {doc.signatureImg && (
                    <div>
                      <Image src={doc.signatureImg} alt="Assinatura" className="h-6 w-6 rounded-full" />
                      <p className="text-sm text-gray-500">Assinado em: {doc.signedAt}</p>
                    </div>
                  )}
                  <Button variant="bg-white" onClick={() => handleDelete(doc.id)} className="text-red-600 hover:text-red-800">
                    <LuTrash2 size={20} />
                  </Button>
                  <Link
                    className={cn(buttonVariants())}
                    href={`/uploads/${doc.fileKey}`}
                    target="_blank"
                  >
                    <Download className="h-4 w-4 mr-3" /> Baixar
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {signatureModalOpen && selectedDocument && (
        <SignatureModal
          document={selectedDocument}
          onClose={() => setSignatureModalOpen(false)}
          onSign={() => {
            fetchDocuments();
            setSignatureModalOpen(false);
          }}
        />
      )}
    </>
  );
}
