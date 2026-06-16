import type { ComponentType, FC } from 'react';
import { useState, useCallback } from 'react';
import CropperComponent, { type CropperProps } from 'react-easy-crop';
import { ZoomIn, ZoomOut } from 'lucide-react';
import { Modal } from './Modal';
import type { Area } from '@/lib/cropImage';
import { getCroppedImg } from '@/lib/cropImage';
import { toast } from 'react-hot-toast';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string | null;
  aspect: number;
  onCropComplete: (croppedBlob: Blob) => void;
}

type EasyCropperProps = Pick<
  CropperProps,
  'aspect' | 'crop' | 'image' | 'onCropChange' | 'onCropComplete' | 'onZoomChange' | 'zoom'
>;

const cropperComponentModule: unknown = CropperComponent;
// react-easy-crop class typings are not JSX-compatible with React 19.
const TypedCropper = cropperComponentModule as ComponentType<CropperProps>;

const EasyCropper: FC<EasyCropperProps> = (props) => (
  <TypedCropper
    {...props}
    classes={{}}
    cropperProps={{}}
    cropShape="rect"
    keyboardStep={1}
    maxZoom={3}
    mediaProps={{}}
    minZoom={1}
    restrictPosition
    rotation={0}
    style={{}}
    zoomSpeed={1}
  />
);

export const ImageCropperModal: FC<Props> = ({
  isOpen,
  onClose,
  imageSrc,
  aspect,
  onCropComplete,
}) => {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);
  const [loading, setLoading] = useState(false);

  const onCropCompleteHandler = useCallback((_croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const handleSave = async () => {
    if (!imageSrc || !croppedAreaPixels) return;
    setLoading(true);
    try {
      const croppedBlob = await getCroppedImg(imageSrc, croppedAreaPixels);
      onCropComplete(croppedBlob);
      onClose();
    } catch {
      toast.error('Gagal memotong gambar');
    } finally {
      setLoading(false);
    }
  };

  const zoomIn = () => setZoom((prev) => Math.min(prev + 0.2, 3));
  const zoomOut = () => setZoom((prev) => Math.max(prev - 0.2, 1));

  if (!imageSrc) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Sesuaikan Gambar" maxWidth="md">
      <div className="flex flex-col gap-6">
        <div className="relative w-full h-80 bg-slate-900 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
          <EasyCropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            aspect={aspect}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropCompleteHandler}
          />
        </div>

        <div className="flex items-center gap-4 bg-gray-50 dark:bg-slate-800/50 p-4 rounded-xl">
          <button onClick={zoomOut} className="p-2 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors">
            <ZoomOut size={18} />
          </button>
          <input
            type="range"
            min={1}
            max={3}
            step={0.1}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="flex-1 accent-rose-600 h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
          <button onClick={zoomIn} className="p-2 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 transition-colors">
            <ZoomIn size={18} />
          </button>
        </div>

        <div className="flex justify-end gap-3 border-t pt-4 dark:border-slate-700">
          <button
            onClick={onClose}
            disabled={loading}
            className="px-4 py-2 border border-slate-300 hover:border-slate-400 dark:border-slate-600 dark:text-slate-300 rounded-lg text-sm font-medium transition-colors"
          >
            Batal
          </button>
          <button
            onClick={handleSave}
            disabled={loading}
            className="px-5 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-sm font-semibold transition-colors disabled:opacity-50"
          >
            {loading ? 'Memotong...' : 'Potong & Simpan'}
          </button>
        </div>
      </div>
    </Modal>
  );
};
