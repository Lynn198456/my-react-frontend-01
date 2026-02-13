import { useUser } from "../contexts/UserProvider";
import { useEffect, useMemo, useState } from "react";
export default function Profile () {
 const { logout } = useUser();
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
 const API_URL = import.meta.env.VITE_API_URL;

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
 <div>
 <h3>Profile Management</h3>
 {
 isLoading ?
 <div>Loading...</div> :
 <form onSubmit={onSaveProfile}>
 <table>
 <tbody>
 <tr>
 <th>ID</th>
 <td>
 <input type="text" value={data.id} readOnly />
 </td>
 </tr>
 <tr>
 <th>First name</th>
 <td>
 <input
 type="text"
 value={data.firstname}
 onChange={(e) => setData((prev) => ({ ...prev, firstname: e.target.value }))}
 required
 />
 </td>
 </tr>
 <tr>
 <th>Last name</th>
 <td>
 <input
 type="text"
 value={data.lastname}
 onChange={(e) => setData((prev) => ({ ...prev, lastname: e.target.value }))}
 required
 />
 </td>
 </tr>
 <tr>
 <th>Email</th>
 <td>
 <input
 type="email"
 value={data.email}
 onChange={(e) => setData((prev) => ({ ...prev, email: e.target.value }))}
 required
 />
 </td>
 </tr>
 <tr>
 <th>Profile Image</th>
 <td>
 <input type="file" accept="image/*" onChange={onImageFileChange} />
 </td>
 </tr>
 {currentImageUrl && (
 <tr>
 <th>Preview</th>
 <td>
 <img
 src={currentImageUrl}
 alt="Profile preview"
 style={{ width: 120, height: 120, objectFit: "cover", border: "1px solid #ccc" }}
 />
 </td>
 </tr>
 )}
 </tbody>
 </table>
 <button type="submit" disabled={isSaving}>
 {isSaving ? "Saving..." : "Save Profile"}
 </button>
 </form>
 }
 </div>
 )
}
