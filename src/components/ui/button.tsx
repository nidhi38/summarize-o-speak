
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-md hover:shadow-primary/20 hover:-translate-y-0.5 active:translate-y-0",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 hover:shadow-md hover:shadow-destructive/20 hover:-translate-y-0.5 active:translate-y-0",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground hover:border-primary/50 hover:-translate-y-0.5 active:translate-y-0",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 hover:shadow-sm hover:-translate-y-0.5 active:translate-y-0",
        ghost: "hover:bg-accent hover:text-accent-foreground hover:-translate-y-0.5 active:translate-y-0",
        link: "text-primary underline-offset-4 hover:underline",
        gradient: "bg-gradient-to-r from-violet-600 to-purple-600 text-white hover:shadow-md hover:shadow-primary/20 hover:-translate-y-0.5 active:translate-y-0",
        glow: "bg-primary text-primary-foreground shadow-[0_0_15px_rgba(139,92,246,0.5)] hover:shadow-[0_0_25px_rgba(139,92,246,0.65)] hover:-translate-y-0.5 active:translate-y-0",
        glass: "glass border border-white/20 text-foreground hover:shadow-glass-hover hover:-translate-y-0.5 active:translate-y-0",
        neon: "relative bg-black text-white hover:-translate-y-0.5 active:translate-y-0 before:absolute before:inset-0 before:-z-10 before:bg-gradient-to-r before:from-pink-500 before:via-purple-500 before:to-indigo-500 before:blur-md before:opacity-75 before:transition-opacity hover:before:opacity-100",
        soft: "bg-primary/15 text-primary hover:bg-primary/25 hover:-translate-y-0.5 active:translate-y-0",
        shiny: "relative bg-primary text-white overflow-hidden isolate before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_2s_infinite] before:border-t before:border-white/20 before:bg-gradient-to-r before:from-transparent before:via-white/20 before:to-transparent",
        outline3d: "border border-primary/30 bg-background shadow-[5px_5px_0px_0px] shadow-primary/40 hover:-translate-y-1 hover:translate-x-1 hover:shadow-[2px_2px_0px_0px] hover:shadow-primary/40 active:translate-y-0",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        xl: "h-12 rounded-md px-10 text-base",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
