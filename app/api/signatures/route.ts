import db from "@/lib/db";
import { findUserByEmail } from "@/lib/user";
import { authOptions } from "@/next-auth-config";
import { randomUUID } from "crypto";
import fs from 'fs';
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import path from 'path';

export async function POST(request: Request) {
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
    const { documentId, signatureImg, } = await request.json();

    if (!documentId || !signatureImg) {
      return new Response(JSON.stringify({ error: "Dados inválidos" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const document = await db.documents.findUnique({
      where: { id: documentId },
    });

    if (!document) {
      return new Response(JSON.stringify({ error: "Documento não encontrado" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    if (document.userId !== user.id) {
      return new Response(JSON.stringify({ error: "Você não tem permissão para assinar este documento" }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      });
    }

    const base64Data = signatureImg.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Data, "base64");

    const uploadDir = path.join(process.cwd(), "public/uploads/signatures");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const filename = `signature_${user.id}_${randomUUID()}.png`;
    const filepath = path.join(uploadDir, filename);

    fs.writeFileSync(filepath, buffer);

    const imageUrl = `/uploads/signatures/${filename}`;

    const signature = await db.signatures.create({
      data: {
        documentId: documentId,
        userId: user.id,
        signatureImg: imageUrl,
      },
    });

    await db.documents.update({
      where: { id: documentId },
      data: { status: "SIGNED" },
    });

    return new Response(JSON.stringify(signature), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Erro ao salvar assinatura:", error);
    return new Response(JSON.stringify({ error: "Erro interno do servidor" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function GET(req: Request) {
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

  const { searchParams } = new URL(req.url);
  const documentId = searchParams.get("documentId");

  if (!documentId) {
    return new Response(JSON.stringify({ error: "Documento não informado" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const signatures = await db.signatures.findMany({
      where: { documentId },
    });

    return new Response(JSON.stringify(signatures), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Erro ao buscar assinaturas:", error);
    return new Response(JSON.stringify({ error: "Erro interno do servidor" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}