export default function Forbidden() {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <h1 className="text-4xl font-bold text-red-600">403</h1>
      <p className="text-lg">You do not have permission to access this page.</p>
    </div>
  );
}
