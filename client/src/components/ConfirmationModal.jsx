// REACT IMPORTS
import { Trash2 } from "lucide-react";

export default function ConfirmationModal({
  title,
  description,
  setIsModalOpen,
  handleConfirm,
  isSubmitting,
  confirmLabel = "Delete",
  modalError,
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div
        className="absolute inset-0"
        onClick={() => setIsModalOpen(false)}
      ></div>

      <div className="bg-surface border border-border-light w-full max-w-md rounded-2xl p-6 shadow-xl relative z-10">
        <div className="w-11 h-11 rounded-full bg-red-50 flex items-center justify-center mb-4">
          <Trash2 className="w-5 h-5 text-error" />
        </div>

        <h3 className="text-xl text-text-main font-bold mb-2">{title}</h3>

        <p className="text-sm text-text-secondary leading-relaxed">
          {description}
        </p>

        {modalError && <p className="mt-3 text-xs text-error">{modalError}</p>}

        <div className="flex items-center justify-end gap-3 pt-5 mt-5 border-t border-border-light">
          <button
            type="button"
            onClick={() => setIsModalOpen(false)}
            disabled={isSubmitting}
            className="px-4 py-2 rounded-xl text-sm font-semibold text-text-secondary hover:bg-main-bg transition-colors disabled:opacity-50 cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleConfirm}
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-error text-white text-sm font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 cursor-pointer"
          >
            {isSubmitting ? "Deleting..." : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
