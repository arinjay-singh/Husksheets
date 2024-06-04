/**
 * @file loading.tsx
 * @brief The loading component of the application.
 * @version 1.0
 * @date 06-02-2024
 * @author Arinjay Singh
 */

// loading component
export const Loading = () => {
  // render the loading component
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <div className="loader"></div>
        <p className="text-gray-700 mt-4">Loading...</p>
      </div>
    </div>
  );
};