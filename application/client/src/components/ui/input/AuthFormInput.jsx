const AuthFormInput = ({ type, placeholder, password, onChange, disabled }) => {
  return (
    <input
      type={type}
      placeholder={placeholder}
      value={password}
      className={`w-full tracking-wide bg-gray-100 py-3 px-4 text-sm rounded-lg outline-none border-[1px] border-gray-200`}
      onChange={onChange}
      disabled={disabled}
    />
  );
};

export default AuthFormInput;
