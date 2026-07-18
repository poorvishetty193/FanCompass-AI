export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-[100dvh] p-4">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" aria-label="Loading..."></div>
    </div>
  );
}
