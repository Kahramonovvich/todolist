'use client';
import Cropper from 'react-easy-crop';
import { useCallback, useState } from 'react';
import getCroppedImg from '@/utils/utils';

export default function AvatarCropper({ fileUrl, onCancel, onCropDone }) {

    const [crop, setCrop] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);

    const onCropComplete = useCallback((_, croppedPixels) => {
        setCroppedAreaPixels(croppedPixels);
    }, []);

    const handleDone = async () => {
        const croppedImg = await getCroppedImg(fileUrl, croppedAreaPixels);
        onCropDone(croppedImg);
    };

    return (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center">
            <div className="relative w-full max-w-96 h-full bg-white rounded shadow">
                <Cropper
                    image={fileUrl}
                    crop={crop}
                    zoom={zoom}
                    aspect={1}
                    onCropChange={setCrop}
                    onZoomChange={setZoom}
                    onCropComplete={onCropComplete}
                />
                <div className="absolute bottom-4 left-0 right-0 grid grid-cols-2 gap-5 px-5 z-[100]">
                    <button onClick={handleDone} className="px-4 py-2 bg-green-600 text-white rounded">Save</button>
                    <button onClick={onCancel} className="px-4 py-2 bg-gray-500 text-white rounded">Cancel</button>
                </div>
            </div>
        </div>
    );
};