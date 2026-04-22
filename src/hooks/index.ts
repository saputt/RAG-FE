import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { roomService, messageService, authService, aiService } from '../services';
import { useAuthStore } from '../store';
import { useNavigate } from 'react-router-dom';

export const useAuth = () => {
  const setAuth = useAuthStore((state) => state.setAuth);
  const navigate = useNavigate();

  const loginMutation = useMutation({
    mutationFn: authService.login,
    onSuccess: (response) => {
      setAuth(response.data.user, response.data.token);
      navigate('/dashboard', { replace: true });
    },
  });

  const registerMutation = useMutation({
    mutationFn: authService.register,
    onSuccess: () => {
      navigate('/login', { replace: true });
    },
  });

  return { loginMutation, registerMutation };
};

export const useRooms = () => {
  const queryClient = useQueryClient();

  const roomsQuery = useQuery({
    queryKey: ['rooms'],
    queryFn: async () => {
      const res = await roomService.getAll();
      return res.data;
    },
  });

  const createRoomMutation = useMutation({
    mutationFn: roomService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
    },
  });

  const deleteRoomMutation = useMutation({
    mutationFn: (id: string) => roomService.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
    },
  });

  const updateRoomMutation = useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) =>
      roomService.update(id, { name }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
    },
  });

  return { roomsQuery, createRoomMutation, deleteRoomMutation, updateRoomMutation };
};

export const useChat = (roomId: string) => {
  const queryClient = useQueryClient();

  const messagesQuery = useQuery({
    queryKey: ['messages', roomId],
    queryFn: async () => {
      const res = await messageService.getAll(roomId);
      return res.data;
    },
    enabled: !!roomId,
  });

  const sendMessageMutation = useMutation({
    mutationFn: (content: string) => messageService.create(roomId, content),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages', roomId] });
    },
  });

  const ingestFileMutation = useMutation({
    mutationFn: ({ file, collectionName }: { file: File; collectionName: string }) =>
      aiService.ingest(roomId, file, collectionName),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['messages', roomId] });
    },
  });

  return { messagesQuery, sendMessageMutation, ingestFileMutation };
};
