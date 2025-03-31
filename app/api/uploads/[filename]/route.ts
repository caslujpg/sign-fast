import fs from 'fs';
import { NextResponse } from "next/server";
import path from 'path';

const uploadDir = path.join(process.cwd(), 'public', 'uploads')

export async function GET(_: Request, { params }: { params: Promise<{ filename: string }> }) {
  const { filename } = await params;
  const filePath = path.join(uploadDir, filename);

  if (!fs.existsSync(filePath)) {
    return NextResponse.json({ error: 'Arquivo não encontrado' }, { status: 404 })
  }

  const fileBuffer = fs.readFileSync(filePath);

  return new Response(fileBuffer, {
    headers: {
      'Content-Type': 'application/pdf',
    }
  });
}