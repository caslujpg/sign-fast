import PricingCard from '@/components/pricing-card';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { capitalizeWords } from '@/lib/utils';
import { authOptions } from '@/next-auth-config';
import { Check, MenuIcon } from 'lucide-react';
import { getServerSession } from 'next-auth';
import Image from 'next/image';
import Link from 'next/link';
import howItWorks from './assets/howItWorks.svg';
import logo from './assets/logo.svg';

export default async function Home() {
  const session = await getServerSession(authOptions);
  const userName = capitalizeWords(session?.user?.name ?? '');
  return (
    <main>
      <section className="container mx-auto text-center pb-20 px-2 md:px-0">
        <nav className="flex justify-between items-center py-4">
          <Image src={logo} alt="Logotipo" />
          <DropdownMenu>
            <DropdownMenuTrigger>
              <MenuIcon size={24} className="md:hidden cursor-pointer" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="mr-4">
              <DropdownMenuLabel>Menu</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <a href={'/#funcionamento'}>
                <DropdownMenuItem>Funcionamento</DropdownMenuItem>
              </a>
              <DropdownMenuItem>Preço</DropdownMenuItem>
              <DropdownMenuItem>
                <Link href="/login">
                  <Button variant={'bg-white'}>Login</Button>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <div className="items-center gap-1 hidden md:flex">
            <Link href={'#funcionamento'}>
              <Button variant={'link'}>Funcionamento</Button>
            </Link>
            <Link href={'#preco'}>
              <Button variant={'link'}>Preço</Button>
            </Link>
            {session &&
              <Link href="/dashboard">
                <Button variant={'bg-white'}>Dashboard</Button>
              </Link>
            }
            {!session &&
              <Link href="/login">
                <Button variant={'bg-white'}>Login</Button>
              </Link>
            }
          </div>
        </nav>
        <h1 className="md:text-6xl text-2xl font-bold mt-8 md:mt-16">
          {userName && `${userName}, `} Simplifique suas Assinaturas!{' '}
        </h1>
        <p className="text-gray-500 mt-4 text-sm md:text-xl max-w-3xl mx-auto">
          A <span className="text-black">SignFast</span> te ajuda com sua gestão de assinaturas, documentos e muito mais!
        </p>
        <form className="md:mt-16 mt-10">
          <div className="flex gap-2 justify-center">
            <Input
              placeholder="Coloque seu email"
              type="text"
              className="max-w-sm border-gray-300 border"
            />
            <Button>Assine Agora</Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            Comece sua assinatura agora mesmo. Cancele quando quiser.{' '}
          </p>
        </form>
      </section>
      <section className="bg-white md:py-16 py-8" id="funcionamento">
        <div className="container mx-auto">
          <h2 className="text-2xl md:text-4xl font-bold text-center mb-6">
            Como funciona?
          </h2>
          <div className="flex flex-col mx-4 gap-4 items-center justify-center md:flex-row md:gap-8">
            <Image
              src={howItWorks}
              alt="Como funciona"
              className="max-w-xs flex flex-1"
            />
            <ul className="flex flex-col text-lg text-muted-foreground space-y-4 md:space-y-6 md:text-2xl">
              <li className="flex items-center gap-4">
                Acesso a 1 assinatura por mês{' '}
                <Check size={24} className="text-green-600" />
              </li>
              <li className="flex items-center gap-4">
                Salvar 10 documentos assinados
                <Check size={24} className="text-green-600" />
              </li>
              <li className="flex items-center gap-4">
                Cancele quando quiser
                <Check size={24} className="text-green-600" />
              </li>
            </ul>
          </div>
        </div>
      </section>
      <section className="md:py-16 py-8 text-center px-2" id="preco">
        <h2 className="md:text-6xl text-2xl font-bold md:mt-16">
          Preço Simples e Transparente
        </h2>
        <p className="text-gray-500 mt-4 text-sm md:text-xl max-w-3xl mx-auto">
          Pra que inúmeros planos quando nós sabemos exatamente o que é melhor
          para você? Assine o nosso plano mensal PRO e garanta
          mensalmente assinaturas ilimitadas. E por <span className="text-black">menos de um 1 real por
            dia.</span>
        </p>

        <div className="flex justify-center">
          <PricingCard />
        </div>
      </section>
    </main>
  );
}
