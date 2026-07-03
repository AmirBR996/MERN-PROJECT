import React, { useContext, useState } from "react";
import { AuthContext } from "../footer./authcontext";
import { useNavigate } from "react-router-dom";

const User_profile = () => {
  const { user, updateUser, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    first_name: user?.first_name || "",
    last_name: user?.last_name || "",
    email: user?.email || "",
    location: user?.location || "",
  });

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleClose = () => {
    navigate(-1);
  };

  if (!user) {
    return (
      <div className="h-screen flex items-center justify-center text-gray-600">
        Please login first.
      </div>
    );
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdate = async () => {
    try {
      setLoading(true);
      await updateUser(formData);
      setEditMode(false);
    } catch (err) {
      alert("Update failed");
    } finally {
      setLoading(false);
    }
  };

return (
  <div
    className="fixed inset-0 z-50 flex justify-end bg-black/30"
    onClick={handleClose}
  >
    {/* Profile Sidebar */}
    <div
      className="w-full max-w-md h-full overflow-y-auto bg-white shadow-2xl p-8"
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-green-700">My Profile</h2>

        <button
          onClick={handleClose}
          className="text-2xl text-gray-500 hover:text-black"
        >
          ✕
        </button>
      </div>

      {/* Avatar */}
      <div className="flex flex-col items-center mb-8">
        <div className="w-24 h-24 rounded-full bg-green-600 text-white flex items-center justify-center text-3xl font-bold">
          {user.first_name?.[0]}
          {user.last_name?.[0]}
        </div>

        <h2 className="text-2xl font-bold mt-4">
          {user.first_name} {user.last_name}
        </h2>

        <span className="mt-2 px-4 py-1 rounded-full bg-green-100 text-green-700">
          {user.user_type}
        </span>
      </div>

      {!editMode ? (
        <div className="space-y-6">
          <Info label="Email" value={user.email} />
          <Info label="Location" value={user.location} />

          <div className="flex gap-4 pt-4">
            <button
              onClick={() => setEditMode(true)}
              className="flex-1 py-3 rounded-lg bg-green-600 text-white hover:bg-green-700"
            >
              Edit
            </button>

            <button
              onClick={handleLogout}
              className="flex-1 py-3 rounded-lg bg-red-500 text-white hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <Input
            label="First Name"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
          />

          <Input
            label="Last Name"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
          />

          <Input
            label="Email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />

          <Input
            label="Location"
            name="location"
            value={formData.location}
            onChange={handleChange}
          />

          <div className="flex gap-4 pt-4">
            <button
              onClick={handleUpdate}
              disabled={loading}
              className="flex-1 py-3 rounded-lg bg-green-600 text-white hover:bg-green-700"
            >
              {loading ? "Saving..." : "Save"}
            </button>

            <button
              onClick={() => setEditMode(false)}
              className="flex-1 py-3 rounded-lg bg-gray-400 text-white hover:bg-gray-500"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  </div>
);
}

const Info = ({ label, value }) => (
  <div>
    <p className="text-sm text-gray-500">{label}</p>
    <p className="text-lg font-medium text-gray-800">{value}</p>
  </div>
);

const Input = ({ label, name, value, onChange }) => (
  <div>
    <label className="text-sm text-gray-500">{label}</label>
    <input
      type="text"
      name={name}
      value={value}
      onChange={onChange}
      className="w-full mt-1 px-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-400 outline-none transition"
    />
  </div>
);

export default User_profile;
