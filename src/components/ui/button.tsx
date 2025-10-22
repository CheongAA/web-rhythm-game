import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90 rounded-md',
        destructive:
          'bg-destructive text-white hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60 rounded-md',
        outline:
          'border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 rounded-md',
        secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80 rounded-md',
        ghost: 'hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 rounded-md',
        link: 'text-primary underline-offset-4 hover:underline',
        // Pixel Art Variants
        pixel:
          'rounded-none border-2 border-black font-bold shadow-[inset_-4px_-4px_0px_0px_rgba(0,0,0,0.4),inset_4px_4px_0px_0px_rgba(255,255,255,0.4)] active:shadow-[inset_4px_4px_0px_0px_rgba(0,0,0,0.4),inset_-4px_-4px_0px_0px_rgba(255,255,255,0.4)] bg-pixel-neon-cyan text-black',
        'pixel-success':
          'rounded-none border-2 border-black font-bold shadow-[inset_-4px_-4px_0px_0px_rgba(0,0,0,0.4),inset_4px_4px_0px_0px_rgba(255,255,255,0.4)] active:shadow-[inset_4px_4px_0px_0px_rgba(0,0,0,0.4),inset_-4px_-4px_0px_0px_rgba(255,255,255,0.4)] bg-pixel-neon-green text-black',
        'pixel-warning':
          'rounded-none border-2 border-black font-bold shadow-[inset_-4px_-4px_0px_0px_rgba(0,0,0,0.4),inset_4px_4px_0px_0px_rgba(255,255,255,0.4)] active:shadow-[inset_4px_4px_0px_0px_rgba(0,0,0,0.4),inset_-4px_-4px_0px_0px_rgba(255,255,255,0.4)] bg-pixel-neon-yellow text-black',
        'pixel-danger':
          'rounded-none border-2 border-black font-bold shadow-[inset_-4px_-4px_0px_0px_rgba(0,0,0,0.4),inset_4px_4px_0px_0px_rgba(255,255,255,0.4)] active:shadow-[inset_4px_4px_0px_0px_rgba(0,0,0,0.4),inset_-4px_-4px_0px_0px_rgba(255,255,255,0.4)] bg-pixel-neon-red text-white',
        'pixel-lane-1':
          'rounded-none border-2 border-black font-bold shadow-[inset_-4px_-4px_0px_0px_rgba(0,0,0,0.4),inset_4px_4px_0px_0px_rgba(255,255,255,0.4)] active:shadow-[inset_4px_4px_0px_0px_rgba(0,0,0,0.4),inset_-4px_-4px_0px_0px_rgba(255,255,255,0.4)] bg-pixel-lane-1 text-white',
        'pixel-lane-2':
          'rounded-none border-2 border-black font-bold shadow-[inset_-4px_-4px_0px_0px_rgba(0,0,0,0.4),inset_4px_4px_0px_0px_rgba(255,255,255,0.4)] active:shadow-[inset_4px_4px_0px_0px_rgba(0,0,0,0.4),inset_-4px_-4px_0px_0px_rgba(255,255,255,0.4)] bg-pixel-lane-2 text-black',
        'pixel-lane-3':
          'rounded-none border-2 border-black font-bold shadow-[inset_-4px_-4px_0px_0px_rgba(0,0,0,0.4),inset_4px_4px_0px_0px_rgba(255,255,255,0.4)] active:shadow-[inset_4px_4px_0px_0px_rgba(0,0,0,0.4),inset_-4px_-4px_0px_0px_rgba(255,255,255,0.4)] bg-pixel-lane-3 text-white',
        'pixel-lane-4':
          'rounded-none border-2 border-black font-bold shadow-[inset_-4px_-4px_0px_0px_rgba(0,0,0,0.4),inset_4px_4px_0px_0px_rgba(255,255,255,0.4)] active:shadow-[inset_4px_4px_0px_0px_rgba(0,0,0,0.4),inset_-4px_-4px_0px_0px_rgba(255,255,255,0.4)] bg-pixel-lane-4 text-black',
      },
      size: {
        default: 'h-9 px-4 py-2 has-[>svg]:px-3',
        sm: 'h-8 gap-1.5 px-3 has-[>svg]:px-2.5 text-xs',
        lg: 'h-10 px-6 has-[>svg]:px-4',
        icon: 'size-9',
        'icon-sm': 'size-8',
        'icon-lg': 'size-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot : 'button';

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };
