import db from '@/lib/db';
import { findUserByEmail } from '@/lib/user';
import { authOptions } from '@/next-auth-config';
import crypto from 'crypto';
import fs from 'fs';
import { writeFile } from 'fs/promises';
import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}

export async function POST(request: NextRequest) {
  const data = await request.formData();
  const file: File | null = data.get('file') as unknown as File;
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;
  if (!email) {
    return NextResponse.json({ success: false, error: 'Email do usuário não encontrado' });
  }
  const user = await findUserByEmail(email);

  if (!file || !user?.id) {
    return NextResponse.json({ success: false, error: 'Nenhum arquivo ou userId atualizado' });
  }

  const hash = crypto.randomBytes(16).toString('hex');
  const fileExtension = path.extname(file.name);
  const filename = `${hash}${fileExtension}`;

  const uploadDir = './public/uploads';
  const filePath = path.join(uploadDir, filename);

  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  try {
    await writeFile(filePath, buffer);

    const document = await db.documents.create({
      data: {
        name: file.name,
        fileKey: filename,
        userId: user?.id,
      },
    });

    return NextResponse.json({ success: true, document });
  } catch (error) {
    console.error(`Erro ao salvar ou registrar o arquivo: ${error}`, error);
    return NextResponse.json({ success: false, error: 'Erro ao salvar o arquivo' });
  }
}

export async function GET() {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;
  if (!email) {
    return NextResponse.json({ success: false, error: 'Email do usuário não encontrado' });
  }
  const user = await findUserByEmail(email);

  if (!user?.id) {
    return NextResponse.json({ error: "Usuário não autenticado" }, { status: 401 });
  }

  try {
    const documents = await db.documents.findMany({
      where: { userId: user?.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(documents);
  } catch (error) {
    return NextResponse.json({ error: `Erro ao buscar documentos. ${error}` }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email;
  if (!email) {
    return NextResponse.json({ success: false, error: 'Email do usuário não encontrado' });
  }
  const user = await findUserByEmail(email);

  if (!user?.id) {
    return new Response(JSON.stringify({ error: "Usuário não autenticado" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const { id } = await request.json();

    if (!id) {
      return new Response(JSON.stringify({ error: "ID do documento não fornecido" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const document = await db.documents.findUnique({
      where: { id, userId: user.id },
    });

    if (!document) {
      return new Response(JSON.stringify({ error: "Documento não encontrado" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    const signature = await db.signatures.findFirst({
      where: { documentId: document.id, userId: user.id },
    });

    if (!signature) {
      return new Response(JSON.stringify({ error: "Assinatura não encontrada" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    await db.documents.delete({ where: { id } });
    const documentPath = path.join(process.cwd(), "public/uploads", document.fileKey);
    const signaturePath = path.join(process.cwd(), "public", signature.signatureImg)

    await fs.promises.unlink(documentPath).catch(err => console.warn("Erro ao deletar o documento:", err));
    await fs.promises.unlink(signaturePath).catch(err => console.warn("Erro ao deletar a assinatura:", err));





    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Erro ao deletar documento:", error);
    return new Response(JSON.stringify({ error: "Erro interno do servidor" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}