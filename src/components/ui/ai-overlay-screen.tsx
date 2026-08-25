export function AiOverlayScreen() {
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[rgb(234_244_240_/_0.38)] px-6 backdrop-blur-2xl"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="flex flex-col items-center gap-5">
        <img
          src="/loader-q.gif"
          alt=""
          width={220}
          height={280}
          className="h-44 w-auto select-none sm:h-56"
        />
        <p className="text-center text-sm font-medium text-ink">
          Аналізую вакансію…
        </p>
        <p className="max-w-xs text-center text-xs leading-5 text-muted">
          Зазвичай 10–20 секунд: спочатку match, потім CL якщо середній % не
          нижчий за поріг.
        </p>
      </div>
    </div>
  );
}
