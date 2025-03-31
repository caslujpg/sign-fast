import type * as React from 'react';

import * as Dialog from '@radix-ui/react-dialog';
import { LuX } from 'react-icons/lu';
import { tv } from 'tailwind-variants';
import { Divider } from './divider';

export interface ModalProps {
  title: string;
  button?: React.ReactNode;
  open?: boolean;
  alternativeClose?: React.ReactNode;
  onOpenChange?: (open: boolean) => void;
  overflowVisible?: boolean;
}

export const Modal: React.FC<React.PropsWithChildren<ModalProps>> = props => (
  <Dialog.Root open={props.open} onOpenChange={props.onOpenChange}>
    <Dialog.Trigger asChild>{props.button}</Dialog.Trigger>

    <Dialog.Portal>
      <Dialog.Overlay className={style().overlay()} />
      <Dialog.Content className={style({ visible: props.overflowVisible }).box()} aria-describedby={undefined}>
        <Dialog.Close className={style().close()} aria-label="Close modal">
          {props.alternativeClose ? props.alternativeClose : <LuX title="" />}
        </Dialog.Close>

        <h2 className="p-4 text-2xl">
          <Dialog.Title asChild>
            <span>{props.title}</span>
          </Dialog.Title>
        </h2 >
        <Divider />

        <div className="p-6">
          {props.children}
        </div>
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>
);

const style = tv({
  slots: {
    overlay: 'fixed z-[60] top-0 right-0 bottom-0 left-0 bg-neutral-strong/40 animate-fade-in',
    close: 'absolute top-0 right-0 p-4 text-xl cursor-pointer',
    box: [
      'fixed z-[60] top-[80px] left-[50%] translate-x-[-50%]',
      'w-[90%] lg:w-[70%] xl:w-[50%] max-h-[80%] overflow-auto overscroll-contain',
      'bg-white rounded-lg animate-fade-in',
    ],
  },
  variants: {
    visible: {
      true: {
        box: 'overflow-visible',
      },
    },
  },
});
