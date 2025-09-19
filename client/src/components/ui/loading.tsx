const Loading = () => {
  return (
    <div className="flex flex-col items-center justify-center  w-full h-screen p-4">
      {/* Spinner */}
      <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-purple-600 mb-4"></div>
      {/* Text */}
      <p className="text-gray-700 text-lg font-medium">Loading...</p>
    </div>
  );
};

export { Loading };
