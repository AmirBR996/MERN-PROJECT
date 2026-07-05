export const formatPrice = (amount) => {
  return `Rs. ${Number(amount || 0).toLocaleString("en-NP", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

export const CATEGORIES = [
  "All",
  "Vegetables",
  "Fruits",
  "Grains",
  "Dairy",
  "Meat",
  "Other",
];

export const SORT_OPTIONS = [
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
];

export const DELIVERY_FEE = 100;

export const getSellerName = (seller) => {
  if (!seller) return "Local Farmer";
  if (typeof seller === "string") return "Local Farmer";
  return `${seller.first_name || ""} ${seller.last_name || ""}`.trim() || "Local Farmer";
};

export const getSellerId = (seller) => {
  if (!seller) return null;
  return typeof seller === "object" ? seller._id : seller;
};

export const filterAndSortProducts = (products, { search = "", category = "All", sort = "newest" }) => {
  let result = [...products];

  const query = search.trim().toLowerCase();
  if (query) {
    result = result.filter((p) =>
      [p.name, p.description, p.category, getSellerName(p.seller_id)]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(query)
    );
  }

  if (category && category !== "All") {
    result = result.filter((p) => p.category === category);
  }

  switch (sort) {
    case "price-asc":
      result.sort((a, b) => Number(a.price) - Number(b.price));
      break;
    case "price-desc":
      result.sort((a, b) => Number(b.price) - Number(a.price));
      break;
    default:
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }

  return result;
};
