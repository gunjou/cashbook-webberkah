const ButtonLoading = ({ text = "Memproses..." }) => {
  return (
    <>
      <div className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-secondary border-t-transparent" />
      {text}
    </>
  );
};

export default ButtonLoading;
