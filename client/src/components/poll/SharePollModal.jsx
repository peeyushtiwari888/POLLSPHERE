import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Share2, X, Copy, Check, Globe, Share, Download, QrCode } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { QRCodeCanvas } from 'qrcode.react';

/**
 * Share Poll Modal
 * 
 * Redesigned for a modern SaaS look with a prominent QR Code section.
 */
const SharePollModal = ({ isOpen, onClose, pollId }) => {
  const [copied, setCopied] = useState(false);
  const [showQR, setShowQR] = useState(false); // Toggle between link and QR

  if (!isOpen) return null;

  // Generate the absolute public URL for the poll
  const baseUrl = typeof window !== 'undefined' ? window.location.origin : 'https://pollsphere.com';
  const publicUrl = `${baseUrl}/polls/${pollId || 'demo-123'}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(publicUrl);
      setCopied(true);
      toast.success('Link copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
      toast.error('Failed to copy link');
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Vote on my poll!',
          text: 'Check out this poll and share your opinion.',
          url: publicUrl,
        });
        toast.success('Thanks for sharing!');
      } catch (err) {
        if (err.name !== 'AbortError') {
          console.error('Error sharing:', err);
          toast.error('Failed to share natively');
        }
      }
    } else {
      handleCopy();
    }
  };

  const downloadQRCode = () => {
    const canvas = document.getElementById('qr-code-canvas');
    if (canvas) {
      const pngUrl = canvas
        .toDataURL('image/png')
        .replace('image/png', 'image/octet-stream');
      let downloadLink = document.createElement('a');
      downloadLink.href = pngUrl;
      downloadLink.download = `poll_${pollId}_qrcode.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      toast.success('QR Code downloaded!');
    } else {
      toast.error('Failed to generate QR Code');
    }
  };

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-gray-900/60 dark:bg-black/60 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="relative w-full max-w-md bg-white dark:bg-zinc-900 rounded-[2rem] shadow-2xl overflow-hidden border border-gray-100 dark:border-zinc-800"
          >
            
            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-6 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-orange-50 dark:bg-orange-500/10 flex items-center justify-center text-orange-600 dark:text-orange-500">
                  <Share2 className="w-5 h-5" />
                </div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white">Share Poll</h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Toggle Tabs */}
            <div className="px-6 mb-4">
              <div className="flex p-1 bg-gray-100 dark:bg-zinc-800/50 rounded-xl">
                <button
                  onClick={() => setShowQR(false)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-semibold rounded-lg transition-all ${
                    !showQR 
                      ? 'bg-white dark:bg-zinc-700 text-gray-900 dark:text-white shadow-sm' 
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  <Globe className="w-4 h-4" /> Link
                </button>
                <button
                  onClick={() => setShowQR(true)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-semibold rounded-lg transition-all ${
                    showQR 
                      ? 'bg-white dark:bg-zinc-700 text-gray-900 dark:text-white shadow-sm' 
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                  }`}
                >
                  <QrCode className="w-4 h-4" /> QR Code
                </button>
              </div>
            </div>

            <div className="px-6 pb-6">
              <AnimatePresence mode="wait">
                {!showQR ? (
                  <motion.div
                    key="link"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -10 }}
                    transition={{ duration: 0.15 }}
                    className="space-y-6"
                  >
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Copy the link below and share it with your audience. Anyone with the link can participate.
                    </p>
                    
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        readOnly
                        value={publicUrl}
                        className="w-full h-12 pl-4 pr-4 bg-gray-50 dark:bg-zinc-950 border border-gray-200 dark:border-zinc-800 rounded-xl text-sm text-gray-600 dark:text-gray-400 focus:outline-none select-all"
                      />
                      <button
                        onClick={handleCopy}
                        className={`flex items-center justify-center gap-2 h-12 px-5 rounded-xl font-semibold transition-all flex-shrink-0 ${
                          copied 
                            ? 'bg-green-500 text-white' 
                            : 'bg-orange-500 text-white hover:bg-orange-600 active:scale-95'
                        }`}
                      >
                        {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                      </button>
                    </div>

                    <div className="pt-2">
                      <button 
                        onClick={handleNativeShare}
                        className="flex items-center justify-center gap-2 py-3 w-full bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-500/20 font-medium transition-colors border border-blue-100 dark:border-blue-900/30"
                      >
                        <Share className="w-5 h-5" />
                        Share via Device...
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="qr"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.15 }}
                    className="flex flex-col items-center"
                  >
                    <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-6">
                      Scan this QR code with any camera app to open the poll instantly.
                    </p>
                    
                    <div className="relative p-6 bg-gradient-to-br from-orange-100 to-orange-50 dark:from-orange-500/20 dark:to-orange-900/10 rounded-3xl mb-6">
                      <div className="bg-white p-4 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
                        <QRCodeCanvas 
                          id="qr-code-canvas"
                          value={publicUrl} 
                          size={180}
                          level={"H"}
                          includeMargin={false}
                          bgColor={"#ffffff"}
                          fgColor={"#000000"}
                          className="rounded-lg"
                        />
                      </div>
                    </div>
                    
                    <button
                      onClick={downloadQRCode}
                      className="flex items-center justify-center gap-2 w-full py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 rounded-xl font-semibold transition-all active:scale-95 shadow-sm"
                    >
                      <Download className="w-5 h-5" />
                      Save Image
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );

  return typeof document !== 'undefined' ? createPortal(modalContent, document.body) : modalContent;
};

export default SharePollModal;
