const ProductCard = ({ product, isFavorited, onToggleFavorite }) => {
  return (
    <div
      className={[
        "rounded-xl border bg-white p-3 shadow-sm transition hover:shadow-md",
        isFavorited ? "ring-2 ring-pink-500" : "",
      ].join(" ")}
    >
      <div className="relative">
        <img
          src={product.thumbnail}
          alt={product.title}
          loading="lazy"
          decoding="async"
          className="h-36 w-full rounded-lg object-cover"
        />

        <button
          onClick={() => onToggleFavorite(product.id)}
          className={[
            "absolute right-2 top-2 rounded-full px-3 py-1 text-sm shadow",
            isFavorited ? "bg-pink-600 text-white" : "bg-white text-gray-700",
          ].join(" ")}
          aria-label="Toggle favorite"
        >
          {isFavorited ? "♥" : "♡"}
        </button>
      </div>

      <div className="mt-3 space-y-1">
        <h3 className="truncate font-semibold">{product.title}</h3>
        <div className="flex items-center justify-between">
          <p className="text-lg font-bold">₹ {product.price}</p>
          <p className="text-sm text-gray-600">⭐ {product.rating}</p>
        </div>

        <p className="text-sm text-gray-500">{product.category}</p>
      </div>
    </div>
  );
};

export default ProductCard;
