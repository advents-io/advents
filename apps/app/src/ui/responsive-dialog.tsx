import { useMediaQuery } from '@/hooks/use-media-query'
import { cn } from '@/lib/tailwind'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/ui/dialog'
import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/ui/drawer'

interface ResponsiveDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  children: React.ReactNode
}

export const ResponsiveDialog = ({ open, onOpenChange, children }: ResponsiveDialogProps) => {
  const isDesktop = useMediaQuery('(min-width: 768px)')

  return isDesktop ? (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {children}
    </Dialog>
  ) : (
    <Drawer open={open} onOpenChange={onOpenChange}>
      {children}
    </Drawer>
  )
}

interface ResponsiveDialogTriggerProps extends React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean
}

export const ResponsiveDialogTrigger = ({
  asChild = false,
  children,
  className,
}: ResponsiveDialogTriggerProps) => {
  const isDesktop = useMediaQuery('(min-width: 768px)')

  return isDesktop ? (
    <DialogTrigger asChild={asChild} className={className}>
      {children}
    </DialogTrigger>
  ) : (
    <DrawerTrigger asChild={asChild} className={className}>
      {children}
    </DrawerTrigger>
  )
}

interface ResponsiveDialogContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export const ResponsiveDialogContent = ({ children, className }: ResponsiveDialogContentProps) => {
  const isDesktop = useMediaQuery('(min-width: 768px)')

  return isDesktop ? (
    <DialogContent className={className}>{children}</DialogContent>
  ) : (
    <DrawerContent className={cn('h-[90%]', className)}>{children}</DrawerContent>
  )
}

interface ResponsiveDialogHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export const ResponsiveDialogHeader = ({ children, className }: ResponsiveDialogHeaderProps) => {
  const isDesktop = useMediaQuery('(min-width: 768px)')

  return isDesktop ? (
    <DialogHeader className={className}>{children}</DialogHeader>
  ) : (
    <DrawerHeader className={className}>{children}</DrawerHeader>
  )
}

interface ResponsiveDialogTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode
}

export const ResponsiveDialogTitle = ({ children, className }: ResponsiveDialogTitleProps) => {
  const isDesktop = useMediaQuery('(min-width: 768px)')

  return isDesktop ? (
    <DialogTitle className={className}>{children}</DialogTitle>
  ) : (
    <DrawerTitle className={className}>{children}</DrawerTitle>
  )
}

interface ResponsiveDialogFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
}

export const ResponsiveDialogFooter = ({ children, className }: ResponsiveDialogFooterProps) => {
  const isDesktop = useMediaQuery('(min-width: 768px)')

  return isDesktop ? (
    <DialogFooter className={className}>{children}</DialogFooter>
  ) : (
    <DrawerFooter className={cn('px-0', className)}>{children}</DrawerFooter>
  )
}
