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

        const existingData = localStorage.getItem("user");
        const parsedExisting = existingData ? JSON.parse(existingData) : {};

        const updatedProfile = {
            ...parsedExisting,
            username: user.username,
            email: user.email,
            telepon: user.telepon,
            jenisKelamin: user.jenisKelamin,
            tanggalLahir: user.tanggalLahir,
            avatar: user.avatar,
        };

        localStorage.setItem("user", JSON.stringify(updatedProfile));
        window.dispatchEvent(new Event("storage_updated"));
        alert("Perubahan profil dan foto berhasil disimpan!");
    };

    return (
        <div className="profile-layout">
            <style>{`
                .profile-layout {
                    display: flex;
                    min-height: 100vh;
                    width: 100%;
                    background-color: #eef3fb;
                    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                    color: #0f172a;
                }

                .profile-main {
                    flex: 1;
                    min-height: 100vh;
                    overflow-y: auto;
                    padding: 36px 40px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    box-sizing: border-box;
                    margin-left:250px;
                }

                .profile-page-title {
                    font-size: 26px;
                    font-weight: 700;
                    color: #0f172a;
                    margin: 0 0 24px 0;
                    text-align: center;
                }

                .profile-card {
                    width: 100%;
                    max-width: 880px;
                    background-color: #ffffff;
                    border: 1px solid #e2e8f0;
                    border-radius: 16px;
                    padding: 32px 36px;
                    box-shadow: 0 4px 18px rgba(15, 23, 42, 0.04);
                    box-sizing: border-box;
                }

                .profile-section-title {
                    font-size: 16px;
                    font-weight: 700;
                    color: #0f172a;
                    margin: 0 0 24px 0;
                    padding-bottom: 14px;
                    border-bottom: 1px solid #f1f5f9;
                }

                .profile-grid {
                    display: flex;
                    justify-content: space-between;
                    align-items: flex-start;
                    gap: 44px;
                }

                .profile-fields {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    gap: 18px;
                }

                .form-group {
                    display: flex;
                    flex-direction: column;
                    gap: 6px;
                }

                .form-label {
                    font-size: 13px;
                    font-weight: 600;
                    color: #475569;
                }

                .form-control {
                    width: 100%;
                    padding: 11px 14px;
                    font-size: 14px;
                    color: #0f172a;
                    background-color: #f8fafc;
                    border: 1px solid #dbe3ef;
                    border-radius: 8px;
                    outline: none;
                    box-sizing: border-box;
                    transition: border-color 0.15s ease, background-color 0.15s ease, box-shadow 0.15s ease;
                }

                .form-control:hover {
                    border-color: #cbd5e1;
                }

                .form-control:focus {
                    background-color: #ffffff;
                    border-color: #2563eb;
                    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.12);
                }

                .avatar-panel {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 14px;
                    min-width: 150px;
                    padding: 20px 16px;
                    background-color: #f8fafc;
                    border: 1px solid #e2e8f0;
                    border-radius: 12px;
                }

                .avatar-preview {
                    width: 112px;
                    height: 112px;
                    background-color: #e2e8f0;
                    border-radius: 50%;
                    overflow: hidden;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border: 3px solid #ffffff;
                    box-shadow: 0 2px 8px rgba(15, 23, 42, 0.08);
                }

                .avatar-preview img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }

                .avatar-placeholder {
                    font-size: 12px;
                    font-weight: 600;
                    color: #64748b;
                }

                .upload-btn {
                    background-color: #ffffff;
                    border: 1px solid #cbd5e1;
                    padding: 8px 16px;
                    border-radius: 8px;
                    font-size: 13px;
                    font-weight: 600;
                    cursor: pointer;
                    color: #1e293b;
                    transition: background-color 0.15s ease, border-color 0.15s ease;
                }

                .upload-btn:hover {
                    background-color: #eff6ff;
                    border-color: #93c5fd;
                    color: #1d4ed8;
                }

                .upload-input {
                    display: none;
                }

                .form-footer {
                    display: flex;
                    justify-content: flex-end;
                    margin-top: 28px;
                    padding-top: 20px;
                    border-top: 1px solid #f1f5f9;
                }

                .btn-save {
                    background-color: #2563eb;
                    color: #ffffff;
                    border: none;
                    padding: 10px 24px;
                    border-radius: 8px;
                    font-weight: 600;
                    font-size: 14px;
                    cursor: pointer;
                    transition: background-color 0.15s ease, transform 0.1s ease;
                }

                .btn-save:hover {
                    background-color: #1d4ed8;
                }

                .btn-save:active {
                    transform: scale(0.99);
                }

                @media (max-width: 768px) {
                    .profile-main {
                        padding: 20px 16px;
                    }

                    .profile-card {
                        padding: 22px 18px;
                    }

                    .profile-grid {
                        flex-direction: column-reverse;
                        align-items: center;
                        gap: 24px;
                    }

                    .profile-fields {
                        width: 100%;
                    }

                    .avatar-panel {
                        width: 100%;
                        box-sizing: border-box;
                    }

                    .form-footer {
                        justify-content: stretch;
                    }

                    .btn-save {
                        width: 100%;
                    }
                }
            `}</style>

            <Sidebar />

            <main className="profile-main">


                <div className="profile-card">
                    <h2 className="profile-section-title">Informasi Profil</h2>

                    <form onSubmit={handleSave}>
                        <div className="profile-grid">
                            <div className="profile-fields">
                                <div className="form-group">
                                    <label htmlFor="username" className="form-label">Nama</label>
                                    <input
                                        id="username"
                                        type="text"
                                        className="form-control"
                                        value={user.username}
                                        onChange={(e) => setUser({ ...user, username: e.target.value })}
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="email" className="form-label">Email</label>
                                    <input
                                        id="email"
                                        type="email"
                                        className="form-control"
                                        value={user.email}
                                        onChange={(e) => setUser({ ...user, email: e.target.value })}
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="telepon" className="form-label">Nomor Telepon</label>
                                    <input
                                        id="telepon"
                                        type="text"
                                        placeholder="Masukkan No Telepon"
                                        className="form-control"
                                        value={user.telepon}
                                        onChange={(e) => setUser({ ...user, telepon: e.target.value })}
                                    />
                                </div>

                                <div className="form-group">
                                    <label htmlFor="jenisKelamin" className="form-label">Jenis Kelamin</label>
                                    <select
                                        id="jenisKelamin"
                                        className="form-control"
                                        value={user.jenisKelamin}
                                        onChange={(e) => setUser({ ...user, jenisKelamin: e.target.value })}
                                    >
                                        <option value="">Pilih Jenis Kelamin</option>
                                        <option value="Pria">Pria</option>
                                        <option value="Wanita">Wanita</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label htmlFor="tanggalLahir" className="form-label">Tanggal Lahir</label>
                                    <input
                                        id="tanggalLahir"
                                        type="date"
                                        className="form-control"
                                        value={user.tanggalLahir}
                                        onChange={(e) => setUser({ ...user, tanggalLahir: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="avatar-panel">
                                <div className="avatar-preview">
                                    {user.avatar ? (
                                        <img src={user.avatar} alt="Avatar" />
                                    ) : (
                                        <span className="avatar-placeholder">No Image</span>
                                    )}
                                </div>
                                <label className="upload-btn">
                                    Pilih Foto
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="upload-input"
                                        onChange={handleImageChange}
                                    />
                                </label>
                            </div>
                        </div>

                        <div className="form-footer">
                            <button type="submit" className="btn-save">
                                Simpan Perubahan
                            </button>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
}