export default function Modal({
  title,
  description,
  fields,
  setIsModalOpen,
  handleSubmit,
  isSubmitting,
  handleInputChange,
  formData,
  submitLabel = "Save Changes",
  modalError,
}) {
  const renderField = (field) => {
    switch (field.type) {
      case "text":
        return (
          <input
            type="text"
            name={field.name}
            required={field.required}
            value={formData[field.name] ?? ""}
            onChange={handleInputChange}
            placeholder={field.placeholder}
            className="w-full rounded-xl border border-border-light bg-main-bg text-text-main placeholder:text-text-secondary px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
          />
        );

      case "textarea":
        return (
          <textarea
            name={field.name}
            required={field.required}
            rows={field.rows ?? 4}
            value={formData[field.name] ?? ""}
            onChange={handleInputChange}
            placeholder={field.placeholder}
            className="w-full rounded-xl border border-border-light bg-main-bg text-text-main placeholder:text-text-secondary px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all resize-none"
          />
        );

      case "select":
        return (
          <select
            name={field.name}
            required={field.required}
            value={formData[field.name] ?? ""}
            onChange={handleInputChange}
            className="w-full rounded-xl border border-border-light bg-main-bg text-text-main px-4 py-2.5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all cursor-pointer"
          >
            {!field.required && <option value="">Select {field.label}</option>}

            {field.options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-fade-in">
      <div
        className="absolute inset-0"
        onClick={() => setIsModalOpen(false)}
      ></div>

      <div className="bg-surface border border-border-light w-full max-w-md rounded-2xl p-6 shadow-xl relative z-10 scale-95 animate-in zoom-in-95 duration-200">
        <h3 className="text-xl text-text-main font-bold mb-1">{title}</h3>

        {description && (
          <p className="text-text-secondary text-xs mb-3">{description}</p>
        )}

        {modalError && <p className="mt-2 text-xs text-error">{modalError}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          {fields.map((field) => (
            <div key={field.name}>
              <label className="block text-xs font-semibold text-text-main mb-1.5">
                {field.label}{" "}
                {field.required && <span className="text-primary">*</span>}
              </label>

              {renderField(field)}
            </div>
          ))}

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border-light mt-6">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 rounded-xl text-sm font-semibold text-text-secondary hover:bg-main-bg transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-primary hover:bg-primary-dark text-white px-5 py-2 rounded-xl text-sm font-semibold shadow-sm transition-colors cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? "Saving..." : submitLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
