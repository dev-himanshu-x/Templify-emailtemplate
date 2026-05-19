import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

import { toast } from "sonner";
export function validateUrl(url: string) {
  if (!url || url.trim() === '') return true;
  if (!url.startsWith('http://') && !url.startsWith('https://') && !url.startsWith('mailto:') && !url.startsWith('tel:') && !url.startsWith('#') && !url.startsWith('/')) {
    toast.error("Invalid URL", {
      description: "URL must start with https://, http://, or mailto:"
    });
    return false;
  }
  return true;
}
