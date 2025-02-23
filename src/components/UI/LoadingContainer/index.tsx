const LoadingContainer = ({ loading }: { loading: boolean }) => {
  return (
    <>
      {loading && (
        <div
          style={{
            position: 'absolute',
            top: '0',
            left: '0',
            right: '0',
            bottom: '0',
            backgroundColor: 'var(--theme-black-60)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 10,
          }}
        >
          <div className="w-16 h-16 border-8 border-dashed rounded-full animate-spin border-main"></div>
        </div>
      )}
    </>
  );
};

export default LoadingContainer;
