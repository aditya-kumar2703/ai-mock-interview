export default function TrustSection() {
  return (
    <section className="py-12 border-b border-surface-800/50 bg-surface-950" aria-label="Trusted by">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-sm font-medium text-surface-500 uppercase tracking-widest mb-8">
          Trusted by candidates who landed offers at
        </p>
        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-default duration-500">
          {/* Mock company names instead of images to avoid external dependencies */}
          <div className="text-xl font-bold font-mono text-surface-300">GOOGLE</div>
          <div className="text-xl font-bold font-sans text-surface-300 tracking-tight">META</div>
          <div className="text-xl font-bold italic text-surface-300">Amazon</div>
          <div className="text-xl font-extrabold text-surface-300 tracking-tighter">NETFLIX</div>
          <div className="text-xl font-bold text-surface-300">Apple</div>
        </div>
      </div>
    </section>
  );
}
