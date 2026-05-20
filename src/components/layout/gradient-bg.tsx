export function GradientBg() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* Sci-fi glow layers */}
      <div className="absolute -left-32 top-0 h-[500px] w-[500px] rounded-full bg-orange-600/12 blur-[120px]" />
      <div className="absolute right-0 top-1/3 h-[400px] w-[400px] rounded-full bg-red-600/8 blur-[100px]" />
      <div className="absolute bottom-0 left-1/3 h-[350px] w-[350px] rounded-full bg-amber-500/6 blur-[90px]" />
      
      {/* Radial overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(251,146,60,0.05),transparent_65%)]" />
      
      {/* Cybernetic workspace grid */}
      <div className="cyber-grid absolute inset-0 opacity-40" />
      
      {/* Subtle top diagnostic line */}
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-orange-500/20 to-transparent" />
    </div>
  );
}
