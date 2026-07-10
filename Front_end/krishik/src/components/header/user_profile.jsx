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
      <div className="flex h-screen items-center justify-center bg-parchment text-mist">
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
      className="fixed inset-0 z-50 flex justify-end bg-bark/40 backdrop-blur-sm"
      onClick={handleClose}
    >
      {/* Profile Sidebar */}
      <div
        className="h-full w-full max-w-md overflow-y-auto bg-parchment p-8 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <h2 className="font-display text-2xl font-bold text-bark">My Profile</h2>

          <button
            onClick={handleClose}
            aria-label="Close profile"
            className="rounded-xl p-2 text-mist transition hover:bg-soil-100 hover:text-bark"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Avatar */}
        <div className="mb-8 flex flex-col items-center rounded-2xl border border-soil-200 bg-white/70 py-8">
          <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-leaf-600 text-2xl font-bold text-white shadow-md shadow-leaf-600/20">
            {user.first_name?.[0]}
            {user.last_name?.[0]}
          </div>

          <h2 className="mt-4 font-display text-xl font-bold text-bark">
            {user.first_name} {user.last_name}
          </h2>

          <span className="mt-2 rounded-full bg-leaf-100 px-4 py-1 text-xs font-semibold capitalize text-leaf-700">
            {user.user_type}
          </span>
        </div>

        {!editMode ? (
          <div className="space-y-6">
            <div className="space-y-4 rounded-2xl border border-soil-200 bg-white/70 p-5">
              <Info icon={Mail} label="Email" value={user.email} />
              <Info icon={MapPin} label="Location" value={user.location} />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setEditMode(true)}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-leaf-600 py-3 text-sm font-semibold text-white shadow-md shadow-leaf-600/20 transition hover:-translate-y-0.5 hover:bg-leaf-700"
              >
                <Pencil className="h-4 w-4" />
                Edit
              </button>

              <button
                onClick={handleLogout}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-600 py-3 text-sm font-semibold text-white transition hover:bg-red-700"
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
                className="flex-1 rounded-xl bg-leaf-600 py-3 text-sm font-semibold text-white shadow-md shadow-leaf-600/20 transition hover:-translate-y-0.5 hover:bg-leaf-700 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0"
              >
                {loading ? "Saving..." : "Save"}
              </button>

              <button
                onClick={() => setEditMode(false)}
                className="flex-1 rounded-xl border border-soil-200 bg-white py-3 text-sm font-semibold text-bark transition hover:border-soil-300"
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
    <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-soil-100 text-mist">
      <Icon className="h-4 w-4" />
    </div>
    <div>
      <p className="text-xs font-medium uppercase tracking-wide text-mist">{label}</p>
      <p className="text-base font-medium text-bark">{value || "—"}</p>
    </div>
  </div>
);

const Input = ({ label, name, value, onChange }) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-sm font-semibold text-bark">{label}</label>
    <input
      type="text"
      name={name}
      value={value}
      onChange={onChange}
      className="w-full rounded-xl border border-soil-200 bg-white px-4 py-3 text-sm text-bark outline-none transition focus:border-leaf-500 focus:ring-2 focus:ring-leaf-200"
    />
  </div>
);

export default User_profile;
