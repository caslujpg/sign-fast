import { compareSync, hashSync } from "bcrypt-ts";
import db from "./db";

type User = {
  email: string;
  name: string;
  id: string;
  password?: string;
}

export async function findUserByEmail(email: string): Promise<User | null> {
  const user = await db.users.findFirst({
    where: {
      email: email,
    }
  })

  if (!user) {
    return null;
  }

  return { email: user.email, name: user.name, id: user.id, password: user.password ?? undefined };
}

export async function findUserByCredentials(email: string, password: string): Promise<User | null> {
  const user = await findUserByEmail(email);

  if (!user || !user.password) {
    return null;
  }

  const passwordMatch = compareSync(password, user.password);

  if (!passwordMatch) {
    return null;
  }

  return { email: user.email, name: user.name, id: user.id };
}

export async function createUser(data: Omit<User, 'id'>) {
  await db.users.create({
    data: {
      email: data.email,
      name: data.name,
      password: data.password ? hashSync(data.password) : undefined
    }
  })
}