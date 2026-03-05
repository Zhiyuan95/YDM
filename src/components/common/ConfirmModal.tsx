"use client";

import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle } from "lucide-react";

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDanger?: boolean;
}

export default function ConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  isDanger = true,
}: ConfirmModalProps) {
  
  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm"
          />
          
          {/* Modal Modal */}
          <div className="fixed inset-0 z-[101] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="bg-white rounded-xl shadow-2xl border border-zinc-100 p-6 w-full max-w-sm pointer-events-auto"
            >
              <div className="flex flex-col items-center text-center">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${isDanger ? 'bg-red-50 text-red-600' : 'bg-zinc-100 text-zinc-900'}`}>
                   <AlertCircle className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-zinc-900 mb-2 font-display">{title}</h3>
                <p className="text-sm text-zinc-500 mb-6">{message}</p>
                
                <div className="flex items-center gap-3 w-full">
                  <button
                    onClick={onClose}
                    className="flex-1 px-4 py-2.5 bg-zinc-100 hover:bg-zinc-200 text-zinc-800 text-sm font-medium rounded-lg transition-colors"
                  >
                    {cancelText}
                  </button>
                  <button
                    onClick={() => {
                        onConfirm();
                        onClose();
                    }}
                    className={`flex-1 px-4 py-2.5 text-white text-sm font-medium rounded-lg transition-colors ${
                      isDanger ? 'bg-red-600 hover:bg-red-700' : 'bg-zinc-900 hover:bg-zinc-800'
                    }`}
                  >
                    {confirmText}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
