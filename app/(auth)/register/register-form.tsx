'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { signIn } from 'next-auth/react';
import Form from 'next/form';
import { redirect } from 'next/navigation';
import { useActionState, useLayoutEffect, useState } from 'react';
import registerAction from './register-action';

export default function RegisterForm() {
  const [registerActionResponse, registerFormAction, isLoadingRegister] = useActionState(registerAction, null);
  const [isLoading, setIsLoading] = useState(false);

  useLayoutEffect(() => {
    async function login() {
      if (registerActionResponse?.success) {
        setIsLoading(true);
        const response = await signIn("credentials", { ...registerActionResponse.user, redirect: false });

        if (!response) {
          return;
        }

        if (response.ok) {
          redirect('/dashboard');
        }

        setIsLoading(false);
      }
    }
    login();
  }, [registerActionResponse?.success, registerActionResponse?.user])

  return (
    <>
      <Form action={registerFormAction}>
        <div>
          <Label>Nome</Label>
          <Input type="text" name="name" placeholder="Nome" disabled={isLoadingRegister || isLoading} />
        </div>
        <div>
          <Label>Email</Label>
          <Input type="email" name="email" placeholder="usuario@email.com" disabled={isLoadingRegister || isLoading} />
        </div>
        <div>
          <Label>Senha</Label>
          <Input type="password" name="password" placeholder="********" disabled={isLoadingRegister || isLoading} />
        </div>
        <div>
          <Button disabled={isLoadingRegister || isLoading} className="w-full mt-6" type="submit">
            {isLoadingRegister || isLoading
              ? 'Registrando...'
              : 'Registrar'}
          </Button>
        </div>
      </Form>
      {registerActionResponse?.success === false && (
        <>
          <div className="mb-6" />
          <div className="text-xs bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <span className="block sm:inline">{registerActionResponse.message}</span>
          </div>
        </>
      )}
    </>
  );
}