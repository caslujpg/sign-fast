import { Check } from 'lucide-react';
import { Button } from './ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from './ui/card';

export default function PricingCard() {
  return (
    <Card className="w-[350px] text-left md:mt-20 mt-10">
      <CardHeader>
        <CardTitle>Plano PRO</CardTitle>
        <CardDescription>
          Tudo que você precisa para suas assinaturas
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-4xl font-bold mb-8 mt-4">
          R$29
          <span className="font-normal text-muted-foreground text-lg">
            /mês
          </span>{' '}
        </p>
        <ul>
          <li className="flex gap-2 text-muted-foreground">
            <Check className="w-4 text-green-600" />
            Acesso a assinaturas ilimitadas
          </li>
          <li className="flex gap-2 text-muted-foreground">
            <Check className="w-4 text-green-600" />
            Armazenamento ilimitado de documentos
          </li>
          <li className="flex gap-2 text-muted-foreground">
            <Check className="w-4 text-green-600" />
            Acesso ilimitado
          </li>
          <li className="flex gap-2 text-muted-foreground">
            <Check className="w-4 text-green-600" />
            Cancele quando quiser
          </li>
        </ul>
      </CardContent>
      <CardFooter>
        <Button className="w-full">Assine Agora</Button>
      </CardFooter>
    </Card>
  );
}
