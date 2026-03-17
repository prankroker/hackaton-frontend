import { useState, useCallback, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
    Sparkles,
    Upload,
    Image as ImageIcon,
    History,
    CreditCard,
    Check,
    X,
    Home,
    Download
} from 'lucide-react';

function App() {
    
    const [input, setInput] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState(null);
    const abortControllerRef = useRef(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [activeNav, setActiveNav] = useState('generate');
    const [includeModel, setIncludeModel] = useState(false);
    const [hoveredImageIndex, setHoveredImageIndex] = useState(null);
    const [savedImageSets, setSavedImageSets] = useState([]);

    
    const fetchAIGeneration = useCallback(async (prompt, file) => {
        abortControllerRef.current = new AbortController();
        const signal = abortControllerRef.current.signal;

        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('prompt', prompt);

            const generateResponse = await fetch('http://localhost:8080/enchance', {
                method: 'POST',
                body: formData,
                signal,
            });

            if (!generateResponse.ok) {
                const errorData = await generateResponse.text();
                throw new Error(`Generation request failed: ${generateResponse.status} - ${errorData}`);
            }

            const generateData = await generateResponse.json();
            const taskId = generateData.message;

            let isComplete = false;
            const maxAttempts = 30;
            let attempts = 0;
            const pollInterval = 2000;

            while (!isComplete && attempts < maxAttempts) {
                await new Promise((resolve) => setTimeout(resolve, pollInterval));

                const statusResponse = await fetch(`http://localhost:8080/status/${taskId}`, {
                    method: 'GET',
                    headers: { 'Content-Type': 'application/json' },
                    signal,
                });

                if (!statusResponse.ok) {
                    throw new Error(`Status check failed: ${statusResponse.status}`);
                }

                const statusData = await statusResponse.json();

                if (statusData.message === 'COMPLETED') {
                    isComplete = true;
                } else if (statusData.message === 'IN_PROGRESS') {
                    attempts++;
                    continue;
                } else {
                    throw new Error(`Unexpected status: ${statusData.message}`);
                }
            }

            if (!isComplete) {
                throw new Error('Generation timeout: task did not complete in time');
            }

            const resultResponse = await fetch(`http://localhost:8080/result/${taskId}`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                signal,
            });

            if (!resultResponse.ok) {
                throw new Error(`Result fetch failed: ${resultResponse.status}`);
            }

            return await resultResponse.json();
        } catch (err) {
            if (err.name === 'AbortError') {
                throw new Error('Request was cancelled');
            }
            throw new Error(`Failed to fetch AI response: ${err.message}`);
        }
    }, []);

    const handleSubmit = useCallback(async (e) => {
        if (e) e.preventDefault();

        if (!input.trim()) {
            setError("Будь ласка, введіть промпт.");
            return;
        }

        if (!imageFile) {
            setError("Будь ласка, завантажте фото.");
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const data = await fetchAIGeneration(input, imageFile);
            setResult(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }, [input, imageFile, fetchAIGeneration]);

    const processFile = (file) => {
        setImageFile(file);
        const reader = new FileReader();
        reader.onload = (e) => setPreviewUrl(e.target.result);
        reader.readAsDataURL(file);
        setError(null);
    };

    const handleImageUpload = (e) => {
        const file = e.target?.files?.[0];
        if (file && file.type.startsWith('image/')) processFile(file);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files?.[0];
        if (file && file.type.startsWith('image/')) processFile(file);
    };

    const handleDragOver = (e) => e.preventDefault();

    const clearUpload = () => {
        setImageFile(null);
        setPreviewUrl(null);
        setResult(null);
        setInput('');
        setError(null);
    };

    const startNewGeneration = () => {
        if (result?.images?.length > 0) {
            const heroImage = result.images[0].url;
            const additionalImages = result.images.slice(1).map(img => img.url);

            const newImageSet = {
                id: Date.now().toString(),
                heroImage: heroImage,
                additionalImages: additionalImages,
                prompt: input,
                timestamp: new Date(),
            };
            setSavedImageSets([newImageSet, ...savedImageSets]);
        }
        clearUpload();
    };

    const handleDownloadImage = async (imageUrl, fileName) => {
        try {
            const response = await fetch(imageUrl);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = fileName || `sellshot-image-${Date.now()}.jpg`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Download failed", error);
        }
    };

    const handleDownloadAll = () => {
        if (!result?.images) return;
        result.images.forEach((img, index) => {
            handleDownloadImage(img.url, img.file_name || `product-image-${index + 1}.jpg`);
        });
    };

    const heroImage = result?.images?.[0]?.url;
    const additionalImages = result?.images?.slice(1) || [];

    return (
        <div className="min-h-screen bg-white flex text-black">
            {/* Sidebar */}
            <aside className="fixed left-0 top-0 h-screen bg-gray-50 border-r border-gray-200 p-6 flex flex-col" style={{ width: '200px' }}>
                <div className="flex items-center gap-2 mb-8 text-black">
                    <Sparkles className="w-6 h-6" />
                    <span className="font-semibold text-lg">SellShot</span>
                </div>

                <nav className="space-y-2 flex-1">
                    <button
                        onClick={() => {
                            if (activeNav === 'generate' && result) {
                                startNewGeneration();
                            } else {
                                setActiveNav('generate');
                            }
                        }}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                            activeNav === 'generate'
                                ? 'bg-black text-white'
                                : 'text-gray-600 hover:bg-gray-100'
                        }`}
                    >
                        <Sparkles className="w-5 h-5" />
                        Generate
                    </button>

                    <button
                        onClick={() => setActiveNav('my-images')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                            activeNav === 'my-images'
                                ? 'bg-black text-white'
                                : 'text-gray-600 hover:bg-gray-100'
                        }`}
                    >
                        <ImageIcon className="w-5 h-5" />
                        My images
                    </button>

                    <button
                        onClick={() => setActiveNav('history')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                            activeNav === 'history'
                                ? 'bg-black text-white'
                                : 'text-gray-600 hover:bg-gray-100'
                        }`}
                    >
                        <History className="w-5 h-5" />
                        History
                    </button>

                    <button
                        onClick={() => setActiveNav('billing')}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                            activeNav === 'billing'
                                ? 'bg-black text-white'
                                : 'text-gray-600 hover:bg-gray-100'
                        }`}
                    >
                        <CreditCard className="w-5 h-5" />
                        Billing
                    </button>
                </nav>

                <div className="border-t border-gray-200 pt-4">
                    <Link
                        to="/"
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-600 hover:bg-gray-100 transition"
                    >
                        <Home className="w-5 h-5" />
                        Back
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="h-screen flex text-black bg-white" style={{ marginLeft: '200px', width: 'calc(100% - 200px)' }}>
                {activeNav === 'generate' ? (
                    <div className="h-full flex w-full">
                        {/* Center Column - Generation Controls */}
                        <div className="w-1/2 flex flex-col border-r border-gray-200">
                            <div className="p-8 pb-4">
                                <h1 className="text-2xl font-medium">Generate product images</h1>
                            </div>

                            <div className="flex-1 overflow-auto px-8 pb-8">
                                {error && (
                                    <div className="mb-6 bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl flex items-start gap-3">
                                        <X className="w-5 h-5 mt-0.5 flex-shrink-0 cursor-pointer" onClick={() => setError(null)} />
                                        <p className="text-sm">{error}</p>
                                    </div>
                                )}

                                {/* Upload Photo */}
                                <div className="mb-6">
                                    <h2 className="font-medium mb-3">Upload photo</h2>
                                    {!previewUrl ? (
                                        <div
                                            onDragOver={handleDragOver}
                                            onDrop={handleDrop}
                                            className={`border-2 border-dashed rounded-2xl p-12 text-center transition cursor-pointer ${
                                                isLoading ? 'opacity-50 cursor-not-allowed border-gray-200' : 'border-gray-300 hover:border-gray-400'
                                            }`}
                                            onClick={() => !isLoading && document.getElementById('file-upload')?.click()}
                                        >
                                            <div className="w-12 h-12 bg-gray-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                                                <Upload className="w-6 h-6 text-gray-400" />
                                            </div>
                                            <p className="mb-2">Drop product photo here</p>
                                            <p className="text-sm text-gray-500">or click to browse</p>
                                            <input
                                                id="file-upload"
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageUpload}
                                                className="hidden"
                                                disabled={isLoading}
                                            />
                                        </div>
                                    ) : (
                                        <div className="flex items-start gap-4">
                                            <div className="relative">
                                                <div className="w-24 h-24 rounded-xl border border-gray-200 bg-gray-50 overflow-hidden">
                                                    <img
                                                        src={previewUrl}
                                                        alt="Uploaded product"
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                <button
                                                    onClick={clearUpload}
                                                    disabled={isLoading}
                                                    className="absolute -top-2 -right-2 w-6 h-6 bg-black text-white rounded-full flex items-center justify-center hover:bg-gray-800 transition shadow-sm disabled:opacity-50"
                                                >
                                                    <X className="w-3.5 h-3.5" />
                                                </button>
                                                <p className="text-xs text-gray-600 mt-2">1 photo uploaded</p>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Controls Area */}
                                {previewUrl && (
                                    <div className="space-y-4">
                                        <div>
                                            <h2 className="font-medium mb-3">Describe the style</h2>
                                            <textarea
                                                value={input}
                                                onChange={(e) => setInput(e.target.value)}
                                                placeholder="professional lighting, clean background, marketplace ready..."
                                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-black resize-none h-24 text-black placeholder-gray-400 bg-white"
                                                disabled={isLoading}
                                            />
                                        </div>

                                        <div>
                                            <label className="flex items-center justify-between cursor-pointer p-4 border border-gray-200 rounded-xl hover:border-gray-300 transition">
                                                <div className="flex-1">
                                                    <span className="font-medium">Add human context</span>
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        Optional: show the product worn or held to add lifestyle context
                                                    </p>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => setIncludeModel(!includeModel)}
                                                    disabled={isLoading}
                                                    className={`w-12 h-6 rounded-full transition flex-shrink-0 ml-4 ${
                                                        includeModel ? 'bg-black' : 'bg-gray-200'
                                                    }`}
                                                >
                                                    <div className={`w-5 h-5 bg-white rounded-full transition transform ${
                                                        includeModel ? 'translate-x-6' : 'translate-x-0.5'
                                                    }`} />
                                                </button>
                                            </label>
                                        </div>

                                        {!result && (
                                            <button
                                                onClick={handleSubmit}
                                                disabled={isLoading || !input.trim()}
                                                className="w-full bg-black text-white px-6 py-4 rounded-xl hover:bg-gray-800 transition disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center justify-center gap-2 font-medium"
                                            >
                                                {isLoading ? (
                                                    <>
                                                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                        </svg>
                                                        Processing...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Sparkles className="w-5 h-5" />
                                                        Generate
                                                    </>
                                                )}
                                            </button>
                                        )}

                                        {/* Після успішної генерації */}
                                        {result && !isLoading && (
                                            <div className="space-y-4 pt-4 border-t border-gray-200">
                                                <div className="flex items-center gap-2 text-green-600 mb-2">
                                                    <Check className="w-5 h-5" />
                                                    <span className="text-sm font-medium">Successfully generated</span>
                                                </div>
                                                <button
                                                    onClick={handleDownloadAll}
                                                    className="w-full bg-black text-white px-6 py-3 rounded-xl hover:bg-gray-800 transition inline-flex items-center justify-center gap-2"
                                                >
                                                    <Download className="w-5 h-5" />
                                                    Download all photos
                                                </button>

                                                <button
                                                    onClick={startNewGeneration}
                                                    className="w-full border border-black px-6 py-3 rounded-xl hover:bg-gray-50 transition inline-flex items-center justify-center gap-2"
                                                >
                                                    <Sparkles className="w-5 h-5" />
                                                    Start new generation
                                                </button>
                                                <p className="text-xs text-gray-500 mt-2 text-center">
                                                    Current images will be saved to My images
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Right Column - Preview */}
                        <div className="w-1/2 p-8 bg-gray-50 overflow-auto relative">
                            {isLoading && (
                                <div className="absolute inset-0 bg-gray-50/80 backdrop-blur-sm z-10 flex flex-col items-center justify-center text-center p-8">
                                    <svg className="animate-spin h-10 w-10 text-black mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    <p className="text-lg font-medium">AI is working its magic...</p>
                                    <p className="text-sm text-gray-500 mt-2">This may take up to a minute depending on your prompt.</p>
                                </div>
                            )}

                            {!result ? (
                                <div className="flex flex-col h-full">
                                    <h2 className="text-lg mb-6 font-medium">Quick guide</h2>

                                    <div className="space-y-4">
                                        {/* Step 1 */}
                                        <div className={`p-5 rounded-xl border-2 transition ${
                                            !previewUrl
                                                ? 'border-black bg-white'
                                                : 'border-gray-200 bg-white opacity-60'
                                        }`}>
                                            <div className="flex items-start gap-3">
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                                                    !previewUrl
                                                        ? 'bg-black text-white'
                                                        : 'bg-gray-200 text-gray-600'
                                                }`}>
                                                    <span className="text-sm font-semibold">1</span>
                                                </div>
                                                <div>
                                                    <h3 className="font-medium mb-1">Upload product photo</h3>
                                                    <p className="text-sm text-gray-600">Upload a photo of clothing, shoes, or accessories</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Step 2 */}
                                        <div className={`p-5 rounded-xl border-2 transition ${
                                            previewUrl && !input
                                                ? 'border-black bg-white'
                                                : previewUrl
                                                    ? 'border-gray-200 bg-white opacity-60'
                                                    : 'border-gray-200 bg-white opacity-40'
                                        }`}>
                                            <div className="flex items-start gap-3">
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                                                    previewUrl && !input
                                                        ? 'bg-black text-white'
                                                        : previewUrl
                                                            ? 'bg-gray-200 text-gray-600'
                                                            : 'bg-gray-100 text-gray-400'
                                                }`}>
                                                    <span className="text-sm font-semibold">2</span>
                                                </div>
                                                <div>
                                                    <h3 className="font-medium mb-1">Describe the style</h3>
                                                    <p className="text-sm text-gray-600">Add lighting, background, or marketplace style details</p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Step 3 */}
                                        <div className={`p-5 rounded-xl border-2 transition ${
                                            previewUrl && input && !result
                                                ? 'border-black bg-white'
                                                : previewUrl && input
                                                    ? 'border-gray-200 bg-white opacity-60'
                                                    : 'border-gray-200 bg-white opacity-40'
                                        }`}>
                                            <div className="flex items-start gap-3">
                                                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                                                    previewUrl && input && !result
                                                        ? 'bg-black text-white'
                                                        : previewUrl && input
                                                            ? 'bg-gray-200 text-gray-600'
                                                            : 'bg-gray-100 text-gray-400'
                                                }`}>
                                                    <span className="text-sm font-semibold">3</span>
                                                </div>
                                                <div>
                                                    <h3 className="font-medium mb-1">Generate & approve</h3>
                                                    <p className="text-sm text-gray-600">Generate the first image, approve it, then create more angles</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div>
                                    <h2 className="text-lg mb-4 font-medium">Result Preview</h2>

                                    {/* Main Generated Image */}
                                    {heroImage && (
                                        <div
                                            className="mb-4 relative group"
                                            onMouseEnter={() => setHoveredImageIndex(0)}
                                            onMouseLeave={() => setHoveredImageIndex(null)}
                                        >
                                            <img
                                                src={heroImage}
                                                alt="Generated Hero"
                                                className="w-full rounded-2xl object-cover border border-gray-200"
                                            />
                                            {hoveredImageIndex === 0 && (
                                                <button
                                                    onClick={() => handleDownloadImage(heroImage, result.images[0]?.file_name)}
                                                    className="absolute top-4 right-4 bg-black/80 text-white p-2.5 rounded-lg hover:bg-black transition shadow-lg"
                                                >
                                                    <Download className="w-5 h-5" />
                                                </button>
                                            )}
                                        </div>
                                    )}

                                    {/* Additional Angles Grid */}
                                    {additionalImages.length > 0 && (
                                        <div>
                                            <p className="text-sm text-gray-600 mb-3 font-medium">Additional views</p>
                                            <div className="grid grid-cols-2 gap-3">
                                                {additionalImages.map((imgObj, index) => (
                                                    <div
                                                        key={index}
                                                        className="relative"
                                                        onMouseEnter={() => setHoveredImageIndex(index + 1)}
                                                        onMouseLeave={() => setHoveredImageIndex(null)}
                                                    >
                                                        <img
                                                            src={imgObj.url}
                                                            alt={`Angle ${index + 1}`}
                                                            className="w-full rounded-xl object-cover aspect-square border border-gray-200"
                                                        />
                                                        {hoveredImageIndex === index + 1 && (
                                                            <button
                                                                onClick={() => handleDownloadImage(imgObj.url, imgObj.file_name)}
                                                                className="absolute top-3 right-3 bg-black/80 text-white p-2 rounded-lg hover:bg-black transition shadow-lg"
                                                            >
                                                                <Download className="w-4 h-4" />
                                                            </button>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="w-full p-8 overflow-auto">
                        <h1 className="text-2xl mb-6 font-medium">My images</h1>

                        {savedImageSets.length === 0 ? (
                            <div className="flex items-center justify-center h-96">
                                <div className="text-center text-gray-400">
                                    <ImageIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
                                    <p>No saved images yet</p>
                                    <p className="text-sm mt-2">Generated images will appear here after starting a new generation</p>
                                </div>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 gap-8">
                                {savedImageSets.map((imageSet) => (
                                    <div key={imageSet.id} className="border border-gray-200 rounded-2xl p-6">
                                        <div className="mb-4">
                                            <p className="text-sm text-gray-500">
                                                {new Date(imageSet.timestamp).toLocaleString()}
                                            </p>
                                            <p className="text-sm text-gray-800 mt-1 font-medium">{imageSet.prompt}</p>
                                        </div>

                                        <div className="grid grid-cols-3 gap-3">
                                            {/* Hero Image */}
                                            <div className="col-span-2 relative group">
                                                <img
                                                    src={imageSet.heroImage}
                                                    alt="Generated"
                                                    className="w-full rounded-xl object-cover"
                                                />
                                                <button
                                                    onClick={() => handleDownloadImage(imageSet.heroImage)}
                                                    className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 bg-black/80 text-white p-2 rounded-lg hover:bg-black transition shadow-lg"
                                                >
                                                    <Download className="w-4 h-4" />
                                                </button>
                                            </div>

                                            {/* Additional Angles */}
                                            <div className="grid grid-cols-1 gap-3">
                                                {imageSet.additionalImages.slice(0, 2).map((image, index) => (
                                                    <div key={index} className="relative group">
                                                        <img
                                                            src={image}
                                                            alt={`Angle ${index + 1}`}
                                                            className="w-full rounded-xl object-cover aspect-square"
                                                        />
                                                        <button
                                                            onClick={() => handleDownloadImage(image)}
                                                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 bg-black/80 text-white p-2 rounded-lg hover:bg-black transition shadow-lg"
                                                        >
                                                            <Download className="w-3.5 h-3.5" />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        {imageSet.additionalImages.length > 2 && (
                                            <div className="grid grid-cols-4 gap-3 mt-3">
                                                {imageSet.additionalImages.slice(2).map((image, index) => (
                                                    <div key={index} className="relative group">
                                                        <img
                                                            src={image}
                                                            alt={`Angle ${index + 3}`}
                                                            className="w-full rounded-lg object-cover aspect-square"
                                                        />
                                                        <button
                                                            onClick={() => handleDownloadImage(image)}
                                                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 bg-black/80 text-white p-1.5 rounded-lg hover:bg-black transition shadow-lg"
                                                        >
                                                            <Download className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}

export default App;
