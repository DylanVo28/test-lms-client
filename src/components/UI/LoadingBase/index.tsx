const LoadingBase = ({ loading }: { loading: boolean }) => {
  return (
    <>
      {loading && (
        <div className="flex items-center justify-center min-h-screen bg-primary">
          <div className="flex space-x-6">
            <div className="w-5 h-5 bg-blue-500 rounded-full animate-ping"></div>
            <div className="w-5 h-5 bg-blue-500 rounded-full animate-ping200"></div>
            <div className="w-5 h-5 bg-blue-500 rounded-full animate-ping400"></div>
          </div>
        </div>
      )}
    </>
  );
};

export default LoadingBase;
