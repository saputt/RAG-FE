import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button, Input } from '../components/ui';
import { useAuth } from '../hooks';
import { Link } from 'react-router-dom';
import { Sparkles, Eye, EyeOff } from 'lucide-react';

const RegisterPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { registerMutation } = useAuth();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    registerMutation.mutate({ email, password, name });
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left decorative panel */}
      <div className="hidden lg:flex flex-col justify-between w-[42%] bg-gray-900 p-12">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-gray-900" />
          </div>
          <span className="text-white font-semibold text-lg">Lumina</span>
        </div>

        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 bg-white/10 text-white/80 text-sm px-3 py-1.5 rounded-full">
            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
            Gratis untuk semua
          </div>
          <h2 className="text-4xl font-bold text-white leading-tight">
            Mulai perjalanan<br />belajarmu hari ini.
          </h2>
          <p className="text-white/50 text-base leading-relaxed">
            Buat akun gratis dan mulai bereksperimen dengan AI yang bisa memahami materi belajarmu secara mendalam.
          </p>
        </div>

        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Pengguna', value: '200+' },
            { label: 'Dokumen', value: '1K+' },
            { label: 'Sesi Chat', value: '5K+' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-white font-bold text-xl">{stat.value}</p>
              <p className="text-white/40 text-xs mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-sm"
        >
          {/* Mobile logo */}
          <div className="flex items-center gap-2 mb-10 lg:hidden">
            <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-lg">Lumina</span>
          </div>

          <div className="space-y-2 mb-8">
            <h1 className="text-2xl font-bold text-gray-900">Buat akun baru</h1>
            <p className="text-gray-500 text-sm">Gratis selamanya, tidak perlu kartu kredit</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Nama Lengkap</label>
              <Input
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Email</label>
              <Input
                type="email"
                placeholder="kamu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-medium text-gray-700">Password</label>
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Min. 8 karakter"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pr-11"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {registerMutation.isError && (
              <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3">
                <p className="text-red-600 text-sm">
                  {(registerMutation.error as Error).message}
                </p>
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              className="w-full h-11 mt-2"
              disabled={registerMutation.isPending}
            >
              {registerMutation.isPending ? 'Membuat akun...' : 'Buat Akun'}
            </Button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Sudah punya akun?{' '}
            <Link to="/login" className="text-gray-900 font-semibold hover:underline">
              Masuk
            </Link>
          </p>

          <p className="text-center text-xs text-gray-400 mt-4">
            Dengan mendaftar, kamu menyetujui syarat dan ketentuan kami.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default RegisterPage;
