import React, { useState, useEffect } from 'react';
import { getProfile, updateProfile, uploadProfileImage } from '../../services/profileService';
import { useAuth } from '../../context/AuthContext';
import { Camera, Save, User as UserIcon } from 'lucide-react';

const Profile = () => {
    const { user } = useAuth();
    const [profile, setProfile] = useState(null);
    const [formData, setFormData] = useState({ fullName: '', bio: '' });
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const data = await getProfile();
            setProfile(data.profile);
            setFormData({
                fullName: data.profile.fullName || '',
                bio: data.profile.bio || ''
            });
        } catch (error) {
            console.error('Failed to fetch profile', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await updateProfile(formData);
            setMessage('Profile updated successfully!');
            setTimeout(() => setMessage(''), 3000);
            fetchProfile();
        } catch (error) {
            setMessage('Failed to update profile.');
        }
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const data = new FormData();
        data.append('profileImage', file);

        try {
            await uploadProfileImage(data);
            setMessage('Image uploaded successfully!');
            setTimeout(() => setMessage(''), 3000);
            fetchProfile();
        } catch (error) {
            setMessage('Failed to upload image.');
        }
    };

    if (loading) return <div className="text-white text-center mt-10">Loading profile...</div>;

    return (
        <div className="max-w-4xl mx-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-text-main mb-2">My Profile</h1>
                <p className="text-text-muted">Manage your personal information and account settings.</p>
            </div>

            {message && (
                <div className={`p-4 mb-6 rounded-lg border ${message.includes('success') ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-600' : 'bg-red-500/10 border-red-500/50 text-red-500'}`}>
                    {message}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Image Section */}
                <div className="col-span-1">
                    <div className="bg-surface border border-border rounded-2xl p-6 flex flex-col items-center shadow-sm">
                        <div className="relative group w-48 h-48 rounded-full overflow-hidden mb-6 border-4 border-white shadow-xl">
                            {profile?.imagePath ? (
                                <img
                                    src={`http://localhost:5000${profile.imagePath}`}
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full bg-slate-200 flex items-center justify-center text-text-muted">
                                    <UserIcon size={64} />
                                </div>
                            )}

                            <label className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                                <span className="text-white font-medium flex items-center space-x-2">
                                    <Camera size={20} />
                                    <span>Change</span>
                                </span>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    className="hidden"
                                />
                            </label>
                        </div>

                        <h3 className="text-xl font-bold text-text-main">{user?.username}</h3>
                        <span className="inline-block px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 text-xs font-semibold mt-2 border border-emerald-500/20">
                            {user?.role}
                        </span>
                    </div>
                </div>

                {/* Details Section */}
                <div className="col-span-2">
                    <div className="bg-surface border border-border rounded-2xl p-8 shadow-sm">
                        <h3 className="text-lg font-semibold text-text-main mb-6 pb-4 border-b border-border">
                            Personal Information
                        </h3>
                        <form onSubmit={handleUpdate} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-text-muted mb-2">Username</label>
                                    <input
                                        type="text"
                                        value={user?.username || ''}
                                        disabled
                                        className="w-full px-4 py-3 bg-emerald-50/50 border border-emerald-200 rounded-xl text-text-muted cursor-not-allowed"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-text-muted mb-2">Email Address</label>
                                    <input
                                        type="text"
                                        value={user?.email || 'N/A'} // Email not currently returned in user object but could be
                                        disabled
                                        className="w-full px-4 py-3 bg-emerald-50/50 border border-emerald-200 rounded-xl text-text-muted cursor-not-allowed"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-text-muted mb-2">Full Name</label>
                                <input
                                    type="text"
                                    disabled
                                    className="w-full px-4 py-3 bg-emerald-50/50 border border-border rounded-xl text-text-muted cursor-not-allowed"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-text-muted mb-2">Bio</label>
                                <textarea
                                    value={formData.bio}
                                    onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                                    className="w-full px-4 py-3 bg-background border border-border rounded-xl focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 text-text-main placeholder-slate-400 transition-all h-32 resize-none"
                                    placeholder="Tell us a bit about yourself..."
                                />
                            </div>

                            <div className="pt-4 flex justify-end">
                                <button
                                    type="submit"
                                    className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-6 rounded-xl transition-all shadow-lg shadow-emerald-500/20 flex items-center space-x-2"
                                >
                                    <Save size={20} />
                                    <span>Save Changes</span>
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
