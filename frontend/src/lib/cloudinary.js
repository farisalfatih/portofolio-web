// Cloudinary Upload Helper
// Pastikan VITE_CLOUDINARY_CLOUD_NAME dan VITE_CLOUDINARY_UPLOAD_PRESET sudah diset di .env

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET

/**
 * Upload file ke Cloudinary
 * @param {File} file - File yang akan diupload
 * @param {'image' | 'raw'} resourceType - Tipe resource (image untuk foto, raw untuk PDF/CV)
 * @param {Function} onProgress - Callback progress (0-100)
 * @returns {Promise<{url: string, public_id: string}>}
 */
export async function uploadToCloudinary(file, resourceType = 'image', onProgress = null) {
  if (!CLOUD_NAME || !UPLOAD_PRESET) {
    throw new Error('Cloudinary belum dikonfigurasi. Tambahkan VITE_CLOUDINARY_CLOUD_NAME dan VITE_CLOUDINARY_UPLOAD_PRESET di file .env')
  }

  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', UPLOAD_PRESET)

  const uploadUrl = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/${resourceType}/upload`

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()

    xhr.upload.addEventListener('progress', (e) => {
      if (e.lengthComputable && onProgress) {
        const percent = Math.round((e.loaded / e.total) * 100)
        onProgress(percent)
      }
    })

    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        const data = JSON.parse(xhr.responseText)
        resolve({ url: data.secure_url, public_id: data.public_id })
      } else {
        const err = JSON.parse(xhr.responseText)
        reject(new Error(err.error?.message || 'Upload gagal'))
      }
    })

    xhr.addEventListener('error', () => reject(new Error('Upload gagal. Cek koneksi internet.')))

    xhr.open('POST', uploadUrl)
    xhr.send(formData)
  })
}

/**
 * Validasi file gambar
 */
export function validateImage(file, maxMB = 5) {
  const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
  if (!validTypes.includes(file.type)) {
    throw new Error('Format gambar tidak didukung. Gunakan JPG, PNG, WebP, atau GIF.')
  }
  if (file.size > maxMB * 1024 * 1024) {
    throw new Error(`Ukuran gambar maksimal ${maxMB}MB.`)
  }
}

/**
 * Validasi file CV/PDF
 */
export function validateCV(file, maxMB = 10) {
  if (file.type !== 'application/pdf') {
    throw new Error('CV harus berformat PDF.')
  }
  if (file.size > maxMB * 1024 * 1024) {
    throw new Error(`Ukuran CV maksimal ${maxMB}MB.`)
  }
}
