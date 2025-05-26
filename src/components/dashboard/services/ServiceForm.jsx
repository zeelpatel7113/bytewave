"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/toast";
import { FileUpload } from "@/components/ui/file-upload";
import { useFileUpload } from "@/lib/fileUpload";
import {getCurrentDateTime, getCurrentUser} from "@/lib/utils"
const initialFormState = {
  title: "",
  overview: "",
  keyBenefits: [{ point: "" }],
  approach: "",
  imageUrl: "",
};

export default function ServiceForm({ onServiceCreated }) {
  const { toast } = useToast();
  const { handleUpload, uploading, error: uploadError } = useFileUpload();
  const [formData, setFormData] = useState(initialFormState);
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

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const currentDateTime = getCurrentDateTime();

      const cleanedData = {
        ...formData,
        title: formData.title.trim(),
        overview: formData.overview.trim(),
        approach: formData.approach.trim(),
        imageUrl: formData.imageUrl.trim(),
        keyBenefits: formData.keyBenefits
          .map((benefit) => ({
            point: benefit.point.trim(),
          }))
          .filter((benefit) => benefit.point !== ""),
        createdAt: currentDateTime,
        updatedAt: currentDateTime,
        createdBy: getCurrentUser(),
      };

      const response = await fetch("/api/services", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cleanedData),
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Success",
          description: "Service created successfully",
          variant: "success",
        });
        setFormData(initialFormState);
        if (onServiceCreated) {
          onServiceCreated();
        }
      } else {
        throw new Error(data.message || "Failed to create service");
      }
    } catch (err) {
      toast({
        title: "Error",
        description: err.message || "Failed to create service",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="mt-4">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">Add New Service</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title" className="text-base font-medium">
              Title
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) =>
                setFormData({ ...formData, title: e.target.value })
              }
              required
              className="h-12"
            />
          </div>

          {/* Overview */}
          <div className="space-y-2">
            <Label htmlFor="overview" className="text-base font-medium">
              Overview
            </Label>
            <Textarea
              id="overview"
              value={formData.overview}
              onChange={(e) =>
                setFormData({ ...formData, overview: e.target.value })
              }
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
                  onChange={(e) =>
                    handleKeyBenefitChange(index, e.target.value)
                  }
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
                className="mt-2"
              >
                Add Benefit
              </Button>
            )}
          </div>

          {/* Approach */}
          <div className="space-y-2">
            <Label htmlFor="approach" className="text-base font-medium">
              Approach
            </Label>
            <Textarea
              id="approach"
              value={formData.approach}
              onChange={(e) =>
                setFormData({ ...formData, approach: e.target.value })
              }
              required
              className="min-h-[120px] resize-none"
            />
          </div>

          {/* Image Upload (Updated) */}
          <div className="space-y-3">
            <Label className="text-base font-medium">Service Image</Label>
            <FileUpload
              value={formData.imageUrl}
              onChange={handleFileSelect}
              onRemove={() =>
                setFormData((prev) => ({ ...prev, imageUrl: "" }))
              }
              disabled={loading}
              uploading={uploading}
              accept=".jpg,.jpeg,.png,.webp"
              previewHeight="h-[200px]"
            />
            {uploadError && (
              <p className="text-sm text-red-500 mt-1">{uploadError}</p>
            )}
          </div>

          {/* Submit Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onServiceCreated()}
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
              {loading ? "Creating..." : "Create Service"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
