import { useUser } from "../contexts/UserProvider";
import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getApiBaseUrl } from "../lib/apiBase";
export default function Profile () {
 const { logout } = useUser();
 const navigate = useNavigate();
 const [isLoading, setIsLoading] = useState(true);
 const [isSaving, setIsSaving] = useState(false);
 const [data, setData] = useState({
 id: "",
 firstname: "",
 lastname: "",
 email: "",
 profileImagePath: "",
 });
 const [selectedImage, setSelectedImage] = useState(null);
 const API_URL = getApiBaseUrl();

 const imagePreviewUrl = useMemo(() => {
 if (!selectedImage) return "";
 return URL.createObjectURL(selectedImage);
 }, [selectedImage]);

 const currentImageUrl = imagePreviewUrl || (data.profileImagePath ? `${API_URL}${data.profileImagePath}` : "");

 async function fetchProfile () {
 try {
 const result = await fetch(`${API_URL}/api/user/profile`, {
 credentials: "include"
 });
 if (result.status === 401) {
 logout();
 return;
 }
 const profile = await result.json();
 if (!result.ok) {
 alert(profile?.message ?? "Failed to load profile");
 return;
 }
 setData({
 id: profile.id ?? profile._id ?? "",
 firstname: profile.firstname ?? "",
 lastname: profile.lastname ?? "",
 email: profile.email ?? "",
 profileImagePath: profile.profileImagePath ?? "",
 });
 }
 finally {
 setIsLoading(false);
 }
 }

 async function onSaveProfile(event) {
 event.preventDefault();
 setIsSaving(true);
 try {
 const formData = new FormData();
 formData.append("firstname", data.firstname.trim());
 formData.append("lastname", data.lastname.trim());
 formData.append("email", data.email.trim());
 if (selectedImage) {
 formData.append("profileImage", selectedImage);
 }

 const result = await fetch(`${API_URL}/api/user/profile`, {
 method: "PUT",
 credentials: "include",
 body: formData,
 });

 const updated = await result.json();
 if (result.status === 401) {
 logout();
 return;
 }
 if (!result.ok) {
 alert(updated?.message ?? "Failed to save profile");
 return;
 }

 setData({
 id: updated.id ?? updated._id ?? "",
 firstname: updated.firstname ?? "",
 lastname: updated.lastname ?? "",
 email: updated.email ?? "",
 profileImagePath: updated.profileImagePath ?? "",
 });
 setSelectedImage(null);
 alert("Profile updated successfully");
 }
 catch (error) {
 console.log("Save profile error:", error);
 alert("Failed to save profile");
 }
 finally {
 setIsSaving(false);
 }
 }

 function onImageFileChange(event) {
 const file = event.target.files?.[0];
 if (!file) {
 setSelectedImage(null);
 return;
 }

 async function onLogoutClick() {
 try {
 await logout();
 } finally {
 navigate("/login", { replace: true });
 }
 }
 if (!file.type.startsWith("image/")) {
 alert("Only image files are allowed");
 event.target.value = "";
 setSelectedImage(null);
 return;
 }
 setSelectedImage(file);
 }

 useEffect(()=>{
 fetchProfile();
 },[]);

 useEffect(() => {
 return () => {
 if (imagePreviewUrl) {
 URL.revokeObjectURL(imagePreviewUrl);
 }
 };
 }, [imagePreviewUrl]);

 return (
 <main className="profile-page">
 <section className="profile-card">
 <header className="profile-header">
 <div className="profile-header-row">
 <div>
 <p className="profile-eyebrow">Account</p>
 <h1>Profile Management</h1>
 <p className="profile-subtitle">Update your personal details and profile image.</p>
 </div>
 <button className="ghost-button" type="button" onClick={onLogoutClick}>
 Log out
 </button>
 </div>
 </header>

 {isLoading ? (
 <div className="profile-loading">Loading profile...</div>
 ) : (
 <form className="profile-form" onSubmit={onSaveProfile}>
 <label className="form-field">
 <span>ID</span>
 <input type="text" value={data.id} readOnly />
 </label>

 <div className="form-grid">
 <label className="form-field">
 <span>First name</span>
 <input
 type="text"
 value={data.firstname}
 onChange={(e) => setData((prev) => ({ ...prev, firstname: e.target.value }))}
 required
 />
 </label>

 <label className="form-field">
 <span>Last name</span>
 <input
 type="text"
 value={data.lastname}
 onChange={(e) => setData((prev) => ({ ...prev, lastname: e.target.value }))}
 required
 />
 </label>
 </div>

 <label className="form-field">
 <span>Email</span>
 <input
 type="email"
 value={data.email}
 onChange={(e) => setData((prev) => ({ ...prev, email: e.target.value }))}
 required
 />
 </label>

 <label className="form-field">
 <span>Profile Image</span>
 <input type="file" accept="image/*" onChange={onImageFileChange} />
 </label>

 <div className="profile-preview">
 <p>Preview</p>
 {currentImageUrl ? (
 <img src={currentImageUrl} alt="Profile preview" />
 ) : (
 <div className="profile-avatar-placeholder">No Image</div>
 )}
 </div>

 <div className="profile-actions">
 <button className="save-button" type="submit" disabled={isSaving}>
 {isSaving ? "Saving..." : "Save Profile"}
 </button>
 <button className="ghost-button" type="button" onClick={onLogoutClick}>
 Logout
 </button>
 <Link className="text-link-button" to="/logout">Logout Route</Link>
 </div>
 </form>
 )}
 </section>
 </main>
 )
}
