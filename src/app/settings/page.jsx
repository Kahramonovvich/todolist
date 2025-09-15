'use client';
import { useState, useEffect, useRef } from 'react';
import { useMyContexts } from '../layout';
import { jobs } from '@/constants/constants';
import Image from 'next/image';
import { formatPhone } from '@/utils/utils';
import AddPhotoAlternateRoundedIcon from '@mui/icons-material/AddPhotoAlternateRounded';
import DeleteForeverRoundedIcon from '@mui/icons-material/DeleteForeverRounded';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import AvatarCropper from '@/components/AvatarCropper';
import { db, storage } from '@/lib/firebase';
import { ref, uploadBytes, deleteObject, getDownloadURL } from 'firebase/storage';
import { doc, updateDoc } from 'firebase/firestore';

function base64ToBlob(base64) {
    const [meta, data] = base64.split(',');
    const mime = (meta.match(/data:(.*);base64/) || [])[1] || 'image/png';
    const bytes = atob(data);
    const arr = new Uint8Array(bytes.length);
    for (let i = 0; i < bytes.length; i++) arr[i] = bytes.charCodeAt(i);
    return new Blob([arr], { type: mime });
};

async function uploadAvatar(uid, base64) {
    const fileRef = ref(storage, `avatars/${uid}/avatar.jpg`);
    const blob = base64ToBlob(base64);
    await uploadBytes(fileRef, blob);
    return await getDownloadURL(fileRef);
};

async function deleteAvatar(uid) {
    const fileRef = ref(storage, `avatars/${uid}/avatar.jpg`);
    try {
        await deleteObject(fileRef);
    } catch (e) {

    };
};

export default function Page() {

    const { currentUser, setIsLoading } = useMyContexts();

    const fileInputRef = useRef(null);

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        telegram: '',
        instagram: '',
        email: '',
        phoneNumber: '',
        job: '',
        avatar: '',
    });
    const [isOpen, setIsOpen] = useState(false);
    const [fileUrl, setFileUrl] = useState(null);
    const [originalData, setOriginalData] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const jobLabel = jobs.find((j) => j.id === formData.job)?.label || formData.job;

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
            setFileUrl(reader.result);
            setIsOpen(true);
        };
        reader.readAsDataURL(file);
    };

    const handleDelete = () => {
        setFormData((prev) => ({ ...prev, avatar: '' }));
    };

    const handleCropDone = (croppedBase64) => {
        setFormData((prev) => ({ ...prev, avatar: croppedBase64 }));
        setIsOpen(false);
        setFileUrl(null);
    };

    const handleCancel = () => {
        setIsOpen(false);
        setFileUrl(null);
    };

    const isDataChanged = () => {
        if (!originalData) return false;
        return Object.keys(formData).some((key) => formData[key] !== originalData[key]);
    };

    const handleSaveChanges = async () => {
        if (!currentUser) return;

        setIsLoading(true);

        const uid = currentUser.uid;
        const userRef = doc(db, 'users', uid);

        const diff = {};
        Object.keys(formData).forEach((k) => {
            if (originalData?.[k] !== formData[k]) diff[k] = formData[k];
        });

        try {
            if ('avatar' in diff) {
                if (!formData.avatar) {
                    await deleteAvatar(uid);
                    diff.avatar = '';
                } else if (formData.avatar.startsWith('data:')) {
                    const url = await uploadAvatar(uid, formData.avatar);
                    diff.avatar = url;
                };
            };

            if (Object.keys(diff).length > 0) {
                await updateDoc(userRef, diff);
            };

            const nextOriginal = { ...originalData, ...diff };
            setOriginalData(nextOriginal);
            setFormData(nextOriginal);

        } catch (err) {
            console.error('Save error:', err);
        } finally {
            setIsLoading(false);
        };
    };

    useEffect(() => {
        if (currentUser) {
            const userData = {
                firstName: currentUser.firstName || '',
                lastName: currentUser.lastName || '',
                email: currentUser.email || '',
                phoneNumber: currentUser.phoneNumber || '',
                job: currentUser.job || '',
                avatar: currentUser.avatar || '',
                telegram: currentUser.telegram || '',
                instagram: currentUser.instagram || '',
            };
            setFormData(userData);
            setOriginalData(userData);
        }
    }, [currentUser]);

    return (
        <div className="settings w-full h-full">
            {isOpen && fileUrl && (
                <AvatarCropper
                    fileUrl={fileUrl}
                    onCancel={handleCancel}
                    onCropDone={handleCropDone}
                />
            )}
            <h1 className="text-3xl font-bold mb-6 text-white">Profile Settings</h1>
            <div className="grid grid-cols-1 md:grid-cols-9 gap-6">
                <div className="col-span-2 flex flex-col items-center gap-6">
                    <input
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        onChange={handleImageChange}
                        className="hidden"
                    />
                    {formData.avatar ? (
                        <div className="img relative rounded-lg overflow-hidden bg-gray-700 aspect-square w-full group">
                            <div className="absolute top-3 right-3 flex items-center gap-x-2 z-50">
                                <button
                                    className="flex items-center justify-center text-white bg-gray-600 p-2 rounded-full opacity-0 group-hover:opacity-100
                                        transition-all duration-200"
                                    onClick={() => fileInputRef.current.click()}
                                >
                                    <EditRoundedIcon />
                                </button>
                                <button
                                    className="flex items-center justify-center text-white bg-gray-600 p-2 rounded-full opacity-0 group-hover:opacity-100
                                        transition-all duration-200"
                                    onClick={() => handleDelete()}
                                >
                                    <DeleteForeverRoundedIcon />
                                </button>
                            </div>
                            <Image
                                fill
                                src={formData.avatar}
                                style={{ objectFit: 'contain' }}
                                alt={formData.firstName}
                                unoptimized={true}
                            />
                        </div>
                    ) : (
                        <div className="aspect-square w-full bg-gray-700 rounded-lg flex items-center justify-center text-gray-400 relative group">
                            <button
                                className="absolute top-3 right-3 flex items-center justify-center text-white opacity-0 group-hover:opacity-100
                                    transition-all duration-200"
                                onClick={() => fileInputRef.current.click()}
                            >
                                <AddPhotoAlternateRoundedIcon fontSize='large' />
                            </button>
                            no image
                        </div>
                    )}
                </div>
                <div className="flex flex-col justify-between gap-4 md:col-span-7">
                    <div className="flex gap-x-4">
                        <input
                            className="w-full border border-gray-600 bg-gray-800 text-white rounded px-4 py-3 capitalize"
                            placeholder="First Name"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleChange}
                        />
                        <input
                            className="w-full border border-gray-600 bg-gray-800 text-white rounded px-4 py-3 capitalize"
                            placeholder="Last Name"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="flex gap-x-4">
                        <input
                            className="w-full border border-gray-700 bg-gray-900 text-white rounded px-4 py-3 cursor-not-allowed"
                            placeholder="Email"
                            name="email"
                            value={formData.email}
                            disabled
                        />
                        <input
                            className="w-full border border-gray-600 bg-gray-800 text-white rounded px-4 py-3"
                            placeholder="Phone Number"
                            name="phoneNumber"
                            value={formatPhone(formData.phoneNumber)}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="flex gap-x-4">
                        <input
                            className="w-full border border-gray-600 bg-gray-800 text-white rounded px-4 py-3 capitalize"
                            placeholder="Telegram"
                            name="telegram"
                            value={formData.telegram}
                            onChange={handleChange}
                        />
                        <input
                            className="w-full border border-gray-600 bg-gray-800 text-white rounded px-4 py-3 capitalize"
                            placeholder="Instagram"
                            name="instagram"
                            value={formData.instagram}
                            onChange={handleChange}
                        />
                    </div>
                    {formData.job === '' ? (
                        <select
                            name="job"
                            className="w-full border border-gray-600 bg-gray-800 text-white rounded px-4 py-3"
                            onChange={handleChange}
                            value={formData.job}
                            required
                        >
                            <option value="">Select your job</option>
                            {jobs.map((job) => (
                                <option
                                    key={job.id}
                                    value={job.id}
                                >
                                    {job.label}
                                </option>
                            ))}
                        </select>
                    ) : (
                        <input
                            className="w-full border border-gray-700 bg-gray-900 text-white rounded px-4 py-3 disabled:cursor-not-allowed"
                            placeholder="Job Title"
                            name="job"
                            value={jobLabel}
                            disabled
                        />
                    )}
                </div>
                <button
                    disabled={!isDataChanged()}
                    className={`col-span-9 py-3 rounded text-lg font-semibold transition-all duration-200 ${isDataChanged()
                        ? 'bg-green-600 hover:bg-green-700 text-white cursor-pointer'
                        : 'bg-gray-600 text-gray-300 cursor-not-allowed'
                        }`}
                    onClick={handleSaveChanges}
                >
                    Save Changes
                </button>
            </div>
        </div >
    );
};