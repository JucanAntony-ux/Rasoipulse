import React, { useState, useRef } from "react";
import {
  UploadCloud,
  FileText,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  X,
  Camera
} from "lucide-react";
import { api } from "../lib/api";

export default function RegisterScannerCard({ onItemsUpdated, userId }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [message, setMessage] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
        setMessage({ type: "error", text: "Please select a valid image (JPEG, PNG, WEBP)." });
        return;
      }
      if (file.size > 8 * 1024 * 1024) {
        setMessage({ type: "error", text: "Image file exceeds maximum 8MB limit." });
        return;
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setMessage(null);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file) {
      if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
        setMessage({ type: "error", text: "Please drop a valid image (JPEG, PNG, WEBP)." });
        return;
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setMessage(null);
    }
  };

  const handleClear = () => {
    setSelectedFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setMessage(null);
  };

  const handleScan = async () => {
    if (!selectedFile) return;

    setScanning(true);
    setMessage(null);

    try {
      const result = await api.scanRegister(selectedFile, userId);
      setMessage({
        type: "success",
        text: `Extracted ${result.extracted_count} items from register via Gemini 2.5 Flash!`
      });
      if (onItemsUpdated) {
        onItemsUpdated(result.items);
      }
    } catch (err) {
      setMessage({
        type: "error",
        text: err.message || "Failed to scan handwritten register."
      });
    } finally {
      setScanning(false);
    }
  };

  const handleReset = async () => {
    setResetting(true);
    setMessage(null);
    try {
      const result = await api.resetMenu(userId);
      setMessage({ type: "success", text: "Menu restored to 6 default cloud kitchen items." });
      if (onItemsUpdated) {
        onItemsUpdated(result.items);
      }
      handleClear();
    } catch (err) {
      setMessage({ type: "error", text: "Failed to reset menu." });
    } finally {
      setResetting(false);
    }
  };

  return (
    <div className="glass-panel rounded-2xl p-5 border border-slate-800 shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center text-orange-400">
            <Camera className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100 flex items-center gap-1.5">
              Digitize Daily Register
              <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Gemini Vision OCR
              </span>
            </h3>
            <p className="text-xs text-slate-400">Scan messy handwritten sales & waste log</p>
          </div>
        </div>

        <button
          onClick={handleReset}
          disabled={resetting}
          title="Reset back to default 6 items"
          className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors"
        >
          <RotateCcw className={`w-3 h-3 ${resetting ? "animate-spin" : ""}`} />
          Reset Menu
        </button>
      </div>

      {/* Upload Dropzone / Preview */}
      {!previewUrl ? (
        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className="border-2 border-dashed border-slate-700 hover:border-orange-500/60 rounded-xl p-5 text-center cursor-pointer transition-colors bg-slate-900/40 hover:bg-slate-900/70 group"
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={handleFileChange}
          />
          <div className="w-10 h-10 rounded-full bg-slate-800 group-hover:bg-orange-500/20 text-slate-400 group-hover:text-orange-400 mx-auto flex items-center justify-center transition-colors mb-2">
            <UploadCloud className="w-5 h-5" />
          </div>
          <p className="text-xs font-semibold text-slate-200">
            Click to upload or drag & drop handwritten register
          </p>
          <p className="text-[11px] text-slate-500 mt-1">JPEG, PNG, WEBP (Max 8MB)</p>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="relative rounded-xl overflow-hidden border border-slate-700 bg-slate-900">
            <img
              src={previewUrl}
              alt="Handwritten register preview"
              className="w-full h-36 object-cover"
            />
            <button
              onClick={handleClear}
              className="absolute top-2 right-2 p-1 rounded-full bg-slate-950/80 text-slate-300 hover:text-white border border-slate-700"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-slate-950/80 border border-slate-800 text-[10px] text-slate-300 flex items-center gap-1">
              <FileText className="w-3 h-3 text-orange-400" />
              {selectedFile?.name}
            </div>
          </div>

          <button
            onClick={handleScan}
            disabled={scanning}
            className="w-full py-2.5 px-4 rounded-xl font-bold text-xs text-white bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-orange-500/20 flex items-center justify-center gap-2 transition-all"
          >
            {scanning ? (
              <>
                <Sparkles className="w-4 h-4 animate-spin" />
                Extracting Handwritten Rows (Gemini 2.5 Flash)...
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                Extract & Sync Log to Inventory
              </>
            )}
          </button>
        </div>
      )}

      {/* Message Feedback */}
      {message && (
        <div
          className={`mt-3 p-2.5 rounded-lg text-xs flex items-center gap-2 ${
            message.type === "success"
              ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
              : "bg-rose-500/10 text-rose-400 border border-rose-500/20"
          }`}
        >
          {message.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0" />
          )}
          <span>{message.text}</span>
        </div>
      )}
    </div>
  );
}
