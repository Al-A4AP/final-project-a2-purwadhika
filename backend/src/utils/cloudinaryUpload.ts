import cloudinary from '../config/cloudinary';

export const uploadBuffer = (
  buffer: Buffer,
  folder = 'proprrent'
): Promise<{ url: string; public_id: string }> =>
  new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream({ folder }, (err, result) => {
        if (err || !result) return reject(err || new Error('Upload gagal'));
        resolve({ url: result.secure_url, public_id: result.public_id });
      })
      .end(buffer);
  });

export const deleteFromCloudinary = (public_id: string) =>
  cloudinary.uploader.destroy(public_id);
