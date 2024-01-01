import { Toaster as ToastSonner, toast as toastSonner } from "sonner";

interface ToasterProps {
  position?: "top-center" | "top-left" | "top-right";
  duration?: number;
}

export function Toaster(props: ToasterProps) {
  return <ToastSonner position="top-center" {...props} theme="light" />;
}

interface ToastOptions {
  id?: string;
}

export const toast = {
  error: (message: string, options?: ToastOptions) =>
    toastSonner.error(message, options),

  info: (message: string, options?: ToastOptions) =>
    toastSonner.info(message, options),
};
