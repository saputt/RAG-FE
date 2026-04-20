import React, { useState, useRef, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useChat } from "../hooks";
import { Button } from "../components/ui";
import {
  Send,
  Paperclip,
  ArrowLeft,
  Bot,
  User,
  Loader2,
  FileText,
  Sparkles,
  CheckCircle2,
  X,
} from "lucide-react";

interface UploadedFile {
  name: string;
  size: number;
  status: "uploading" | "done" | "error";
  error?: string;
}

const formatFileSize = (bytes: number) => {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
};

const ChatPage = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const { messagesQuery, sendMessageMutation, ingestFileMutation } = useChat(roomId!);
  const [content, setContent] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto scroll
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messagesQuery.data, uploadedFiles]);

  // Auto-resize textarea
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  }, [content]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    sendMessageMutation.mutate(content, {
      onSuccess: () => setContent(""),
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const newFile: UploadedFile = {
      name: file.name,
      size: file.size,
      status: "uploading",
    };

    setUploadedFiles((prev) => [...prev, newFile]);

    ingestFileMutation.mutate(
      { file, collectionName: file.name.split(".")[0] },
      {
        onSuccess: () => {
          setUploadedFiles((prev) =>
            prev.map((f) =>
              f.name === file.name ? { ...f, status: "done" } : f
            )
          );
        },
        onError: (err) => {
          setUploadedFiles((prev) =>
            prev.map((f) =>
              f.name === file.name
                ? { ...f, status: "error", error: (err as any).message }
                : f
            )
          );
        },
      }
    );

    // Reset input so same file can be re-uploaded
    e.target.value = "";
  };

  const removeFile = (fileName: string) => {
    setUploadedFiles((prev) => prev.filter((f) => f.name !== fileName));
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      {/* Header */}
      <header className="h-16 border-b border-gray-100 px-6 flex items-center justify-between flex-shrink-0 bg-white">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate("/dashboard")}
            className="p-2 hover:bg-gray-100 rounded-xl text-gray-500 hover:text-gray-700 transition-colors"
          >
            <ArrowLeft size={18} />
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center flex-shrink-0">
              <Sparkles size={14} className="text-white" />
            </div>
            <div>
              <h2 className="font-semibold text-sm text-gray-900 leading-tight">
                AI Study Room
              </h2>
              <p className="text-xs text-gray-400">
                {messagesQuery.data?.length ?? 0} pesan
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs text-emerald-600 bg-emerald-50 px-2.5 py-1.5 rounded-full font-medium">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
            Online
          </div>
        </div>
      </header>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto">
        {messagesQuery.isLoading ? (
          <div className="flex flex-col items-center justify-center h-full gap-3">
            <Loader2 className="w-6 h-6 text-gray-400 animate-spin" />
            <p className="text-gray-400 text-sm">Memuat percakapan...</p>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto px-6 py-8 space-y-6">
            {/* Empty state */}
            {messagesQuery.data?.length === 0 && uploadedFiles.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center mb-4">
                  <Sparkles size={24} className="text-gray-400" />
                </div>
                <h3 className="font-semibold text-gray-700 mb-1">Mulai percakapan</h3>
                <p className="text-gray-400 text-sm max-w-xs">
                  Upload dokumen terlebih dahulu, lalu tanyakan apapun tentang isinya kepada AI.
                </p>
              </div>
            )}

            {/* Message list */}
            {messagesQuery.data?.map((msg: any) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                className={`flex gap-3 ${msg.role === "BOT" ? "" : "flex-row-reverse"}`}
              >
                {/* Avatar */}
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    msg.role === "BOT"
                      ? "bg-gray-900 text-white"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {msg.role === "BOT" ? (
                    <Bot size={15} />
                  ) : (
                    <User size={15} />
                  )}
                </div>

                {/* Bubble */}
                <div
                  className={`max-w-[75%] ${msg.role !== "BOT" ? "text-right" : ""}`}
                >
                  <p className="text-[11px] font-medium text-gray-400 mb-1.5 px-1">
                    {msg.role === "BOT" ? "Lumina AI" : "Kamu"}
                  </p>
                  <div
                    className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                      msg.role === "BOT"
                        ? "bg-gray-50 text-gray-800 border border-gray-100"
                        : "bg-gray-900 text-white"
                    }`}
                  >
                    {msg.content
                      .replace(/\*\*/g, "")
                      .replace(/###/g, "")
                      .replace(/\*/g, "•")
                      .replace(/__/g, "")}
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Uploaded file bubbles */}
            {uploadedFiles.map((file) => (
              <motion.div
                key={file.name}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-3 flex-row-reverse"
              >
                {/* Avatar */}
                <div className="w-8 h-8 rounded-xl bg-gray-100 text-gray-600 flex items-center justify-center flex-shrink-0">
                  <User size={15} />
                </div>

                {/* File bubble */}
                <div className="max-w-[75%] text-right">
                  <p className="text-[11px] font-medium text-gray-400 mb-1.5 px-1">Kamu</p>
                  <div className="inline-flex flex-col items-end">
                    <div
                      className={`flex items-center gap-3 px-4 py-3 rounded-2xl border text-sm ${
                        file.status === "error"
                          ? "bg-red-50 border-red-100"
                          : "bg-gray-900 border-gray-800"
                      }`}
                    >
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          file.status === "error" ? "bg-red-100" : "bg-white/10"
                        }`}
                      >
                        <FileText
                          size={14}
                          className={file.status === "error" ? "text-red-500" : "text-white"}
                        />
                      </div>
                      <div className="text-left">
                        <p
                          className={`font-medium text-xs leading-tight truncate max-w-[180px] ${
                            file.status === "error" ? "text-red-700" : "text-white"
                          }`}
                        >
                          {file.name}
                        </p>
                        <p
                          className={`text-[10px] mt-0.5 ${
                            file.status === "error" ? "text-red-400" : "text-white/50"
                          }`}
                        >
                          {formatFileSize(file.size)}
                        </p>
                      </div>

                      {/* Status indicator */}
                      {file.status === "uploading" && (
                        <Loader2 size={14} className="text-white/60 animate-spin flex-shrink-0" />
                      )}
                      {file.status === "done" && (
                        <CheckCircle2 size={14} className="text-emerald-400 flex-shrink-0" />
                      )}
                      {file.status === "error" && (
                        <button
                          onClick={() => removeFile(file.name)}
                          className="text-red-400 hover:text-red-600 flex-shrink-0"
                        >
                          <X size={14} />
                        </button>
                      )}
                    </div>

                    {file.status === "uploading" && (
                      <p className="text-[10px] text-gray-400 mt-1 px-1">
                        Sedang diproses ke knowledge base...
                      </p>
                    )}
                    {file.status === "done" && (
                      <p className="text-[10px] text-emerald-500 mt-1 px-1">
                        Dokumen berhasil diingat ✓
                      </p>
                    )}
                    {file.status === "error" && (
                      <p className="text-[10px] text-red-400 mt-1 px-1">
                        {file.error || "Gagal mengupload"}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}

            {/* Thinking indicator */}
            {sendMessageMutation.isPending && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-3"
              >
                <div className="w-8 h-8 rounded-xl bg-gray-900 flex items-center justify-center flex-shrink-0">
                  <Bot size={15} className="text-white" />
                </div>
                <div className="bg-gray-50 border border-gray-100 px-4 py-3 rounded-2xl">
                  <div className="flex items-center gap-1">
                    {[0, 1, 2].map((i) => (
                      <motion.span
                        key={i}
                        className="w-1.5 h-1.5 bg-gray-400 rounded-full"
                        animate={{ opacity: [0.3, 1, 0.3] }}
                        transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.2 }}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-100 px-6 py-4 bg-white flex-shrink-0">
        <div className="max-w-3xl mx-auto">
          <form
            onSubmit={handleSend}
            className="flex items-end gap-3 bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 focus-within:border-gray-300 focus-within:bg-white transition-all"
          >
            {/* File attach */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              title="Upload dokumen"
              className="p-1.5 hover:bg-gray-200 rounded-lg text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0 mb-0.5"
            >
              <Paperclip size={18} />
            </button>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept=".pdf,.txt,.docx,.pptx"
              onChange={handleFileUpload}
            />

            {/* Textarea */}
            <textarea
              ref={textareaRef}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Tanya sesuatu tentang dokumenmu..."
              rows={1}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend(e);
                }
              }}
              className="flex-1 bg-transparent resize-none text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none min-h-[24px] max-h-[160px] py-0.5 leading-relaxed"
            />

            {/* Send button */}
            <button
              type="submit"
              disabled={sendMessageMutation.isPending || !content.trim()}
              className="w-8 h-8 bg-gray-900 hover:bg-gray-800 text-white rounded-xl flex items-center justify-center flex-shrink-0 disabled:opacity-30 disabled:pointer-events-none transition-colors mb-0.5"
            >
              <Send size={14} />
            </button>
          </form>

          <p className="text-center mt-2.5 text-[11px] text-gray-400">
            Tekan Enter untuk kirim · Shift+Enter untuk baris baru
          </p>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
