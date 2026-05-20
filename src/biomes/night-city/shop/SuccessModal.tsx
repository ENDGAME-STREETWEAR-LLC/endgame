"use client";

import Modal from "@/components/Modal";
import { useLocalization } from "@/hooks/useLocalization";

type SuccessModalProps = {
  open: boolean;
  email: string;
  onClose: () => void;
};

export default function SuccessModal({ open, email, onClose }: SuccessModalProps) {
  const { localization: t } = useLocalization();

  return (
    <Modal open={open}>
      <div className="mt-2 flex flex-col gap-3 text-center items-center w-full p-4">
        <p>{t.shop.success}</p>
        <p className="my-4 font-bold">{email}</p>
        <button
          onClick={onClose}
          className="cursor-pointer rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] dark:hover:bg-[#ccc] font-medium text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:w-auto"
        >
          {t.close}
        </button>
      </div>
    </Modal>
  );
}
