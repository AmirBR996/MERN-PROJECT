const ProductSkeleton = () => (
  <div className="animate-pulse overflow-hidden rounded-xl border border-stone-200 bg-white">
    <div className="h-52 bg-stone-100/50" />
    <div className="space-y-3 p-5">
      <div className="h-5 w-3/4 rounded bg-stone-100/50" />
      <div className="h-4 w-full rounded bg-stone-100/50" />
      <div className="h-4 w-2/3 rounded bg-stone-100/50" />
      <div className="h-10 rounded-md bg-stone-100/50" />
    </div>
  </div>
);

export const ProductGridSkeleton = ({ count = 6 }) => (
  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
    {Array.from({ length: count }).map((_, i) => (
      <ProductSkeleton key={i} />
    ))}
  </div>
);

export default ProductSkeleton;
