import { useCallback } from "react";
import { toast } from "react-hot-toast";

interface PropertyShareData {
  address: string;
  city: string;
  name: string;
}

export const usePropertyShare = ({ address, city, name }: PropertyShareData) =>
  useCallback(async () => {
    const url = window.location.href;
    const text = `${address}, ${city}`;
    try {
      const shared = await shareNative({ text, title: name, url });
      if (!shared) await copyShareUrl(url);
      toast.success(shared ? "Properti siap dibagikan." : "Link properti disalin.");
    } catch (error) {
      if (isShareAbort(error)) return;
      toast.error("Link properti belum bisa dibagikan.");
    }
  }, [address, city, name]);

const shareNative = async (data: ShareData) => {
  if (!navigator.share) return false;
  await navigator.share(data);
  return true;
};

const copyShareUrl = async (url: string) => {
  if (navigator.clipboard?.writeText) return navigator.clipboard.writeText(url);
  copyWithTextarea(url);
};

const copyWithTextarea = (url: string) => {
  const textarea = document.createElement("textarea");
  textarea.value = url;
  textarea.style.position = "fixed";
  textarea.style.opacity = "0";
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand("copy");
  textarea.remove();
};

const isShareAbort = (error: unknown) =>
  error instanceof DOMException && error.name === "AbortError";
