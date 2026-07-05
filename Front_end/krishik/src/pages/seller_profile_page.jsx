import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getUserById } from "../api/user.api";
import { getAllProducts } from "../api/product.api";
import ProductCard from "../components/cards/product_card";
import { ProductGridSkeleton } from "../components/ui/ProductSkeleton";
import { getSellerName } from "../utils/helpers";
import { MapPin, Leaf, Loader2 } from "lucide-react";

const SellerProfilePage = () => {
  const { id } = useParams();
  const [seller, setSeller] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [userData, allProducts] = await Promise.all([
          getUserById(id),
          getAllProducts(),
        ]);
        setSeller(userData);
        setProducts(
          (Array.isArray(allProducts) ? allProducts : []).filter(
            (p) => String(p.seller_id?._id || p.seller_id) === String(id)
          )
        );
      } catch {
        setSeller(null);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const sellerName = seller ? getSellerName(seller) : "";

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-leaf-600" />
      </div>
    );
  }

  if (!seller) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <p className="text-mist">Farmer not found.</p>
        <Link to="/products" className="mt-4 inline-block text-leaf-600 hover:underline">
          Back to marketplace
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="rounded-2xl border border-soil-200 bg-white p-8">
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-start">
          <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-leaf-100 text-leaf-600">
            <Leaf className="h-12 w-12" />
          </div>
          <div className="text-center sm:text-left">
            <h1 className="font-display text-3xl font-bold text-bark">{sellerName}</h1>
            <p className="mt-1 inline-flex items-center gap-1 text-mist">
              <MapPin className="h-4 w-4" />
              {seller.location}
            </p>
            <p className="mt-3 max-w-xl text-sm text-mist">
              Local farmer on Krishik Bazar, offering fresh {products.length > 0 ? products.map(p => p.category.toLowerCase()).filter((v,i,a) => a.indexOf(v)===i).slice(0,3).join(", ") : "produce"} from the farm gate.
            </p>
            <span className="mt-4 inline-block rounded-full bg-leaf-100 px-3 py-1 text-xs font-semibold text-leaf-700">
              Verified Farmer
            </span>
          </div>
        </div>
      </div>

      <div className="mt-10">
        <h2 className="font-display text-2xl font-bold text-bark">
          Products from {seller.first_name}
        </h2>
        <p className="mt-1 text-mist">{products.length} listing{products.length !== 1 ? "s" : ""}</p>

        <div className="mt-6">
          {products.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-soil-200 bg-soil-50 py-16 text-center text-mist">
              No products listed yet.
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SellerProfilePage;
