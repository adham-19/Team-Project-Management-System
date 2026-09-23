export default function Loading({ message }) {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-main-bg text-text-secondary">
      <div className="w-10 h-10 border-4 border-border-light border-t-primary rounded-full animate-spin mb-4"></div>
      <div className="flex items-center gap-1 text-sm font-medium tracking-wide animate-pulse">
        <span>{message}</span>
        <span className="flex gap-0.5">
          <span>.</span>
          <span>.</span>
          <span>.</span>
        </span>
      </div>
    </div>
  );
}
