'use client';

import { useState, useRef, useEffect } from 'react';
import { Camera, X, RotateCcw, Check } from 'lucide-react';

interface CameraCaptureProps {
  onCapture: (imageData: string) => void;
  onClose: () => void;
}

export default function CameraCapture({ onCapture, onClose }: CameraCaptureProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment');

  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, [facingMode]);

  const startCamera = async () => {
    try {
      setError(null);
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: facingMode,
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
      setStream(mediaStream);
    } catch (err) {
      console.error('Camera error:', err);
      setError('Unable to access camera. Please grant camera permissions or use file upload.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;

      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0);
        const imageData = canvas.toDataURL('image/jpeg', 0.9);
        setCapturedImage(imageData);
      }
    }
  };

  const retake = () => {
    setCapturedImage(null);
  };

  const confirmCapture = () => {
    if (capturedImage) {
      onCapture(capturedImage);
      stopCamera();
      onClose();
    }
  };

  const switchCamera = () => {
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
      {/* Close button */}
      <button
        onClick={() => {
          stopCamera();
          onClose();
        }}
        className="absolute top-4 right-4 z-10 w-12 h-12 bg-white/10 backdrop-blur text-white rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
      >
        <X className="w-6 h-6" />
      </button>

      {error ? (
        <div className="text-center p-8">
          <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Camera className="w-10 h-10 text-red-400" />
          </div>
          <h3 className="text-white text-xl font-semibold mb-2">Camera Access Denied</h3>
          <p className="text-gray-300 mb-6 max-w-md">{error}</p>
          <button
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="bg-white text-gray-900 px-6 py-3 rounded-lg font-medium"
          >
            Use File Upload Instead
          </button>
        </div>
      ) : (
        <div className="relative w-full h-full max-w-4xl max-h-screen">
          {/* Video preview or captured image */}
          <div className="relative w-full h-full flex items-center justify-center">
            {capturedImage ? (
              <img
                src={capturedImage}
                alt="Captured"
                className="max-w-full max-h-full object-contain"
              />
            ) : (
              <>
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="max-w-full max-h-full object-contain"
                />
                {/* Camera guide overlay */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="border-4 border-gold-400 border-dashed rounded-2xl w-4/5 h-4/5 opacity-50"></div>
                </div>
              </>
            )}
          </div>

          {/* Hidden canvas for capture */}
          <canvas ref={canvasRef} className="hidden" />

          {/* Controls */}
          <div className="absolute bottom-8 left-0 right-0 flex items-center justify-center gap-4">
            {capturedImage ? (
              <>
                <button
                  onClick={retake}
                  className="bg-white/10 backdrop-blur text-white px-6 py-3 rounded-full font-medium flex items-center gap-2 hover:bg-white/20 transition-colors"
                >
                  <RotateCcw className="w-5 h-5" />
                  Retake
                </button>
                <button
                  onClick={confirmCapture}
                  className="gradient-gold text-white px-8 py-3 rounded-full font-medium flex items-center gap-2 shadow-gold hover:shadow-xl transition-all"
                >
                  <Check className="w-5 h-5" />
                  Use This Photo
                </button>
              </>
            ) : (
              <>
                {/* Switch camera button */}
                <button
                  onClick={switchCamera}
                  className="bg-white/10 backdrop-blur text-white w-12 h-12 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
                >
                  <RotateCcw className="w-6 h-6" />
                </button>

                {/* Capture button */}
                <button
                  onClick={capturePhoto}
                  className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-xl hover:scale-105 transition-transform"
                >
                  <div className="w-16 h-16 border-4 border-gray-900 rounded-full"></div>
                </button>

                <div className="w-12 h-12"></div>
              </>
            )}
          </div>

          {/* Instruction text */}
          {!capturedImage && (
            <div className="absolute top-8 left-0 right-0 text-center">
              <p className="text-white text-lg font-medium bg-black/50 backdrop-blur px-6 py-3 rounded-full inline-block">
                Center your item in the frame
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
