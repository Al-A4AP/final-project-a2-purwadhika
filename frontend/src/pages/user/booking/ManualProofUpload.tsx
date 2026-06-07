import type { ChangeEvent, FC } from "react";
import { useEffect, useMemo } from "react";
import { UploadCloud } from "lucide-react";
import { toast } from "react-hot-toast";

interface ManualProofUploadProps {
  proofFile: File | null;
  onProofFileChange: (file: File | null) => void;
}

export const ManualProofUpload: FC<ManualProofUploadProps> = ({ proofFile, onProofFileChange }) => {
  const previewUrl = useProofPreview(proofFile);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!isValidProofSize(file)) {
      toast.error("Ukuran gambar tidak boleh melebihi 1MB");
      event.target.value = "";
      return;
    }
    onProofFileChange(file);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      <StepIntro title="Unggah Bukti Transfer" description="Format gambar yang didukung: JPG, PNG. Maksimal 1MB." />
      <ProofDropzone file={proofFile} previewUrl={previewUrl} onFileChange={handleFileChange} />
      {!proofFile && <p className="text-center text-xs text-red-500">* Bukti transfer wajib diunggah untuk melanjutkan.</p>}
    </div>
  );
};

export const StepIntro: FC<{ description: string; title: string }> = ({ description, title }) => (
  <div>
    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{title}</h2>
    <p className="text-sm text-slate-500">{description}</p>
  </div>
);

const ProofDropzone: FC<{
  file: File | null;
  onFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
  previewUrl: string | null;
}> = ({ file, onFileChange, previewUrl }) => (
  <label className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50 p-12 transition hover:border-red-500 hover:bg-red-50 dark:border-slate-700 dark:bg-slate-800 dark:hover:border-red-500 dark:hover:bg-red-900/10">
    {file && previewUrl ? <ProofPreview file={file} previewUrl={previewUrl} /> : <ProofPlaceholder />}
    <input type="file" accept="image/jpeg, image/png" onChange={onFileChange} className="hidden" />
  </label>
);

const ProofPreview: FC<{ file: File; previewUrl: string }> = ({ file, previewUrl }) => (
  <>
    <div className="mb-4 h-32 w-24 overflow-hidden rounded-xl border border-slate-200 shadow-sm dark:border-slate-700">
      <img src={previewUrl} alt="Preview" className="h-full w-full object-cover" />
    </div>
    <p className="max-w-[200px] truncate font-semibold text-slate-900 dark:text-white">{file.name}</p>
    <p className="mt-1 text-sm text-slate-500">Klik untuk mengganti gambar</p>
  </>
);

const ProofPlaceholder: FC = () => (
  <>
    <UploadCloud className="mb-4 h-12 w-12 text-slate-400" />
    <p className="font-semibold text-slate-900 dark:text-white">Pilih atau letakkan gambar di sini</p>
  </>
);

const isValidProofSize = (file: File) => file.size <= 1 * 1024 * 1024;

const useProofPreview = (file: File | null) => {
  const preview = useMemo(() => (file ? URL.createObjectURL(file) : null), [file]);
  useEffect(() => () => {
    if (preview) URL.revokeObjectURL(preview);
  }, [preview]);
  return preview;
};
