interface CardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  className?: string;
}

export function Card({ title, value, subtitle, className = '' }: CardProps) {
  return (
    <div className={`relative overflow-hidden rounded-xl bg-gradient-to-br p-6 shadow-lg backdrop-blur-lg ${className}`}>
      <div className="relative z-10">
        <h3 className="text-sm font-medium text-white/80">{title}</h3>
        <p className="mt-2 text-3xl font-bold tracking-tight text-white">{value}</p>
        {subtitle && (
          <p className="mt-1 text-sm text-white/60">{subtitle}</p>
        )}
      </div>
      <div className="absolute inset-0 bg-gradient-to-br from-white/[0.07] to-transparent" />
    </div>
  );
}