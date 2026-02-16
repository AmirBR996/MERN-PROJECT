import React from "react";

const Card = ({ product, onDelete, onEdit }) => {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <img
        src={product.image_url}
        alt={product.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h2 className="text-lg font-semibold text-gray-800">{product.name}</h2>
        <p className="text-gray-600 mt-1">{product.description}</p>
        <div className="flex justify-between items-center mt-3">
          <span className="text-green-600 font-bold">${product.price}</span>
          <span
            className={`text-sm font-medium ${
              product.stock > 0 ? "text-blue-500" : "text-red-500"
            }`}
          >
            {product.stock > 0 ? `In Stock: ${product.stock}` : "Out of Stock"}
          </span>
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={() => onEdit(product)}
            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(product._id)}
            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default Card;
