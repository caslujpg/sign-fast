'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { signIn, SignInResponse } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { FormEvent, useState } from 'react';

export default function LoginForm() {
  const [signInResponse, setSignInResponse] = useState<SignInResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    const formProps = Object.fromEntries(formData);

    setIsLoading(true);
    const response = await signIn("credentials", { ...formProps, redirect: false });

    if (!response) {
      return;
    }

    if (response.ok) {
      redirect('/dashboard');
    }

    setSignInResponse(response);
    setIsLoading(false);
  }

  const handleGoogleLogin = async () => {
    await signIn('google', { callbackUrl: '/dashboard' });
  }

  return (
    <>
      <form onSubmit={handleLogin}>
        <div>
          <Label>Email</Label>
          <Input type="email" name="email" placeholder="usuario@email.com" />
        </div>
        <div>
          <Label>Senha</Label>
          <Input type="password" name="password" placeholder="********" />
        </div>
        <div>
          <Button disabled={isLoading} className="w-full mt-6" type="submit">
            {!isLoading ? 'Entrar' : 'Carregando...'}
          </Button>
        </div>
      </form>
      <div>
        <Button variant='outline' className="w-full mt-6" type="submit" onClick={handleGoogleLogin}>
          Entrar com Google
        </Button>
      </div>
      {signInResponse?.error && (
        <>
          <div className="mb-6" />
          <div className="text-xs bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">
              {signInResponse.error === 'CredentialsSignin'
                ? 'Credenciais inválidas'
                : 'Ops... Algo deu errado, tente novamente mais tarde'}
            </span>
          </div>
        </>
      )}
    </>
  );
}