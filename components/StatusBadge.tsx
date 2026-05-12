type StatusBadgeProps = {
  status: string;
};

export default function StatusBadge({
  status,
}: StatusBadgeProps) {
  const isCompleted = status === 'Concluído';

  return (
    <span
      className={`px-2 py-1 rounded text-sm font-medium ${
        isCompleted
          ? 'bg-green-100 text-green-800'
          : 'bg-yellow-100 text-yellow-800'
      }`}
    >
      {status}
    </span>
  );
}