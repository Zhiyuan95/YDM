"use client";

import { useState } from "react";
import { LogOut } from "lucide-react";
import ConfirmModal from "@/components/common/ConfirmModal";

export default function SignOutButton({ signOutAction }: { signOutAction: () => void }) {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <button 
        type="button"
        onClick={() => setShowModal(true)}
        className="flex items-center text-sm font-medium text-zinc-600 hover:text-red-600 transition-colors"
      >
        <LogOut className="w-4 h-4 mr-1.5" />
        退出登录
      </button>

      <ConfirmModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onConfirm={signOutAction}
        title="退出系统"
        message="您确定要退出数字档案馆的管理后台吗？"
        confirmText="确定退出"
        cancelText="取消"
        isDanger={true}
      />
    </>
  );
}
