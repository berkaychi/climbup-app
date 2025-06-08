interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  text?: string;
  className?: string;
}

export function LoadingSpinner({
  size = "md",
  text = "Yükleniyor...",
  className = "",
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12",
  };

  const textSizeClasses = {
    sm: "text-sm",
    md: "text-base",
    lg: "text-lg",
  };

  return (
    <div
      className={`flex flex-col items-center justify-center p-4 ${className}`}
    >
      <div
        className={`${sizeClasses[size]} border-2 border-primary border-t-transparent rounded-full animate-spin`}
      />
      {text && (
        <p
          className={`mt-2 text-gray-600 dark:text-gray-400 ${textSizeClasses[size]}`}
        >
          {text}
        </p>
      )}
    </div>
  );
}

export function LoadingSkeleton({
  lines = 3,
  className = "",
}: {
  lines?: number;
  className?: string;
}) {
  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full"></div>
        </div>
      ))}
    </div>
  );
}

export function PageLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <LoadingSpinner size="lg" text="Sayfa yükleniyor..." />
    </div>
  );
}
