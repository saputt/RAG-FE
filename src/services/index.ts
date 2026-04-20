import { fetchClient } from '../api/fetch-client';

export const authService = {
  login: (data: any) => fetchClient('/auth/login', { method: 'POST', body: data }),
  register: (data: any) => fetchClient('/auth/register', { method: 'POST', body: data }),
};

export const roomService = {
  getAll: () => fetchClient('/rooms'),
  create: (data: { name: string }) => fetchClient('/room', { method: 'POST', body: data }),
  getOne: (id: string) => fetchClient(`/room/${id}`),
  delete: (id: string) => fetchClient(`/room/${id}`, { method: 'DELETE' }),
  update: (id: string, data: { name: string }) => fetchClient(`/room/${id}`, { method: 'PATCH', body: data }),
};

export const messageService = {
  getAll: (roomId: string) => fetchClient(`/messages/${roomId}`),
  create: (roomId: string, content: string, role = 'USER') => 
    fetchClient(`/message/${roomId}`, { method: 'POST', body: { content, role } }),
};

export const aiService = {
  ingest: (roomId: string, file: File, collectionName: string) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('collection_name', collectionName);
    return fetchClient(`/ingest/${roomId}`, { method: 'POST', body: formData });
  },
};
