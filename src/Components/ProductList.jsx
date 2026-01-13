import { useEffect, useMemo, useState } from "react";
import ProductCard from "./ProductCard";
import ProductGridVirtualized from "./ProductGridVirtualized";

const FAVORITES_KEY = "ecom_favorites_v1";

const ProductList = () => {
  const [products, setProducts] = useState([]);

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [minRating, setMinRating] = useState("all");
  const [sortOrder, setSortOrder] = useState("none");
  const [favoritesOnly, setFavoritesOnly] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [favorites, setFavorites] = useState(() => {
    try {
      const raw = localStorage.getItem(FAVORITES_KEY);
      const arr = raw ? JSON.parse(raw) : [];
      return new Set(arr);
    } catch {
      return new Set();
    }
  });

  useEffect(() => {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(Array.from(favorites)));
  }, [favorites]);

  useEffect(() => {
    const fetchedProducts = async () => {
      try {
        setIsLoading(true);
        setError("");

        const res = await fetch("https://dummyjson.com/products?limit=100");
        if (!res.ok) throw new Error(`Request failed: ${res.status}`);

        const data = await res.json();
        setProducts(data.products || []);
      } catch (err) {
        setError(err?.message || "Something went wrong");
      } finally {
        setIsLoading(false);
      }
    };

    fetchedProducts();
  }, []);

  const categories = useMemo(() => {
    const set = new Set(products.map((p) => p.category));
    return ["all", ...Array.from(set).sort()];
  }, [products]);

  const toggleFavorite = (id) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const visibleProducts = useMemo(() => {
    let list = [...products];

    if (selectedCategory !== "all") {
      list = list.filter((p) => p.category === selectedCategory);
    }

    if (minRating !== "all") {
      const min = Number(minRating);
      list = list.filter((p) => Number(p.rating) >= min);
    }

    if (favoritesOnly) {
      list = list.filter((p) => favorites.has(p.id));
    }

    if (sortOrder === "asc") {
      list.sort((a, b) => a.price - b.price);
    } else if (sortOrder === "desc") {
      list.sort((a, b) => b.price - a.price);
    }

    return list;
  }, [
    products,
    selectedCategory,
    minRating,
    sortOrder,
    favoritesOnly,
    favorites,
  ]);

  if (isLoading) return <p className="p-6 text-lg">Loading...</p>;
  if (error) return <p className="p-6 text-red-600">Error: {error}</p>;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="sticky top-0 z-10 border-b bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-2xl font-bold">Products</h2>

          <div className="flex flex-wrap items-center gap-2">
            <select
              className="rounded-lg border px-3 py-2 text-sm"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c === "all" ? "All categories" : c}
                </option>
              ))}
            </select>

            <select
              className="rounded-lg border px-3 py-2 text-sm"
              value={minRating}
              onChange={(e) => setMinRating(e.target.value)}
            >
              <option value="all">All ratings</option>
              <option value="4.5">4.5+</option>
              <option value="4">4+</option>
              <option value="3.5">3.5+</option>
              <option value="3">3+</option>
            </select>

            <select
              className="rounded-lg border px-3 py-2 text-sm"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
            >
              <option value="none">Sort: none</option>
              <option value="asc">Price: low → high</option>
              <option value="desc">Price: high → low</option>
            </select>

            <label className="flex items-center gap-2 rounded-lg border bg-white px-3 py-2 text-sm">
              <input
                type="checkbox"
                checked={favoritesOnly}
                onChange={(e) => setFavoritesOnly(e.target.checked)}
              />
              Favorites only
            </label>

            <div className="rounded-lg bg-gray-100 px-3 py-2 text-sm">
              Favorites: <span className="font-semibold">{favorites.size}</span>
            </div>

            <button
              className="rounded-lg border px-3 py-2 text-sm hover:bg-gray-50"
              onClick={() => {
                setSelectedCategory("all");
                setMinRating("all");
                setSortOrder("none");
                setFavoritesOnly(false);
              }}
            >
              Reset filters
            </button>

            <button
              className="rounded-lg border px-3 py-2 text-sm hover:bg-gray-50"
              onClick={() => setFavorites(new Set())}
            >
              Clear favorites
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl p-4">
        <p className="mb-3 text-sm text-gray-600">
          Showing{" "}
          <span className="font-semibold">{visibleProducts.length}</span>{" "}
          products
        </p>

        {visibleProducts.length === 0 ? (
          <div className="rounded-xl border bg-white p-6 text-center text-gray-600">
            No products match your filters.
          </div>
        ) : (
          <ProductGridVirtualized
            items={visibleProducts}
            renderItem={(p) => (
              <div className="w-[240px]">
                <ProductCard
                  product={p}
                  isFavorited={favorites.has(p.id)}
                  onToggleFavorite={toggleFavorite}
                />
              </div>
            )}
          />
        )}
      </div>
    </div>
  );
};

export default ProductList;
