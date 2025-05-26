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
import { Combobox } from "@/components/ui/combobox";
import { useFileUpload } from "@/lib/fileUpload";
import { getCurrentDateTime, getCurrentUser } from "@/lib/utils";

export default function TrainingEdit({ training, isOpen, onClose, onSuccess }) {
  const { toast } = useToast();
  const { handleUpload, uploading, error: uploadError } = useFileUpload();
  const [categories, setCategories] = useState([
    "Web Development",
    "Mobile Development",
    "Cloud Computing",
    "DevOps",
    "Data Science",
    "Artificial Intelligence",
    "Cybersecurity",
    "Blockchain",
  ]);

  const [formData, setFormData] = useState({
    title: training.title,
    overview: training.overview,
    courseStructure: training.courseStructure,
    imageUrl: training.imageUrl,
    category: training.category,
    whatYouWillLearn: training.whatYouWillLearn || [{ point: "" }],
  });

  const [loading, setLoading] = useState(false);

  const handleLearningPointChange = (index, value) => {
    const newPoints = [...formData.whatYouWillLearn];
    newPoints[index] = { point: value.trim() };
    setFormData({ ...formData, whatYouWillLearn: newPoints });
  };

  const addLearningPoint = () => {
    if (formData.whatYouWillLearn.length < 4) {
      setFormData({
        ...formData,
        whatYouWillLearn: [...formData.whatYouWillLearn, { point: "" }],
      });
    }
  };

  const removeLearningPoint = (index) => {
    if (formData.whatYouWillLearn.length > 1) {
      const newPoints = formData.whatYouWillLearn.filter((_, i) => i !== index);
      setFormData({ ...formData, whatYouWillLearn: newPoints });
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
    const hasEmptyPoint = formData.whatYouWillLearn.some(
      (point) => !point.point.trim()
    );
    if (hasEmptyPoint) {
      toast({
        title: "Validation Error",
        description: "All learning points are required",
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
      const response = await fetch(`/api/training-courses/${training.trainingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          title: formData.title.trim(),
          overview: formData.overview.trim(),
          courseStructure: formData.courseStructure.trim(),
          imageUrl: formData.imageUrl.trim(),
          whatYouWillLearn: formData.whatYouWillLearn
            .map((point) => ({ point: point.point.trim() }))
            .filter((point) => point.point !== ""),
          updatedAt: getCurrentDateTime(),
          updatedBy: getCurrentUser(),
        }),
      });

      const data = await response.json();
      if (data.success) {
        toast({
          title: "Success",
          description: "Training course updated successfully",
          variant: "success",
        });
        onSuccess();
        onClose();
      } else {
        throw new Error(data.message || "Failed to update training course");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to update training course",
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
          <DialogTitle className="text-2xl">Edit Training Course</DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-8rem)] p-6 pt-4">
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

            {/* Category */}
            <div className="space-y-2">
              <Label htmlFor="category" className="text-base font-medium">
                Category
              </Label>
              <Combobox
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
                options={categories}
                onAddNew={(newCategory) => {
                  setCategories([...categories, newCategory]);
                  setFormData({ ...formData, category: newCategory });
                }}
                placeholder="Select or add category"
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

            {/* What You Will Learn */}
            <div className="space-y-3">
              <Label className="text-base font-medium">What You Will Learn</Label>
              {formData.whatYouWillLearn.map((point, index) => (
                <div key={index} className="flex gap-3 items-center">
                  <Input
                    value={point.point}
                    onChange={(e) =>
                      handleLearningPointChange(index, e.target.value)
                    }
                    placeholder="Enter a learning point"
                    required
                    className="h-12"
                  />
                  {formData.whatYouWillLearn.length > 1 && (
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() => removeLearningPoint(index)}
                      className="shrink-0"
                    >
                      Remove
                    </Button>
                  )}
                </div>
              ))}
              {formData.whatYouWillLearn.length < 4 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={addLearningPoint}
                  className="mt-2"
                >
                  Add Learning Point
                </Button>
              )}
            </div>

            {/* Course Structure */}
            <div className="space-y-2">
              <Label htmlFor="courseStructure" className="text-base font-medium">
                Course Structure
              </Label>
              <Textarea
                id="courseStructure"
                value={formData.courseStructure}
                onChange={(e) =>
                  setFormData({ ...formData, courseStructure: e.target.value })
                }
                required
                className="min-h-[120px] resize-none"
              />
            </div>

            {/* Image Upload */}
            <div className="space-y-3">
              <Label className="text-base font-medium">Course Image</Label>
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
                {loading ? "Updating..." : "Update Course"}
              </Button>
            </div>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}