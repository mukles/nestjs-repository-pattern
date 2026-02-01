export function TwSizeIndicator() {
  if (process.env.NODE_ENV === "production") {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-[999] flex h-8 w-8 items-center justify-center rounded-full bg-slate-900/90 font-mono text-[10px] font-bold text-white shadow-2xl backdrop-blur-sm ring-1 ring-white/20 transition-all hover:scale-110 sm:bg-red-500/90 md:bg-yellow-500/90 lg:bg-green-500/90 xl:bg-blue-500/90 2xl:bg-pink-500/90 3xl:bg-purple-500/90">
      <span className="block sm:hidden">ALL</span>
      <span className="hidden sm:block md:hidden">SM</span>
      <span className="hidden md:block lg:hidden">MD</span>
      <span className="hidden lg:block xl:hidden">LG</span>
      <span className="hidden xl:block 2xl:hidden">XL</span>
      <span className="hidden 2xl:block 3xl:hidden">2XL</span>
      <span className="hidden 3xl:block">3XL</span>
    </div>
  );
}