import React, { useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Link as LinkIcon, Copy, Download, Share2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const FloatingQRPanel = ({ pollId, isOpen, onClose }) => {
  const joinUrl = `${window.location.origin}/poll/${pollId}`;
  const qrRef = useRef(null);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(joinUrl);
      toast.success('Link copied to clipboard!');
    } catch (err) {
      toast.error('Failed to copy link');
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Join Live Poll',
          text: 'Join my live poll on PollSphere!',
          url: joinUrl,
        });
      } catch (err) {
        console.error('Error sharing', err);
      }
    } else {
      handleCopy();
    }
  };

  const handleDownload = () => {
    if (!qrRef.current) return;
    const svg = qrRef.current.querySelector('svg');
    if (!svg) return;
    
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
      const pngFile = canvas.toDataURL('image/png');
      
      const downloadLink = document.createElement('a');
      downloadLink.download = `poll-${pollId}-qr.png`;
      downloadLink.href = pngFile;
      downloadLink.click();
    };
    
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] flex items-center justify-center bg-gray-900/60 backdrop-blur-md p-4"
        >
          <motion.div 
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
            className="bg-white dark:bg-zinc-900 rounded-3xl p-8 max-w-md w-full shadow-2xl border border-gray-200 dark:border-zinc-800 relative"
          >
            <button 
              onClick={onClose}
              className="absolute top-4 right-4 p-2 text-gray-500 hover:text-gray-900 dark:hover:text-white bg-gray-100 dark:bg-zinc-800 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Scan to Join</h2>
              <p className="text-gray-500 dark:text-gray-400">Point your camera at the QR code to participate in the live event.</p>
            </div>

            <div className="flex justify-center mb-8">
              <div 
                ref={qrRef}
                className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800"
              >
                <QRCodeSVG value={joinUrl} size={220} level="H" includeMargin={true} />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2 bg-gray-50 dark:bg-zinc-800/50 p-3 rounded-xl border border-gray-200 dark:border-zinc-700">
                <LinkIcon className="w-5 h-5 text-gray-400 flex-shrink-0" />
                <div className="flex-1 overflow-hidden">
                  <p className="text-sm font-mono text-gray-900 dark:text-white truncate">
                    {joinUrl.replace(/^https?:\/\//, '')}
                  </p>
                </div>
                <button 
                  onClick={handleCopy}
                  className="p-2 text-gray-500 hover:text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-500/10 rounded-lg transition-colors flex-shrink-0"
                  title="Copy Link"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>

              <div className="flex gap-3">
                <button 
                  onClick={handleDownload}
                  className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 text-gray-900 dark:text-white font-semibold rounded-xl transition-colors"
                >
                  <Download className="w-5 h-5" />
                  Download
                </button>
                <button 
                  onClick={handleShare}
                  className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-xl transition-colors shadow-lg shadow-orange-500/30"
                >
                  <Share2 className="w-5 h-5" />
                  Share
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FloatingQRPanel;
