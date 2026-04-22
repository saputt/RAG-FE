import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, Input } from '../components/ui';
import { useRooms } from '../hooks';
import { useAuthStore, useRoomStore } from '../store';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  LayoutDashboard,
  Settings,
  LogOut,
  Loader2,
  BookOpen,
  MessageSquare,
  ChevronRight,
  Sparkles,
  X,
  Pencil,
  Trash2,
  AlertTriangle,
} from 'lucide-react';

const DashboardPage = () => {
  const { user, logout } = useAuthStore();
  const { roomsQuery, createRoomMutation, deleteRoomMutation, updateRoomMutation } = useRooms();
  const { setActiveRoomId } = useRoomStore();
  const navigate = useNavigate();

  // Create modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newRoomName, setNewRoomName] = useState('');

  // Delete modal state
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);

  // Edit modal state
  const [editTarget, setEditTarget] = useState<{ id: string; name: string } | null>(null);
  const [editRoomName, setEditRoomName] = useState('');

  const handleCreateRoom = (e: React.FormEvent) => {
    e.preventDefault();
    createRoomMutation.mutate(
      { name: newRoomName },
      {
        onSuccess: () => {
          setIsModalOpen(false);
          setNewRoomName('');
        },
      }
    );
  };

  const handleOpenEdit = (e: React.MouseEvent, room: { id: string; name: string }) => {
    e.stopPropagation();
    setEditTarget(room);
    setEditRoomName(room.name);
  };

  const handleEditRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editTarget) return;
    updateRoomMutation.mutate(
      { id: editTarget.id, name: editRoomName },
      {
        onSuccess: () => {
          setEditTarget(null);
          setEditRoomName('');
        },
      }
    );
  };

  const handleOpenDelete = (e: React.MouseEvent, room: { id: string; name: string }) => {
    e.stopPropagation();
    setDeleteTarget(room);
  };

  const handleDeleteRoom = () => {
    if (!deleteTarget) return;
    deleteRoomMutation.mutate(deleteTarget.id, {
      onSuccess: () => {
        setDeleteTarget(null);
      },
    });
  };

  const enterRoom = (id: string) => {
    setActiveRoomId(id);
    navigate(`/chat/${id}`);
  };

  const initials = user?.name
    ? user.name.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2)
    : 'U';

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-100 flex flex-col sticky top-0 h-screen">
        {/* Logo */}
        <div className="p-5 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg tracking-tight">Lumina</span>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1">
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl bg-gray-100 text-gray-900 text-sm font-medium transition-colors">
            <LayoutDashboard size={16} />
            <span>Dashboard</span>
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-500 text-sm font-medium hover:bg-gray-50 hover:text-gray-700 transition-colors">
            <Settings size={16} />
            <span>Pengaturan</span>
          </button>
        </nav>

        {/* User profile */}
        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-full bg-gray-900 text-white flex items-center justify-center text-xs font-semibold flex-shrink-0">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{user?.name || 'User'}</p>
              <p className="text-xs text-gray-400 truncate">{user?.email || ''}</p>
            </div>
          </div>
          <button
            onClick={() => { logout(); navigate('/login'); }}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-red-500 text-sm font-medium hover:bg-red-50 transition-colors"
          >
            <LogOut size={14} />
            <span>Keluar</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8 max-w-5xl">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Halo, {user?.name?.split(' ')[0] || 'teman'} 👋
            </h1>
            <p className="text-gray-500 text-sm mt-1">Pilih ruang belajar atau buat yang baru.</p>
          </div>
          <Button
            variant="primary"
            size="md"
            className="gap-2"
            onClick={() => setIsModalOpen(true)}
          >
            <Plus size={15} />
            Ruang Baru
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            {
              icon: BookOpen,
              label: 'Total Ruang',
              value: roomsQuery.data?.length ?? '–',
              color: 'bg-blue-50 text-blue-600',
            },
            {
              icon: MessageSquare,
              label: 'Total Pesan',
              value: roomsQuery.data?.reduce((sum: number, r: any) => sum + (r._count?.messages || 0), 0) ?? '–',
              color: 'bg-emerald-50 text-emerald-600',
            },
            {
              icon: Sparkles,
              label: 'Sesi Aktif',
              value: '1',
              color: 'bg-amber-50 text-amber-600',
            },
          ].map((stat) => (
            <div key={stat.label} className="bg-white rounded-2xl border border-gray-100 p-5">
              <div className={`w-9 h-9 rounded-xl ${stat.color} flex items-center justify-center mb-3`}>
                <stat.icon size={18} />
              </div>
              <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              <p className="text-xs text-gray-400 mt-0.5">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Rooms */}
        <div>
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
            Ruang Belajar
          </h2>

          {roomsQuery.isLoading ? (
            <div className="flex items-center justify-center h-48">
              <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
            </div>
          ) : roomsQuery.data?.length === 0 ? (
            <div className="bg-white border border-dashed border-gray-200 rounded-2xl py-16 text-center">
              <div className="w-12 h-12 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-3">
                <BookOpen size={24} className="text-gray-400" />
              </div>
              <p className="text-gray-500 text-sm font-medium">Belum ada ruang belajar</p>
              <p className="text-gray-400 text-xs mt-1">Buat ruang pertamamu untuk memulai</p>
              <Button
                variant="primary"
                size="sm"
                className="mt-4 gap-2"
                onClick={() => setIsModalOpen(true)}
              >
                <Plus size={13} /> Buat Ruang
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {roomsQuery.data?.map((room: any) => (
                <motion.div
                  key={room.id}
                  whileHover={{ y: -2 }}
                  onClick={() => enterRoom(room.id)}
                  className="bg-white border border-gray-100 rounded-2xl p-5 cursor-pointer group hover:border-gray-200 hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl bg-gray-100 group-hover:bg-gray-900 flex items-center justify-center transition-colors duration-200 flex-shrink-0">
                      <BookOpen
                        size={18}
                        className="text-gray-500 group-hover:text-white transition-colors duration-200"
                      />
                    </div>
                    {/* Action buttons — muncul saat hover */}
                    <div
                      className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={(e) => handleOpenEdit(e, { id: room.id, name: room.name })}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                        title="Edit room"
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={(e) => handleOpenDelete(e, { id: room.id, name: room.name })}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                        title="Hapus room"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1 group-hover:text-gray-900 truncate">
                    {room.name}
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <MessageSquare size={11} />
                      {room._count?.messages || 0} pesan
                    </span>
                    <span>•</span>
                    <span>{new Date(room.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' })}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Create Room Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/20 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              className="relative bg-white rounded-2xl w-full max-w-md p-6 shadow-large"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Ruang Baru</h2>
                  <p className="text-gray-500 text-sm mt-0.5">Beri nama ruang belajarmu</p>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-xl text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleCreateRoom} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">Nama Ruang</label>
                  <Input
                    placeholder="cth. Mata Kuliah AI, Riset Skripsi..."
                    autoFocus
                    value={newRoomName}
                    onChange={(e) => setNewRoomName(e.target.value)}
                    required
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <Button
                    type="button"
                    variant="secondary"
                    className="flex-1"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Batal
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    className="flex-1"
                    disabled={createRoomMutation.isPending || !newRoomName.trim()}
                  >
                    {createRoomMutation.isPending ? 'Membuat...' : 'Buat Ruang'}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Room Modal */}
      <AnimatePresence>
        {editTarget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditTarget(null)}
              className="absolute inset-0 bg-black/20 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              className="relative bg-white rounded-2xl w-full max-w-md p-6 shadow-xl"
            >
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-lg font-bold text-gray-900">Edit Ruang</h2>
                  <p className="text-gray-500 text-sm mt-0.5">Ubah nama ruang belajarmu</p>
                </div>
                <button
                  onClick={() => setEditTarget(null)}
                  className="p-2 hover:bg-gray-100 rounded-xl text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleEditRoom} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-gray-700">Nama Ruang</label>
                  <Input
                    placeholder="Masukkan nama baru..."
                    autoFocus
                    value={editRoomName}
                    onChange={(e) => setEditRoomName(e.target.value)}
                    required
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <Button
                    type="button"
                    variant="secondary"
                    className="flex-1"
                    onClick={() => setEditTarget(null)}
                  >
                    Batal
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    className="flex-1"
                    disabled={updateRoomMutation.isPending || !editRoomName.trim()}
                  >
                    {updateRoomMutation.isPending ? 'Menyimpan...' : 'Simpan'}
                  </Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteTarget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setDeleteTarget(null)}
              className="absolute inset-0 bg-black/20 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              transition={{ duration: 0.2 }}
              className="relative bg-white rounded-2xl w-full max-w-sm p-6 shadow-xl"
            >
              <div className="flex flex-col items-center text-center mb-6">
                <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center mb-4">
                  <AlertTriangle size={22} className="text-red-500" />
                </div>
                <h2 className="text-lg font-bold text-gray-900 mb-1">Hapus Ruang?</h2>
                <p className="text-gray-500 text-sm">
                  Kamu akan menghapus{' '}
                  <span className="font-semibold text-gray-800">"{deleteTarget.name}"</span>.
                  Tindakan ini tidak bisa dibatalkan.
                </p>
              </div>

              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="secondary"
                  className="flex-1"
                  onClick={() => setDeleteTarget(null)}
                  disabled={deleteRoomMutation.isPending}
                >
                  Batal
                </Button>
                <button
                  onClick={handleDeleteRoom}
                  disabled={deleteRoomMutation.isPending}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition-colors disabled:opacity-60"
                >
                  {deleteRoomMutation.isPending ? (
                    <Loader2 size={15} className="animate-spin" />
                  ) : (
                    <Trash2 size={15} />
                  )}
                  {deleteRoomMutation.isPending ? 'Menghapus...' : 'Hapus'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DashboardPage;
