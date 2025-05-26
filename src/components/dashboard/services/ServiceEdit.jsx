"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FileUpload } from "@/components/ui/file-upload";
import { useFileUpload } from "@/lib/fileUpload";
// Import getCurrentDateTime and getCurrentUser from utils instead of fileUpload
import { getCurrentDateTime, getCurrentUser } from "@/lib/utils";

export default function ServiceEdit({ service, isOpen, onClose, onSuccess }) {
  const { toast } = useToast();
  const { handleUpload, uploading, error: uploadError } = useFileUpload();

  const [formData, setFormData] = useState({
    title: service.title,
    overview: service.overview,
    approach: service.approach,
    imageUrl: service.imageUrl,
    keyBenefits: service.keyBenefits,
  });

  const [loading, setLoading] = useState(false);

  const handleKeyBenefitChange = (index, value) => {
    const newKeyBenefits = [...formData.keyBenefits];
    newKeyBenefits[index] = { point: value.trim() };
    setFormData({ ...formData, keyBenefits: newKeyBenefits });
  };

  const addKeyBenefit = () => {
    if (formData.keyBenefits.length < 4) {
      setFormData({
        ...formData,
        keyBenefits: [...formData.keyBenefits, { point: "" }],
      });
    }
  };

  const removeKeyBenefit = (index) => {
    if (formData.keyBenefits.length > 1) {
      const newKeyBenefits = formData.keyBenefits.filter((_, i) => i !== index);
      setFormData({ ...formData, keyBenefits: newKeyBenefits });
    }
  };

  const handleFileSelect = async (file) => {
    try {
      const fileUrl = await handleUpload(file);
      setFormData((prev) => ({ ...prev, imageUrl: fileUrl }));
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const validateForm = () => {
    const hasEmptyBenefit = formData.keyBenefits.some(
      (benefit) => !benefit.point.trim()
    );
    if (hasEmptyBenefit) {
      toast({
        title: "Validation Error",
        description: "All benefit points are required",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      const response = await fetch(`/api/services/${service.serviceId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          title: formData.title.trim(),
          overview: formData.overview.trim(),
          approach: formData.approach.trim(),
          imageUrl: formData.imageUrl.trim(),
          keyBenefits: formData.keyBenefits
            .map((benefit) => ({ point: benefit.point.trim() }))
            .filter((benefit) => benefit.point !== ""),
          updatedAt: getCurrentDateTime(),
          updatedBy: getCurrentUser(),
        }),
      });

      const data = await response.json();
      if (data.success) {
        toast({
          title: "Success",
          description: "Service updated successfully",
          variant: "success",
        });
        onSuccess();
        onClose();
      } else {
        throw new Error(data.message || "Failed to update service");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to update service",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[800px] max-h-[90vh] p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-2xl">Edit Service</DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-8rem)] p-6 pt-4">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div className="space-y-2">
              <Label htmlFor="title" className="text-base font-medium">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
                className="h-12"
              />
            </div>

            {/* Overview */}
            <div className="space-y-2">
              <Label htmlFor="overview" className="text-base font-medium">Overview</Label>
              <Textarea
                id="overview"
                value={formData.overview}
                onChange={(e) => setFormData({ ...formData, overview: e.target.value })}
                required
                className="min-h-[120px] resize-none"
              />
            </div>

            {/* Key Benefits */}
            <div className="space-y-3">
              <Label className="text-base font-medium">Key Benefits</Label>
              {formData.keyBenefits.map((benefit, index) => (
                <div key={index} className="flex gap-3 items-center">
                  <Input
                    value={benefit.point}
                    onChange={(e) => handleKeyBenefitChange(index, e.target.value)}
                    placeholder="Enter a key benefit"
                    required
                    className="h-12"
                  />
                  {formData.keyBenefits.length > 1 && (
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() => removeKeyBenefit(index)}
                      className="shrink-0"
                    >
                      Remove
                    </Button>
                  )}
                </div>
              ))}
              {formData.keyBenefits.length < 4 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={addKeyBenefit}
                  className="mt-3"
                >
                  Add Benefit
                </Button>
              )}
            </div>

            {/* Approach */}
            <div className="space-y-2">
              <Label htmlFor="approach" className="text-base font-medium">Approach</Label>
              <Textarea
                id="approach"
                value={formData.approach}
                onChange={(e) => setFormData({ ...formData, approach: e.target.value })}
                required
                className="min-h-[120px] resize-none"
              />
            </div>

            {/* Image Upload */}
            <div className="space-y-3">
              <Label className="text-base font-medium">Service Image</Label>
              <FileUpload
                value={formData.imageUrl}
                onChange={handleFileSelect}
                onRemove={() => setFormData((prev) => ({ ...prev, imageUrl: "" }))}
                disabled={loading}
                uploading={uploading}
                accept=".jpg,.jpeg,.png,.webp"
                previewHeight="h-[200px]"
              />
              {uploadError && (
                <p className="text-sm text-red-500 mt-1">{uploadError}</p>
              )}
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose}
                disabled={loading || uploading}
                className="px-6"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={loading || uploading}
                className="px-6"
              >
                {loading ? "Updating..." : "Update Service"}
              </Button>
            </div>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}