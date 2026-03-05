"use client";

import React, { useState } from "react";
import UppyUploader from "@/components/uploader/UppyUploader";
import { supabase } from "@/lib/supabase/client";
import { Loader2, CheckCircle2 } from "lucide-react";

export default function AdminUploadPage() {
  const [formData, setFormData] = useState({
    title: "",
    story: "",
    year: "",
    location: "",
    media_type: "image",
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUploadSuccess = async (fileKeys: string[]) => {
    if (fileKeys.length === 0) return;
    
    setIsSubmitting(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      // Create a database entry for each uploaded file
      const inserts = fileKeys.map((key) => ({
        title: formData.title || "Untitled",
        story: formData.story || null,
        year: formData.year ? parseInt(formData.year) : null,
        location: formData.location || null,
        media_type: formData.media_type,
        storage_path: key,
        status: "published", // MVP auto-publish
      }));

      const { error } = await supabase.from("archive_assets").insert(inserts);

      if (error) throw error;

      setSuccessMsg(`Successfully saved ${inserts.length} asset(s) to the archive.`);
      // Optional: reset form
      setFormData({
        title: "",
        story: "",
        year: "",
        location: "",
        media_type: "image",
      });
    } catch (error: any) {
      console.error("Database Error:", error);
      setErrorMsg(error.message || "Failed to save asset metadata in Supabase.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-50 flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8 font-sans text-zinc-900">
      <div className="w-full max-w-3xl bg-white rounded-2xl shadow-sm border border-zinc-200 overflow-hidden">
        
        <div className="px-8 py-6 border-b border-zinc-100">
          <h1 className="text-2xl font-semibold tracking-tight">Archive Deposit</h1>
          <p className="text-sm text-zinc-500 mt-1">
            Upload new media assets and provide archival context.
          </p>
        </div>

        <div className="px-8 py-8 space-y-8">
          {/* Metadata Form */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2 md:col-span-2">
              <label htmlFor="title" className="block text-sm font-medium text-zinc-700">
                Title <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 transition-colors"
                placeholder="e.g. Vintage Street Scene"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="year" className="block text-sm font-medium text-zinc-700">Year</label>
              <input
                type="number"
                id="year"
                name="year"
                value={formData.year}
                onChange={handleInputChange}
                className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 transition-colors"
                placeholder="YYYY"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="location" className="block text-sm font-medium text-zinc-700">Location</label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 transition-colors"
                placeholder="City, Country"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label htmlFor="media_type" className="block text-sm font-medium text-zinc-700">Media Type</label>
              <select
                id="media_type"
                name="media_type"
                value={formData.media_type}
                onChange={handleInputChange}
                className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 transition-colors"
              >
                <option value="image">Image</option>
                <option value="video">Video</option>
                <option value="audio">Audio</option>
              </select>
            </div>

            <div className="space-y-2 md:col-span-2">
              <label htmlFor="story" className="block text-sm font-medium text-zinc-700">Archival Story</label>
              <textarea
                id="story"
                name="story"
                value={formData.story}
                onChange={handleInputChange}
                rows={4}
                className="w-full rounded-md border border-zinc-300 px-3 py-2 text-sm focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 transition-colors"
                placeholder="Describe the historical context or story behind this media..."
              />
            </div>
          </div>

          <div className="pt-6 border-t border-zinc-100">
            <h2 className="text-sm font-medium text-zinc-700 mb-4">Upload Media</h2>
            {/* Uppy Component */}
            <UppyUploader onUploadSuccess={handleUploadSuccess} />
          </div>

          {/* Status Messages */}
          {isSubmitting && (
            <div className="flex items-center text-zinc-500 text-sm mt-4">
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving metadata to archive...
            </div>
          )}
          
          {successMsg && (
            <div className="flex items-center text-green-700 bg-green-50 px-4 py-3 rounded-md text-sm mt-4 border border-green-200">
              <CheckCircle2 className="w-4 h-4 mr-2 text-green-600" />
              {successMsg}
            </div>
          )}

          {errorMsg && (
            <div className="text-red-600 bg-red-50 px-4 py-3 rounded-md text-sm mt-4 border border-red-200">
              {errorMsg}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
