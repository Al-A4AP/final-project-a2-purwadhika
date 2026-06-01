import type { FC } from "react";
import { AlertTriangle, Home, LogIn, RefreshCw } from "lucide-react";
import { isRouteErrorResponse, Link, useRouteError } from "react-router-dom";

type RouteErrorVariant = "public" | "auth" | "tenant";

interface RouteErrorPageProps {
  variant?: RouteErrorVariant;
}

interface ErrorCopy {
  message: string;
  title: string;
}

export const RouteErrorPage: FC<RouteErrorPageProps> = ({ variant = "public" }) => {
  const error = useRouteError();
  const copy = getErrorCopy(error);
  return <RouteErrorView copy={copy} variant={variant} />;
};

const RouteErrorView: FC<{ copy: ErrorCopy; variant: RouteErrorVariant }> = ({ copy, variant }) => (
  <div className={pageClass(variant)}>
    <div className="w-full max-w-lg rounded-xl border bg-white p-8 text-center shadow-sm dark:border-slate-700 dark:bg-slate-800">
      <AlertTriangle className="mx-auto mb-4 text-red-500" size={48} />
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{copy.title}</h1>
      <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-gray-500 dark:text-gray-400">{copy.message}</p>
      <RouteErrorActions variant={variant} />
    </div>
  </div>
);

const RouteErrorActions: FC<{ variant: RouteErrorVariant }> = ({ variant }) => (
  <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
    <button type="button" onClick={reloadPage} className="inline-flex items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700">
      <RefreshCw size={16} /> Muat Ulang
    </button>
    <Link to={fallbackPath(variant)} className="inline-flex items-center justify-center gap-2 rounded-lg border px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 dark:border-slate-600 dark:text-gray-200 dark:hover:bg-slate-700">
      {variant === "tenant" ? <LogIn size={16} /> : <Home size={16} />} {fallbackLabel(variant)}
    </Link>
  </div>
);

const getErrorCopy = (error: unknown): ErrorCopy => {
  if (isDynamicImportError(error)) return dynamicImportCopy;
  if (isRouteErrorResponse(error) && error.status === 404) return notFoundCopy;
  return genericErrorCopy(error);
};

const isDynamicImportError = (error: unknown) => {
  const message = error instanceof Error ? error.message : String(error || "");
  return /dynamically imported module|failed to fetch dynamically imported module|importing a module script failed/i.test(message);
};

const genericErrorCopy = (error: unknown) => ({
  title: "Halaman bermasalah",
  message: error instanceof Error && error.message ? error.message : "Terjadi kendala saat membuka halaman ini.",
});

const dynamicImportCopy = {
  title: "Halaman gagal dimuat",
  message: "File halaman gagal dimuat. Coba muat ulang, atau kembali ke halaman aman terlebih dahulu.",
};

const notFoundCopy = {
  title: "Halaman tidak ditemukan",
  message: "Alamat halaman tidak tersedia atau sudah dipindahkan.",
};

const pageClass = (variant: RouteErrorVariant) =>
  variant === "auth"
    ? "flex min-h-screen items-center justify-center bg-linear-to-br from-red-50 to-blue-50 p-4 dark:from-slate-900 dark:to-slate-800"
    : "flex min-h-[calc(100vh-4rem)] items-center justify-center bg-gray-50 p-4 dark:bg-slate-900";

const fallbackPath = (variant: RouteErrorVariant) => (variant === "tenant" ? "/auth/login" : "/");

const fallbackLabel = (variant: RouteErrorVariant) => (variant === "tenant" ? "Ke Halaman Login" : "Kembali ke Beranda");

const reloadPage = () => window.location.reload();
