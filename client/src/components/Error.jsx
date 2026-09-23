export default function Error({ message }) {
  return (
      <div className="flex justify-center items-center min-h-screen bg-main-bg p-4">
        <div className="bg-surface border border-border-light p-6 rounded-xl shadow-sm max-w-md w-full text-center">
          <div className="w-12 h-12 bg-red-50 text-error rounded-full flex justify-center items-center mx-auto mb-4 text-xl font-bold">
            !
          </div>
          <h3 className="text-text-main font-semibold text-lg mb-1">
            Request Failed
          </h3>
          <p className="text-error text-sm font-medium">{message}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-main-bg hover:bg-border-light text-text-main text-xs font-semibold rounded-lg transition-colors border border-border-light"
          >
            Try Again
          </button>
        </div>
      </div>
  );
}
