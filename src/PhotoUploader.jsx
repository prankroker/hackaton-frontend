import React, { useState, useRef } from 'react';

const PhotoUploader = ({ onImageSelect, onImageRemove, disabled }) => {
    const [previewUrl, setPreviewUrl] = useState(null);
    const [isDragging, setIsDragging] = useState(false);
    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            processFile(file);
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        if (!disabled) setIsDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        if (disabled) return;

        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            processFile(file);
        }
    };

    const processFile = (file) => {
        onImageSelect(file);
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreviewUrl(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const handleRemove = () => {
        onImageRemove();
        setPreviewUrl(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    return (
        <div className="bg-slate-800/50 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-purple-500/20 mb-8">
            <h2 className="text-xl font-semibold mb-6 text-white">Upload Photo for Analysis</h2>

            {!previewUrl ? (
                <div
                    className={`flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg transition-all duration-200 ease-in-out ${
                        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                    } ${
                        isDragging
                            ? 'border-purple-500 bg-purple-500/20'
                            : 'border-purple-500/30 bg-slate-700/30 hover:border-purple-500/50 hover:bg-slate-700/50'
                    }`}
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => !disabled && fileInputRef.current.click()}
                >
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <svg className="w-12 h-12 mb-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
                        </svg>
                        <p className="mb-2 text-sm text-gray-300 text-center px-4">
                            <span className="font-semibold text-purple-300">Click to upload</span> or drag and drop
                        </p>
                        <p className="text-xs text-gray-400">PNG, JPG, GIF or SVG</p>
                    </div>
                    <input
                        type="file"
                        className="hidden"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/*"
                        disabled={disabled}
                    />
                </div>
            ) : (
                <div className="flex flex-col items-center">
                    <div className="relative w-full h-64 rounded-lg overflow-hidden border border-purple-500/30 mb-6">
                        <img src={previewUrl} alt="Preview" className="w-full h-full object-contain bg-slate-900/50" />
                        <button
                            onClick={handleRemove}
                            disabled={disabled}
                            className="absolute top-3 right-3 bg-red-500/90 hover:bg-red-600 text-white rounded-full p-2 transition-colors disabled:opacity-50 shadow-lg"
                            title="Remove photo"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                            </svg>
                        </button>
                    </div>

                    <button
                        onClick={handleRemove}
                        disabled={disabled}
                        className="w-full py-2.5 px-4 bg-slate-700/50 hover:bg-slate-700 border border-purple-500/30 hover:border-purple-500/50 text-gray-300 hover:text-white font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Choose Different Photo
                    </button>
                </div>
            )}
        </div>
    );
};

export default PhotoUploader;