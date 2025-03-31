'use server'

import { createUser, findUserByEmail } from "@/lib/user";

export default async function registerAction(_prevState: unknown, formData: FormData) {
  const entries = Array.from(formData.entries());

  const data = Object.fromEntries(entries) as {
    name: string,
    email: string,
    password: string
  };

  if (!data.email || !data.password || !data.name) {
    return {
      message: 'Todos os campos são obrigatórios.',
      success: false
    }
  }

  const user = await findUserByEmail(data.email);

  if (user) {
    return {
      message: 'Este usuário já existe.',
      success: false
    }
  }

  await createUser({
    email: data.email,
    name: data.name,
    password: data.password
  })

  return {
    message: 'Usuário criado com sucesso.',
    success: true,
    user: { email: data.email, password: data.password }
  }
}