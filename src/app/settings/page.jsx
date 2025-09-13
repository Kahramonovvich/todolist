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

export default function Page() {

    const { currentUser } = useMyContexts();

    const fileInputRef = useRef(null);

    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
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

    const handleSaveChanges = () => {
        
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="flex flex-col items-center gap-6">
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
                                    className="flex items-center justify-center text-white opacity-0 group-hover:opacity-100
                                        transition-all duration-200"
                                    onClick={() => fileInputRef.current.click()}
                                >
                                    <EditRoundedIcon fontSize='large' />
                                </button>
                                <button
                                    className="flex items-center justify-center text-white opacity-0 group-hover:opacity-100
                                        transition-all duration-200"
                                    onClick={() => handleDelete()}
                                >
                                    <DeleteForeverRoundedIcon fontSize='large' />
                                </button>
                            </div>
                            <Image
                                fill
                                src={formData.avatar}
                                style={{ objectFit: 'contain' }}
                                alt={formData.firstName}
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
                <div className="flex flex-col justify-between gap-4 md:col-span-2">
                    <input
                        className="w-full border border-gray-600 bg-gray-800 text-white rounded px-4 py-3"
                        placeholder="First Name"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                    />
                    <input
                        className="w-full border border-gray-600 bg-gray-800 text-white rounded px-4 py-3"
                        placeholder="Last Name"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                    />
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
                    <input
                        className="w-full border border-gray-700 bg-gray-900 text-white rounded px-4 py-3 cursor-not-allowed"
                        placeholder="Job Title"
                        name="job"
                        value={jobLabel}
                        disabled
                    />
                    <button
                        disabled={!isDataChanged()}
                        className={`w-full py-3 rounded text-lg font-semibold transition-all duration-200 ${isDataChanged()
                            ? 'bg-green-600 hover:bg-green-700 text-white cursor-pointer'
                            : 'bg-gray-600 text-gray-300 cursor-not-allowed'
                            }`}
                    >
                        Save Changes
                    </button>
                </div>
            </div>
        </div >
    );
};