export function TwSizeIndicator() {
  if (process.env.NODE_ENV === "production") {
    return null;
  }

  return (
    <div className="3xl:bg-purple-500/90 fixed right-4 bottom-4 z-[999] flex h-8 w-8 items-center justify-center rounded-full bg-slate-900/90 font-mono text-[10px] font-bold text-white shadow-2xl ring-1 ring-white/20 backdrop-blur-sm transition-all hover:scale-110 sm:bg-red-500/90 md:bg-yellow-500/90 lg:bg-green-500/90 xl:bg-blue-500/90 2xl:bg-pink-500/90">
      <span className="block sm:hidden">ALL</span>
      <span className="hidden sm:block md:hidden">SM</span>
      <span className="hidden md:block lg:hidden">MD</span>
      <span className="hidden lg:block xl:hidden">LG</span>
      <span className="hidden xl:block 2xl:hidden">XL</span>
      <span className="3xl:hidden hidden 2xl:block">2XL</span>
      <span className="3xl:block hidden">3XL</span>
    </div>
  );
}
