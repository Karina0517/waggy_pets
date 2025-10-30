interface ButtonProps {
  variant?: "primary" | "primary_1" | "secondary" | "danger" | "info";
  text: string;
  click?: () => void;
  type?: "button" | "submit";
  loading?: boolean;
  disabled?: boolean;
}

export const MiButton = ({
  variant = "primary",
  text,
  click,
  type = "button",
  loading = false,
  disabled = false,
}: ButtonProps) => {
  const base =
    "mt-4 px-4 py-2 rounded font-semibold transition m-2 focus:outline-none focus:ring-2 flex items-center justify-center";

  const variants = {
    primary:
      "text-sky-500 hover:bg-sky-400 hover:text-white focus:ring-sky-400",
    primary_1:
      "bg-sky-400 text-white hover:bg-sky-600 focus:ring-sky-400",
    secondary:
      "bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200 focus:ring-gray-300",
    danger:
      "text-rose-400 hover:bg-rose-400 hover:text-white focus:ring-rose-300",
    info:
      "bg-indigo-400 text-white hover:bg-indigo-500 focus:ring-indigo-300",
  };

  return (
    <button
      type={type}
      onClick={click}
      disabled={disabled || loading}
      className={`${base} ${variants[variant]} ${
        disabled || loading ? "opacity-60 cursor-not-allowed" : ""
      }`}
    >
      {loading ? "Cargando..." : text}
    </button>
  );
};
