"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/toast";
import { FileUpload } from "@/components/ui/file-upload";
import { Combobox } from "@/components/ui/combobox";
import { useFileUpload } from "@/lib/fileUpload";
import {getCurrentDateTime, getCurrentUser} from "@/lib/utils";
import { get } from "lodash";
const initialFormState = {
  title: "",
  overview: "",
  whatYouWillLearn: [{ point: "" }],
  courseStructure: "",
  category: "",
  imageUrl: "",
};

export default function TrainingForm({ onTrainingCreated }) {
  const { toast } = useToast();
  const { handleUpload, uploading, error: uploadError } = useFileUpload();
  const [formData, setFormData] = useState(initialFormState);
  const [loading, setLoading] = useState(false);
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

  const handleLearningPointChange = (index, value) => {
    const newPoints = [...formData.whatYouWillLearn];
    newPoints[index] = { point: value };
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

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const cleanedData = {
        ...formData,
        title: formData.title.trim(),
        overview: formData.overview.trim(),
        courseStructure: formData.courseStructure.trim(),
        imageUrl: formData.imageUrl.trim(),
        whatYouWillLearn: formData.whatYouWillLearn
          .map((point) => ({
            point: point.point.trim(),
          }))
          .filter((point) => point.point !== ""),
        createdAt: getCurrentDateTime(),
        updatedAt: getCurrentDateTime(),
        createdBy: getCurrentUser(),
      };

      const response = await fetch("/api/training-courses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cleanedData),
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Success",
          description: "Training course created successfully",
          variant: "success",
        });
        setFormData(initialFormState);
        if (onTrainingCreated) {
          onTrainingCreated();
        }
      } else {
        throw new Error(data.message || "Failed to create training course");
      }
    } catch (err) {
      toast({
        title: "Error",
        description: err.message || "Failed to create training course",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="mt-4">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">Add New Training Course</CardTitle>
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

          {/* Submit Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onTrainingCreated()}
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
              {loading ? "Creating..." : "Create Course"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}