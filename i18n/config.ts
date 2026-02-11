import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

const resources = {
  id: {
    translation: {
      welcome: "Unggah dan Distribusikan Mediamu",
      upload: "Unggah File",
      start: "Mulai",
      dragDrop: "Tarik dan lepas media ke sini, atau klik untuk memilih",
      copy: "Salin",
      open: "Buka",
      apidocs: "Dokumentasi API",
      maxFiles: "Maksimal 5 file",
      uploading: "Sedang mengunggah...",
      success: "Berhasil diunggah!",
      home: "Beranda"
    }
  },
  en: {
    translation: {
      welcome: "Upload and Distribute Your Media",
      upload: "Upload Files",
      start: "Start",
      dragDrop: "Drag and drop media here, or click to select",
      copy: "Copy",
      open: "Open",
      apidocs: "API Documentation",
      maxFiles: "Max 5 files",
      uploading: "Uploading...",
      success: "Successfully uploaded!",
      home: "Home"
    }
  }
}

i18n.use(initReactI18next).init({
  resources,
  lng: "id",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false
  }
})

export default i18n
