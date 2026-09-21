"use client";
import { useState, useEffect } from "react";
import Sidebar from "@/components/sidebar";

export default function ProfilePage() {
    const [user, setUser] = useState({
        username: "",
        email: "",
        telepon: "",
        jenisKelamin: "",
        tanggalLahir: "",
        avatar: "",
    });

    useEffect(() => {
        const savedUser = localStorage.getItem("user");
        if (savedUser) {
            try {
                const parsedUser = JSON.parse(savedUser);
                setUser({
                    username: parsedUser.username || parsedUser.namaLengkap || "hava",
                    email: parsedUser.email || "regan@email.com",
                    telepon: parsedUser.telepon || parsedUser.whatsapp || "",
                    jenisKelamin: parsedUser.jenisKelamin || "",
                    tanggalLahir: parsedUser.tanggalLahir || "",
                    avatar: parsedUser.avatar || "",
                });
            } catch (e) {
                console.error("Gagal memparsing data:", e);
            }
        }
    }, []);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target?.result as string;
                img.onload = () => {
                    const canvas = document.createElement("canvas");
                    const MAX_WIDTH = 200;
                    const MAX_HEIGHT = 200;
                    let width = img.width;
                    let height = img.height;

                    if (width > height) {
                        if (width > MAX_WIDTH) {
                            height *= MAX_WIDTH / width;
                            width = MAX_WIDTH;
                        }
                    } else {
                        if (height > MAX_HEIGHT) {
                            width *= MAX_HEIGHT / height;
                            height = MAX_HEIGHT;
                        }
                    }

                    canvas.width = width;
                    canvas.height = height;
                    const ctx = canvas.getContext("2d");
                    ctx?.drawImage(img, 0, 0, width, height);

                    const compressedBase64 = canvas.toDataURL("image/jpeg", 0.7);
                    setUser((prev) => ({ ...prev, avatar: compressedBase64 }));
                };
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        
        // Ambil data lama di localStorage agar data lain (seperti token/status login) tidak hilang
        const existingData = localStorage.getItem("user");
        let parsedExisting = existingData ? JSON.parse(existingData) : {};

        // Gabungkan data lama dengan data inputan profil yang baru
        const updatedProfile = {
            ...parsedExisting,
            username: user.username,
            email: user.email,
            telepon: user.telepon,
            jenisKelamin: user.jenisKelamin,
            tanggalLahir: user.tanggalLahir,
            avatar: user.avatar, // Foto profil dipastikan ikut tersimpan secara permanen
        };

        localStorage.setItem("user", JSON.stringify(updatedProfile));
        window.dispatchEvent(new Event("storage_updated"));
        alert("Perubahan profil dan foto berhasil disimpan!");
    };

    return (
        <div style={{ display: "flex", height: "100vh", width: "100vw", overflow: "hidden", backgroundColor: "#eff6ff", fontFamily: "sans-serif" }}>
            <Sidebar />
            <main style={{ flex: 1, height: "100vh", overflowY: "auto", padding: "40px", display: "flex", justifyContent: "center", alignItems: "flex-start", boxSizing: "border-box" }}>
                <div style={{ width: "100%", maxWidth: "900px", backgroundColor: "#ffffff", borderRadius: "16px", padding: "40px", boxShadow: "0 4px 20px rgba(0,0,0,0.03)" }}>
                    <h2 style={{ fontSize: "22px", fontWeight: "bold", color: "#0f172a", marginBottom: "32px" }}>Informasi Profil</h2>

                    <form onSubmit={handleSave}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "48px" }}>
                            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "20px" }}>
                                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                                    <label style={{ fontSize: "13px", fontWeight: "600", color: "#475569" }}>Nama</label>
                                    <input
                                        type="text"
                                        style={{ width: "100%", padding: "12px 16px", fontSize: "14px", color: "#0f172a", backgroundColor: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "10px", outline: "none", boxSizing: "border-box" }}
                                        value={user.username}
                                        onChange={(e) => setUser({ ...user, username: e.target.value })}
                                    />
                                </div>

                                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                                    <label style={{ fontSize: "13px", fontWeight: "600", color: "#475569" }}>Email</label>
                                    <input
                                        type="email"
                                        style={{ width: "100%", padding: "12px 16px", fontSize: "14px", color: "#0f172a", backgroundColor: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "10px", outline: "none", boxSizing: "border-box" }}
                                        value={user.email}
                                        onChange={(e) => setUser({ ...user, email: e.target.value })}
                                    />
                                </div>

                                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                                    <label style={{ fontSize: "13px", fontWeight: "600", color: "#475569" }}>Nomor Telepon</label>
                                    <input
                                        type="text"
                                        placeholder="Masukkan No Telepon"
                                        style={{ width: "100%", padding: "12px 16px", fontSize: "14px", color: "#0f172a", backgroundColor: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "10px", outline: "none", boxSizing: "border-box" }}
                                        value={user.telepon}
                                        onChange={(e) => setUser({ ...user, telepon: e.target.value })}
                                    />
                                </div>

                                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                                    <label style={{ fontSize: "13px", fontWeight: "600", color: "#475569" }}>Jenis Kelamin</label>
                                    <select
                                        style={{ width: "100%", padding: "12px 16px", fontSize: "14px", color: "#0f172a", backgroundColor: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "10px", outline: "none", boxSizing: "border-box" }}
                                        value={user.jenisKelamin}
                                        onChange={(e) => setUser({ ...user, jenisKelamin: e.target.value })}
                                    >
                                        <option value="">Pilih Jenis Kelamin</option>
                                        <option value="Pria">Pria</option>
                                        <option value="Wanita">Wanita</option>
                                    </select>
                                </div>

                                <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                                    <label style={{ fontSize: "13px", fontWeight: "600", color: "#475569" }}>Tanggal Lahir</label>
                                    <input
                                        type="date"
                                        style={{ width: "100%", padding: "12px 16px", fontSize: "14px", color: "#0f172a", backgroundColor: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "10px", outline: "none", boxSizing: "border-box" }}
                                        value={user.tanggalLahir}
                                        onChange={(e) => setUser({ ...user, tanggalLahir: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "16px", paddingTop: "8px", minWidth: "140px" }}>
                                <div style={{ width: "120px", height: "120px", backgroundColor: "#e2e8f0", borderRadius: "50%", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", border: "3px solid #f1f5f9" }}>
                                    {user.avatar ? (
                                        <img src={user.avatar} alt="Avatar" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                    ) : (
                                        <span style={{ fontSize: "13px", color: "#94a3b8", fontWeight: 500 }}>No Image</span>
                                    )}
                                </div>
                                <label style={{ backgroundColor: "#f1f5f9", border: "1px solid #cbd5e1", padding: "8px 20px", borderRadius: "8px", fontSize: "13px", fontWeight: "600", cursor: "pointer", color: "#334155" }}>
                                    Pilih Foto
                                    <input
                                        type="file"
                                        accept="image/*"
                                        style={{ display: "none" }}
                                        onChange={handleImageChange}
                                    />
                                </label>
                            </div>
                        </div>

                        <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "36px", borderTop: "1px solid #f1f5f9", paddingTop: "24px" }}>
                            <button type="submit" style={{ backgroundColor: "#1d4ed8", color: "#ffffff", border: "none", padding: "12px 28px", borderRadius: "10px", fontWeight: "bold", fontSize: "14px", cursor: "pointer", boxShadow: "0 2px 8px rgba(29, 78, 216, 0.3)" }}>
                                Simpan Perubahan
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
}