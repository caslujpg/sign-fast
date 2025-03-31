'use client';

import Logo from '@/components/logo';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { Menu, User, X } from 'lucide-react';
import { signOut } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';

export default function Navbar({ userName }: { userName: string }) {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/" className="text-gray-700 hover:text-gray-900">
            <Logo />
          </Link>
        </div>

        <div className="flex items-center space-x-4 sm:space-x-6">
          <nav className="hidden sm:flex items-center space-x-4">
            <Link href="/dashboard">
              <Button variant="link" className={cn(pathname === '/dashboard' ? 'underline' : '')}>
                Meus documentos
              </Button>
            </Link>
            <Link href="/dashboard/signature">
              <Button variant="link" className={cn(pathname === '/dashboard/signature' ? 'underline' : '')}>
                Minha Assinatura
              </Button>
            </Link>
          </nav>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="text-gray-700 hover:text-gray-900">
                <User size={24} />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="mr-4 text-center">
              <DropdownMenuLabel className="font-light text-xs">{userName}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Button variant="default" size="sm" className="bg-red-500 w-full" type="submit" onClick={() => signOut()}>
                  Logout
                </Button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <button
            className="sm:hidden text-gray-700 hover:text-gray-900"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="sm:hidden bg-white shadow-md p-4">
          <nav className="flex flex-col space-y-2">
            <Link href="/dashboard">
              <Button
                variant="link"
                className={cn(pathname === '/dashboard' ? 'font-bold' : '')}
                onClick={() => setIsOpen(false)}
              >
                Meus documentos
              </Button>
            </Link>
            <Link href="/dashboard/signature">
              <Button
                variant="link"
                className={cn(pathname === '/dashboard/signature' ? 'font-bold' : '')}
                onClick={() => setIsOpen(false)}
              >
                Minha Assinatura
              </Button>
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
