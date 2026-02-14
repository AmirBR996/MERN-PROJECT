import React, { useContext, useState } from "react";
import { AuthContext } from "../footer./authcontext";
import { useNavigate } from "react-router-dom";

const User_profile = () => {
  const { user, updateUser, deleteUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [formData, setFormData] = useState({
    first_name: user?.first_name || "",
    last_name: user?.last_name || "",
    email: user?.email || "",
    location: user?.location || "",
  });

  if (!user) {
    return (
      <div className="h-screen flex items-center justify-center text-gray-600">
        Please login first.
      </div>
    );
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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

  const handleDeleteConfirmed = async () => {
    try {
      setLoading(true);
      await deleteUser();
      navigate("/");
    } catch (err) {
      alert("Delete failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-white to-green-50 flex items-center justify-center p-6">
      <div className="w-full max-w-xl backdrop-blur-lg bg-white/80 shadow-2xl rounded-3xl p-10 border border-white/40 relative">

        {/* Avatar Section */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-24 h-24 rounded-full bg-green-600 text-white flex items-center justify-center text-3xl font-bold shadow-lg">
            {user.first_name[0]}
            {user.last_name[0]}
          </div>

          <h2 className="text-2xl font-bold mt-4">
            {user.first_name} {user.last_name}
          </h2>

          <span className="text-sm px-4 py-1 mt-2 rounded-full bg-green-100 text-green-700 capitalize">
            {user.user_type}
          </span>
        </div>

        {/* VIEW MODE */}
        {!editMode ? (
          <div className="space-y-5">
            <Info label="Email" value={user.email} />
            <Info label="Location" value={user.location} />

            <div className="flex gap-4 pt-6">
              <button
                type="button"
                onClick={() => setEditMode(true)}
                className="flex-1 py-3 rounded-xl bg-green-600 text-white hover:bg-green-700 transition-all duration-300"
              >
                Edit Profile
              </button>

              <button
                type="button"
                onClick={() => setShowConfirm(true)}
                className="flex-1 py-3 rounded-xl bg-red-500 text-white hover:bg-red-600 transition-all duration-300"
              >
                Delete Account
              </button>
            </div>
          </div>
        ) : (
          /* EDIT MODE */
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

            <div className="flex gap-4 pt-6">
              <button
                type="button"
                onClick={handleUpdate}
                disabled={loading}
                className="flex-1 py-3 rounded-xl bg-green-600 text-white hover:bg-green-700 transition"
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>

              <button
                type="button"
                onClick={() => setEditMode(false)}
                className="flex-1 py-3 rounded-xl bg-gray-400 text-white hover:bg-gray-500 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {/* 🔥 Modern Delete Confirmation Modal */}
        {showConfirm && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white p-8 rounded-2xl shadow-2xl w-96 text-center animate-fadeIn">
              <h3 className="text-xl font-bold mb-4 text-gray-800">
                Delete Account?
              </h3>
              <p className="text-gray-600 mb-6">
                This action is permanent and cannot be undone.
              </p>

              <div className="flex justify-center gap-4">
                <button
                  type="button"
                  onClick={() => setShowConfirm(false)}
                  className="px-5 py-2 rounded-lg bg-gray-300 hover:bg-gray-400"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleDeleteConfirmed}
                  disabled={loading}
                  className="px-5 py-2 rounded-lg bg-red-500 text-white hover:bg-red-600"
                >
                  {loading ? "Deleting..." : "Confirm Delete"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

/* Reusable Components */

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
