import type React from 'react';
import { tv } from 'tailwind-variants';

export const style = tv({
  slots: {
    regular: 'h-[1px] w-full bg-gray-300',
    vertical: 'w-[1px] min-h-full bg-gray-300',
  },
});

export const Divider: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={style().regular({ className })} />
);

export const DividerVertical: React.FC<{ className?: string }> = ({ className = '' }) => (
  <div className={style().vertical({ className })} />
);
