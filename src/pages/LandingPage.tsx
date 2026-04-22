import { motion, useScroll, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useRef } from 'react';
import {
  Sparkles,
  BookOpen,
  Brain,
  Zap,
  Upload,
  MessageSquare,
  Shield,
  ArrowRight,
  Star,
  Users,
  FileText,
  ChevronRight,
  CheckCircle,
  Bot,
} from 'lucide-react';

/* ─── Variants ─────────────────────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, delay: i * 0.09, ease: [0.22, 1, 0.36, 1] },
  }),
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09 } },
};

/* ─── Data ──────────────────────────────────────────────────────── */
const features = [
  {
    icon: Brain,
    title: 'RAG-Powered Intelligence',
    desc: 'Jawaban akurat langsung dari dokumenmu — bukan tebakan AI biasa.',
  },
  {
    icon: BookOpen,
    title: 'Multi-Room Learning',
    desc: 'Pisahkan topik belajarmu ke room berbeda. Skripsi, kuliah, riset — rapi & terorganisir.',
  },
  {
    icon: Zap,
    title: 'Respon Instan',
    desc: 'Dapatkan jawaban dalam detik. Tidak perlu scroll ratusan halaman secara manual.',
  },
  {
    icon: Shield,
    title: 'Aman & Privat',
    desc: 'Setiap room terisolasi. Dokumenmu hanya bisa diakses oleh kamu.',
  },
];

const steps = [
  { num: '01', icon: Upload, title: 'Upload Dokumen', desc: 'Upload PDF, DOCX, atau TXT ke dalam room belajarmu.' },
  { num: '02', icon: Brain, title: 'AI Memahami Isi', desc: 'Lumina memproses & mengindeks setiap bagian dokumen.' },
  { num: '03', icon: MessageSquare, title: 'Tanya Apapun', desc: 'Ajukan pertanyaan, dapatkan jawaban presisi seketika.' },
];

const stats = [
  { value: '10x', label: 'Lebih Cepat Belajar' },
  { value: '99%', label: 'Akurasi Jawaban' },
  { value: '∞', label: 'Dokumen per Room' },
];

const perks = [
  'Tidak perlu kartu kredit',
  'Gratis selamanya',
  'Setup dalam 60 detik',
];

/* ─── Component ─────────────────────────────────────────────────── */
const LandingPage = () => {
  const navigate = useNavigate();
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 50]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 overflow-x-hidden">

      {/* ── Navbar ─────────────────────────────────────────────── */}
      <nav className="fixed top-0 inset-x-0 z-50 bg-white/80 backdrop-blur-xl border-b border-gray-100">
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4"
        >
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gray-900 flex items-center justify-center">
              <Sparkles size={14} className="text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight text-gray-900">Lumina</span>
          </div>

          {/* Links */}
          <div className="hidden md:flex items-center gap-8 text-sm text-gray-500">
            <a href="#features" className="hover:text-gray-900 transition-colors">Fitur</a>
            <a href="#how" className="hover:text-gray-900 transition-colors">Cara Kerja</a>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/login')}
              className="text-sm text-gray-500 hover:text-gray-900 transition-colors px-4 py-2"
            >
              Masuk
            </button>
            <button
              onClick={() => navigate('/register')}
              className="text-sm bg-gray-900 text-white font-semibold px-4 py-2 rounded-xl hover:bg-gray-700 transition-all"
            >
              Mulai Gratis
            </button>
          </div>
        </motion.div>
      </nav>

      {/* ── Hero ───────────────────────────────────────────────── */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex flex-col items-center justify-center pt-40 pb-20 px-6 text-center overflow-hidden bg-white"
      >
        {/* Subtle radial bg */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse 80% 60% at 50% -10%, rgba(0,0,0,0.04) 0%, transparent 70%)',
          }}
        />
        {/* Dot pattern */}
        <div
          className="absolute inset-0 pointer-events-none opacity-30"
          style={{
            backgroundImage: `radial-gradient(circle, #d1d5db 1px, transparent 1px)`,
            backgroundSize: '32px 32px',
          }}
        />

        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="relative z-10 max-w-4xl mx-auto">

          {/* Badge */}
          <motion.div
            variants={fadeUp} initial="hidden" animate="show"
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gray-200 bg-gray-50 text-gray-500 text-xs font-semibold mb-8 uppercase tracking-wider"
          >
            <Sparkles size={11} className="text-gray-900" />
            RAG Learning Platform &mdash; Powered by AI
          </motion.div>

          {/* Headline */}
          <motion.h1
            variants={stagger} initial="hidden" animate="show"
            className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.06] mb-6"
          >
            <motion.span variants={fadeUp} className="block text-gray-900">
              Belajar Lebih Cerdas
            </motion.span>
            <motion.span variants={fadeUp} className="block text-gray-900">
              dengan{' '}
              <span className="relative inline-block">
                Dokumenmu
                {/* underline accent */}
                <motion.span
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.7, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute bottom-1 left-0 right-0 h-1 bg-gray-900 rounded-full origin-left"
                />
              </span>
            </motion.span>
          </motion.h1>

          {/* Subtext */}
          <motion.p
            variants={fadeUp} initial="hidden" animate="show" custom={3}
            className="text-lg text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed font-light"
          >
            Upload materi kuliah, jurnal, atau skripsimu. Lumina membaca, memahami,
            dan menjawab pertanyaanmu seperti tutor pribadi 24/7.
          </motion.p>

          {/* CTAs */}
          <motion.div
            variants={fadeUp} initial="hidden" animate="show" custom={4}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 mb-10"
          >
            <button
              onClick={() => navigate('/register')}
              className="group flex items-center gap-2 px-8 py-4 rounded-2xl bg-gray-900 text-white font-semibold text-base hover:bg-gray-700 transition-all duration-200 shadow-lg shadow-gray-900/10 hover:-translate-y-0.5"
            >
              Mulai Belajar Gratis
              <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => navigate('/login')}
              className="flex items-center gap-2 px-8 py-4 rounded-2xl border border-gray-200 text-gray-500 font-medium text-base hover:border-gray-300 hover:text-gray-700 hover:bg-gray-50 transition-all duration-200"
            >
              Sudah punya akun?
              <ChevronRight size={16} />
            </button>
          </motion.div>

          {/* Perks */}
          <motion.div
            variants={fadeUp} initial="hidden" animate="show" custom={5}
            className="flex items-center justify-center gap-6"
          >
            {perks.map((p) => (
              <span key={p} className="flex items-center gap-1.5 text-xs text-gray-400">
                <CheckCircle size={12} className="text-gray-400" />
                {p}
              </span>
            ))}
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={stagger} initial="hidden" animate="show"
            className="flex items-center justify-center gap-14 mt-16 pt-10 border-t border-gray-100"
          >
            {stats.map((s, i) => (
              <motion.div key={s.label} variants={fadeUp} custom={i + 6} className="text-center">
                <p className="text-3xl font-extrabold text-gray-900">{s.value}</p>
                <p className="text-xs text-gray-400 mt-1 uppercase tracking-wider font-medium">{s.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <span className="text-[10px] text-gray-300 tracking-widest uppercase">Scroll</span>
          <motion.div
            animate={{ y: [0, 6, 0] }} transition={{ duration: 1.5, repeat: Infinity }}
            className="w-px h-8 bg-gradient-to-b from-gray-300 to-transparent"
          />
        </motion.div>
      </section>

      {/* ── Features ───────────────────────────────────────────── */}
      <section id="features" className="py-28 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <motion.div
            variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }}
            className="text-center mb-16"
          >
            <motion.p variants={fadeUp} className="text-gray-400 text-xs font-bold uppercase tracking-[0.2em] mb-3">
              Kenapa Lumina?
            </motion.p>
            <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 mb-4">
              Semua yang kamu butuhkan
            </motion.h2>
            <motion.p variants={fadeUp} className="text-gray-400 text-lg max-w-xl mx-auto">
              Dirancang untuk pelajar dan peneliti yang ingin belajar lebih efisien.
            </motion.p>
          </motion.div>

          <motion.div
            variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                variants={fadeUp}
                custom={i}
                whileHover={{ y: -3 }}
                className="group bg-white border border-gray-100 rounded-2xl p-6 hover:border-gray-200 hover:shadow-lg hover:shadow-gray-100 transition-all duration-200 cursor-default"
              >
                <div className="w-10 h-10 rounded-xl bg-gray-100 group-hover:bg-gray-900 flex items-center justify-center mb-4 transition-colors duration-200">
                  <f.icon size={18} className="text-gray-600 group-hover:text-white transition-colors duration-200" />
                </div>
                <h3 className="text-base font-bold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── How It Works ───────────────────────────────────────── */}
      <section id="how" className="py-28 px-6 bg-white">
        <div className="max-w-5xl mx-auto">
          <motion.div
            variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }}
            className="text-center mb-16"
          >
            <motion.p variants={fadeUp} className="text-gray-400 text-xs font-bold uppercase tracking-[0.2em] mb-3">
              Cara Kerja
            </motion.p>
            <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 mb-4">
              Tiga langkah mudah
            </motion.h2>
            <motion.p variants={fadeUp} className="text-gray-400 text-lg max-w-lg mx-auto">
              Dari upload dokumen hingga dapat jawaban — semuanya dalam menit.
            </motion.p>
          </motion.div>

          <motion.div
            variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 relative"
          >
            {/* Connector line */}
            <div className="hidden md:block absolute top-11 left-[calc(16.67%+1.5rem)] right-[calc(16.67%+1.5rem)] h-px bg-gray-100" />

            {steps.map((s, i) => (
              <motion.div
                key={s.num}
                variants={fadeUp}
                custom={i}
                className="flex flex-col items-center text-center"
              >
                <div className="relative w-[88px] h-[88px] rounded-[22px] bg-gray-50 border border-gray-100 flex flex-col items-center justify-center mb-6 z-10">
                  <s.icon size={24} className="text-gray-900 mb-1" />
                  <span className="text-[9px] text-gray-300 font-bold tracking-[0.15em]">{s.num}</span>
                </div>
                <h3 className="text-base font-bold text-gray-900 mb-2">{s.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed max-w-[200px]">{s.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Demo Chat ──────────────────────────────────────────── */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="rounded-3xl border border-gray-100 bg-white overflow-hidden shadow-xl shadow-gray-100"
          >
            {/* Window chrome */}
            <div className="flex items-center gap-2 px-5 py-3.5 border-b border-gray-100 bg-gray-50">
              <div className="w-2.5 h-2.5 rounded-full bg-red-400/70" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/70" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-400/70" />
              <div className="flex-1 flex justify-center">
                <div className="flex items-center gap-2 bg-white border border-gray-100 rounded-lg px-3 py-1">
                  <Sparkles size={10} className="text-gray-400" />
                  <span className="text-[11px] text-gray-400">Lumina — Riset Skripsi AI</span>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="p-6 space-y-5">

              {/* AI */}
              <motion.div
                initial={{ opacity: 0, x: -14 }} whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }} transition={{ delay: 0.2 }}
                className="flex gap-3"
              >
                <div className="w-8 h-8 rounded-xl bg-gray-900 flex items-center justify-center flex-shrink-0">
                  <Bot size={14} className="text-white" />
                </div>
                <div className="flex flex-col">
                  <p className="text-[11px] font-medium text-gray-400 mb-1.5 px-1">Lumina AI</p>
                  <div className="bg-gray-50 border border-gray-100 rounded-2xl rounded-tl-sm px-4 py-3 max-w-md">
                    <p className="text-sm text-gray-600 leading-relaxed">
                      Halo! Saya sudah membaca dokumen skripsimu. Ada yang ingin kamu tanyakan?
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* User */}
              <motion.div
                initial={{ opacity: 0, x: 14 }} whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }} transition={{ delay: 0.4 }}
                className="flex gap-3 flex-row-reverse"
              >
                <div className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center flex-shrink-0">
                  <Users size={13} className="text-gray-500" />
                </div>
                <div className="flex flex-col items-end">
                  <p className="text-[11px] font-medium text-gray-400 mb-1.5 px-1">Kamu</p>
                  <div className="bg-gray-900 rounded-2xl rounded-tr-sm px-4 py-3 max-w-sm">
                    <p className="text-sm text-white leading-relaxed">
                      Jelaskan metode sampling di bab 3!
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* AI answer */}
              <motion.div
                initial={{ opacity: 0, x: -14 }} whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }} transition={{ delay: 0.6 }}
                className="flex gap-3"
              >
                <div className="w-8 h-8 rounded-xl bg-gray-900 flex items-center justify-center flex-shrink-0">
                  <Bot size={14} className="text-white" />
                </div>
                <div className="flex flex-col">
                  <p className="text-[11px] font-medium text-gray-400 mb-1.5 px-1">Lumina AI</p>
                  <div className="bg-gray-50 border border-gray-100 rounded-2xl rounded-tl-sm px-4 py-3 max-w-md">
                    <p className="text-sm text-gray-600 leading-relaxed">
                      Berdasarkan Bab 3 (hal. 47),{' '}
                      <span className="font-semibold text-gray-900">purposive sampling</span>{' '}
                      digunakan dengan kriteria: usia 18–35, aktif media sosial ≥2 jam/hari,
                      dari 3 kota besar...
                    </p>
                  </div>
                </div>
              </motion.div>

              {/* Typing */}
              <motion.div
                initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
                viewport={{ once: true }} transition={{ delay: 0.8 }}
                className="flex gap-3"
              >
                <div className="w-8 h-8 rounded-xl bg-gray-900 flex items-center justify-center flex-shrink-0">
                  <Bot size={14} className="text-white" />
                </div>
                <div className="bg-gray-50 border border-gray-100 rounded-2xl rounded-tl-sm px-4 py-3">
                  <div className="flex gap-1 items-center">
                    {[0, 1, 2].map((i) => (
                      <motion.span
                        key={i}
                        className="w-1.5 h-1.5 rounded-full bg-gray-400"
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.2 }}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Input bar */}
            <div className="px-6 pb-6">
              <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3">
                <FileText size={15} className="text-gray-300 flex-shrink-0" />
                <span className="text-sm text-gray-300 flex-1">Tanya tentang dokumenmu...</span>
                <div className="w-8 h-8 rounded-xl bg-gray-900 flex items-center justify-center">
                  <ArrowRight size={14} className="text-white" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────────────── */}
      <section className="py-28 px-6 bg-gray-900">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-white/60 text-xs font-semibold mb-8 uppercase tracking-wider">
            <Star size={11} className="text-white/50" />
            Gratis selamanya
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-5">
            Siap belajar lebih efisien?
          </h2>
          <p className="text-white/40 text-lg mb-10 max-w-xl mx-auto leading-relaxed">
            Bergabung dengan ratusan pelajar yang sudah menggunakan Lumina
            untuk menaklukkan materi perkuliahan mereka.
          </p>
          <button
            onClick={() => navigate('/register')}
            className="group inline-flex items-center gap-2 px-10 py-4 rounded-2xl bg-white text-gray-900 font-semibold text-base hover:bg-gray-100 hover:-translate-y-0.5 transition-all duration-200 shadow-xl shadow-black/20"
          >
            Buat Akun Gratis
            <ArrowRight size={17} className="group-hover:translate-x-1 transition-transform" />
          </button>

          <div className="flex items-center justify-center gap-6 mt-8">
            {perks.map((p) => (
              <span key={p} className="flex items-center gap-1.5 text-xs text-white/30">
                <CheckCircle size={12} className="text-white/30" />
                {p}
              </span>
            ))}
          </div>
        </motion.div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────── */}
      <footer className="border-t border-gray-100 py-10 px-6 bg-white">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-gray-900 flex items-center justify-center">
              <Sparkles size={12} className="text-white" />
            </div>
            <span className="font-bold text-gray-900 tracking-tight">Lumina</span>
          </div>
          <p className="text-sm text-gray-400">
            © {new Date().getFullYear()} Lumina. Dibuat dengan ❤️ untuk pelajar Indonesia.
          </p>
          <div className="flex items-center gap-5 text-gray-400 text-sm">
            <a href="#" className="hover:text-gray-700 transition-colors">Privasi</a>
            <a href="#" className="hover:text-gray-700 transition-colors">Syarat</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
