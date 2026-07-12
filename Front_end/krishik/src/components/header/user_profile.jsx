import React, { useContext, useState } from "react";
import { AuthContext } from "../footer./authcontext";
import { useNavigate } from "react-router-dom";
import { X, LogOut, Pencil, MapPin, Mail } from "lucide-react";

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
      <div className="flex h-screen items-center justify-center bg-stone-50 text-stone-500">
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
      className="fixed inset-0 z-50 flex justify-end bg-stone-900/40 backdrop-blur-sm"
      onClick={handleClose}
    >
      {/* Profile Sidebar */}
      <div
        className="h-full w-full max-w-md overflow-y-auto bg-stone-50 p-8 shadow-sm"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <h2 className="font-serif text-2xl font-bold text-stone-900">My Profile</h2>

          <button
            onClick={handleClose}
            aria-label="Close profile"
            className="rounded-md p-2 text-stone-500 transition hover:bg-stone-100 hover:text-stone-900"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Avatar */}
        <div className="mb-8 flex flex-col items-center rounded-xl border border-stone-200 bg-white/70 py-8">
          <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-emerald-800 text-2xl font-bold text-white shadow-sm">
            {user.first_name?.[0]}
            {user.last_name?.[0]}
          </div>

          <h2 className="mt-4 font-serif text-xl font-bold text-stone-900">
            {user.first_name} {user.last_name}
          </h2>

          <span className="mt-2 rounded-md bg-emerald-50 px-4 py-1 text-xs font-semibold capitalize text-emerald-800">
            {user.user_type}
          </span>
        </div>

        {!editMode ? (
          <div className="space-y-6">
            <div className="space-y-4 rounded-xl border border-stone-200 bg-white/70 p-5">
              <Info icon={Mail} label="Email" value={user.email} />
              <Info icon={MapPin} label="Location" value={user.location} />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setEditMode(true)}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-md bg-stone-900 py-3 text-sm font-semibold text-amber-50 shadow-sm transition hover:-translate-y-0.5 hover:bg-emerald-800"
              >
                <Pencil className="h-4 w-4" />
                Edit
              </button>

              <button
                onClick={handleLogout}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-md bg-red-600 py-3 text-sm font-semibold text-white transition hover:bg-red-700"
              >
                <LogOut className="h-4 w-4" />
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

            <div className="flex gap-3 pt-2">
              <button
                onClick={handleUpdate}
                disabled={loading}
                className="flex-1 rounded-md bg-stone-900 py-3 text-sm font-semibold text-amber-50 shadow-sm transition hover:-translate-y-0.5 hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
              >
                {loading ? "Saving..." : "Save"}
              </button>

              <button
                onClick={() => setEditMode(false)}
                className="flex-1 rounded-md border border-stone-200 bg-white py-3 text-sm font-semibold text-stone-900 transition hover:border-stone-300"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const Info = ({ icon: Icon, label, value }) => (
  <div className="flex items-start gap-3">
    <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-stone-100/50 text-stone-500">
      <Icon className="h-4 w-4" />
    </div>
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-stone-500">{label}</p>
      <p className="text-base font-medium text-stone-900">{value || "—"}</p>
    </div>
  </div>
);

const Input = ({ label, name, value, onChange }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-sm font-semibold text-stone-900">{label}</label>
    <input
      type="text"
      name={name}
      value={value}
      onChange={onChange}
      className="w-full rounded-md border border-stone-200 bg-white px-4 py-3 text-sm text-stone-900 outline-none transition focus:border-emerald-600 focus:ring-2 focus:ring-emerald-200"
    />
  </div>
);

export default User_profile;
