interface BadgeProps {
  text: string;
  color?: 'pink' | 'blue' | 'green' | 'dafault';
}

export const Badge: React.FC<BadgeProps> = ({ text, color = 'pink' }) => {
  const colorClasses: Record<string, string> = {
    pink: 'bg-[#D9ABB6]/10 text-[#D9ABB6] border border-[#D9ABB6]/20',
    blue: 'bg-blue-500/10 text-blue-500 border border-blue-500/20',
    green: 'bg-green-500/10 text-green-500 border border-green-500/20',
    default: "bg-gray-500"
  };

  return (
    <span
      className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${colorClasses[color]}`}
    >
      {text}
    </span>
  );
};
