"use client"
import { motion } from 'framer-motion'
import { Shield, FileText, Lock, AlertTriangle } from 'lucide-react'

export default function TermsAndConditions({ params: { locale } }: { params: { locale: string } }) {
  
  const content = {
    id: {
      title: "Syarat dan Ketentuan Layanan",
      subtitle: "Pembaruan Terakhir: Februari 2026",
      sections: [
        {
          icon: <FileText className="text-blue-400" size={24} />,
          title: "1. Penerimaan Syarat",
          text: "Dengan mengakses dan menggunakan Domku Box, Anda secara sadar dan tanpa paksaan menyetujui untuk terikat oleh Syarat dan Ketentuan ini. Jika Anda tidak setuju dengan bagian mana pun dari persyaratan ini, Anda dilarang menggunakan atau mengakses layanan ini. Layanan ini disediakan 'sebagaimana adanya' untuk kebutuhan distribusi media tingkat lanjut."
        },
        {
          icon: <Shield className="text-green-400" size={24} />,
          title: "2. Penggunaan yang Diizinkan dan Pembatasan",
          text: "Anda diberikan izin untuk mengunggah, mendistribusikan, dan mengelola media digital menggunakan infrastruktur multi-CDN kami. Namun, Anda secara tegas dilarang: (a) mengunggah konten yang melanggar hukum, berbahaya, mengancam, melecehkan, memfitnah, atau melanggar hak kekayaan intelektual pihak mana pun; (b) mencoba membahayakan, meretas, atau mengganggu integritas server dan jaringan kami melalui DDOS, injeksi SQL, atau serangan keamanan lainnya; (c) menggunakan layanan ini untuk menyebarkan malware, virus, atau kode merusak lainnya."
        },
        {
          icon: <Lock className="text-purple-400" size={24} />,
          title: "3. Keamanan Data dan Privasi",
          text: "Sistem kami menggunakan enkripsi tingkat tinggi dan redundansi multi-database (Prisma, Neon, Turso, Supabase, Appwrite) untuk memastikan ketersediaan dan keamanan data. Kami mencatat alamat IP dan aktivitas unggahan untuk keperluan keamanan dan pemantauan kualitas layanan (QoS). Data ini dikelola secara ketat dan tidak akan dijual kepada pihak ketiga. Kami menggunakan pembatasan otomatis (rate-limiting) untuk memblokir akses yang mencurigakan atau berbahaya secara real-time."
        },
        {
          icon: <AlertTriangle className="text-red-400" size={24} />,
          title: "4. Penolakan Tanggung Jawab (Disclaimer)",
          text: "Aka selaku pengembang tidak bertanggung jawab atas isi konten yang diunggah oleh pengguna pihak ketiga. Kami berhak penuh untuk menghapus, memblokir, atau melarang akses terhadap file atau pengguna tertentu yang terbukti melanggar kebijakan kami tanpa pemberitahuan sebelumnya. Pengguna memikul tanggung jawab hukum penuh atas setiap file yang mereka distribusikan melalui jaringan Domku Box."
        }
      ]
    },
    en: {
      title: "Terms and Conditions of Service",
      subtitle: "Last Updated: February 2026",
      sections: [
        {
          icon: <FileText className="text-blue-400" size={24} />,
          title: "1. Acceptance of Terms",
          text: "By accessing and using Domku Box, you consciously and without coercion agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, you are prohibited from using or accessing this service. This service is provided 'as is' for advanced media distribution needs."
        },
        {
          icon: <Shield className="text-green-400" size={24} />,
          title: "2. Permitted Use and Restrictions",
          text: "You are granted permission to upload, distribute, and manage digital media using our multi-CDN infrastructure. However, you are expressly prohibited from: (a) uploading content that is unlawful, harmful, threatening, harassing, defamatory, or infringes the intellectual property rights of any party; (b) attempting to compromise, hack, or disrupt the integrity of our servers and networks through DDOS, SQL injection, or other security attacks; (c) using this service to distribute malware, viruses, or other destructive code."
        },
        {
          icon: <Lock className="text-purple-400" size={24} />,
          title: "3. Data Security and Privacy",
          text: "Our system utilizes high-level encryption and multi-database redundancy (Prisma, Neon, Turso, Supabase, Appwrite) to ensure data availability and security. We log IP addresses and upload activity for security and Quality of Service (QoS) monitoring purposes. This data is strictly managed and will not be sold to third parties. We employ automated rate-limiting to block suspicious or malicious access in real-time."
        },
        {
          icon: <AlertTriangle className="text-red-400" size={24} />,
          title: "4. Disclaimer of Liability",
          text: "Aka, as the developer, is not responsible for the content uploaded by third-party users. We reserve full rights to delete, block, or prohibit access to specific files or users proven to violate our policies without prior notice. Users bear full legal responsibility for any file they distribute through the Domku Box network."
        }
      ]
    }
  }

  const t = locale === 'id' ? content.id : content.en

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }} 
      animate={{ opacity: 1, y: 0 }} 
      className="w-full max-w-4xl flex flex-col gap-8 mt-10 pb-20"
    >
      <div className="text-center space-y-4 mb-8">
        <h1 className="text-3xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-white">
          {t.title}
        </h1>
        <p className="text-gray-400 text-sm">{t.subtitle}</p>
      </div>

      <div className="flex flex-col gap-6">
        {t.sections.map((section, index) => (
          <motion.div 
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white/5 border border-white/10 p-6 md:p-8 rounded-3xl hover:bg-white/10 transition-colors"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-black/50 rounded-2xl border border-white/5 shadow-inner">
                {section.icon}
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-white tracking-wide">
                {section.title}
              </h2>
            </div>
            <p className="text-gray-300 leading-relaxed text-sm md:text-base text-justify">
              {section.text}
            </p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
