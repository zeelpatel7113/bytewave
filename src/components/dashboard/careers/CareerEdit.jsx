"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/toast";
import { useEffect } from "react";
import { Combobox } from "@/components/ui/combobox";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getCurrentDateTime, getCurrentUser } from "@/lib/utils";

const experienceLevels = [
  { value: "senior", label: "Senior (7+ years)" },
  { value: "mid-senior", label: "Mid-Senior (4-7 years)" },
  { value: "mid", label: "Mid (2-4 years)" },
  { value: "entry-level", label: "Entry Level (1 year)" },
  { value: "intern", label: "Intern (No experience)" },
];

const projectTypes = [
  { value: "full-time", label: "Full Time" },
  { value: "contract", label: "Contract" },
  { value: "part-time", label: "Part Time" },
  { value: "internship", label: "Internship" },
];

const jobLocations = [
  { value: "remote", label: "Remote" },
  { value: "hybrid", label: "Hybrid" },
  { value: "onsite", label: "On-site" },
];

export default function CareerEdit({ career, isOpen, onClose, onSuccess }) {
  const [careerTypes, setCareerTypes] = useState([]);
  const [isLoadingTypes, setIsLoadingTypes] = useState(true);
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    careerType: career.careerType,
    position: career.position,
    description: career.description,
    experienceLevel: career.experienceLevel,
    coreSkills: career.coreSkills || [{ skill: "" }],
    projectType: career.projectType,
    jobLocation: career.jobLocation,
  });

  const [loading, setLoading] = useState(false);

  const handleSkillChange = (index, value) => {
    const newSkills = [...formData.coreSkills];
    newSkills[index] = { skill: value };
    setFormData({ ...formData, coreSkills: newSkills });
  };

  const addSkill = () => {
    setFormData({
      ...formData,
      coreSkills: [...formData.coreSkills, { skill: "" }],
    });
  };

  const removeSkill = (index) => {
    if (formData.coreSkills.length > 1) {
      const newSkills = formData.coreSkills.filter((_, i) => i !== index);
      setFormData({ ...formData, coreSkills: newSkills });
    }
  };

  const validateForm = () => {
    const hasEmptySkill = formData.coreSkills.some(
      (skill) => !skill.skill.trim()
    );
    if (hasEmptySkill) {
      toast({
        title: "Validation Error",
        description: "All skills are required",
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
      const response = await fetch(`/api/career-posting/${career._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          careerType: formData.careerType.trim(),
          position: formData.position.trim(),
          description: formData.description.trim(),
          coreSkills: formData.coreSkills
            .map((skill) => ({ skill: skill.skill.trim() }))
            .filter((skill) => skill.skill !== ""),
          updatedAt: getCurrentDateTime(),
          updatedBy: getCurrentUser(),
        }),
      });

      const data = await response.json();
      if (data.success) {
        toast({
          title: "Success",
          description: "Career position updated successfully",
          variant: "success",
        });
        onSuccess();
        onClose();
      } else {
        throw new Error(data.message || "Failed to update career position");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to update career position",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    const fetchCareerTypes = async () => {
      try {
        setIsLoadingTypes(true);
        const response = await fetch("/api/career-types");
        const data = await response.json();
        if (data.success) {
          // Keep as simple string array
          const uniqueTypes = Array.from(new Set(data.data)).filter(Boolean);
          setCareerTypes(uniqueTypes);
        }
      } catch (error) {
        console.error("Failed to fetch career types:", error);
      } finally {
        setIsLoadingTypes(false);
      }
    };

    fetchCareerTypes();
  }, []);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[800px] max-h-[90vh] p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="text-2xl">Edit Career Position</DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(90vh-8rem)] p-6 pt-4">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Career Type and Position */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="careerType" className="text-base font-medium">
                  Career Type
                </Label>
                <Combobox
                  options={careerTypes}
                  value={formData.careerType}
                  onValueChange={(value) => {
                    setFormData({ ...formData, careerType: value });
                  }}
                  onAddNew={(newValue) => {
                    setCareerTypes([...careerTypes, newValue]);
                    setFormData({ ...formData, careerType: newValue });
                  }}
                  placeholder="Select or enter career type"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="position" className="text-base font-medium">
                  Position
                </Label>
                <Input
                  id="position"
                  value={formData.position}
                  onChange={(e) =>
                    setFormData({ ...formData, position: e.target.value })
                  }
                  required
                  className="h-12"
                />
              </div>
            </div>

            {/* Experience Level and Project Type */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="experienceLevel"
                  className="text-base font-medium"
                >
                  Experience Level
                </Label>
                <Select
                  value={formData.experienceLevel}
                  onValueChange={(value) =>
                    setFormData({ ...formData, experienceLevel: value })
                  }
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select experience level" />
                  </SelectTrigger>
                  <SelectContent>
                    {experienceLevels.map((level) => (
                      <SelectItem key={level.value} value={level.value}>
                        {level.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="projectType" className="text-base font-medium">
                  Project Type
                </Label>
                <Select
                  value={formData.projectType}
                  onValueChange={(value) =>
                    setFormData({ ...formData, projectType: value })
                  }
                  required
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select project type" />
                  </SelectTrigger>
                  <SelectContent>
                    {projectTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-base font-medium">
                Description
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                required
                className="min-h-[120px] resize-none"
              />
            </div>

            {/* Core Skills */}
            <div className="space-y-3">
              <Label className="text-base font-medium">Core Skills</Label>
              {formData.coreSkills.map((skill, index) => (
                <div key={index} className="flex gap-3 items-center">
                  <Input
                    value={skill.skill}
                    onChange={(e) => handleSkillChange(index, e.target.value)}
                    placeholder="Enter a required skill"
                    required
                    className="h-12"
                  />
                  {formData.coreSkills.length > 1 && (
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() => removeSkill(index)}
                      className="shrink-0"
                    >
                      Remove
                    </Button>
                  )}
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={addSkill}
                className="mt-2"
              >
                Add Skill
              </Button>
            </div>

            {/* Job Location */}
            <div className="space-y-2">
              <Label htmlFor="jobLocation" className="text-base font-medium">
                Job Location
              </Label>
              <Select
                value={formData.jobLocation}
                onValueChange={(value) =>
                  setFormData({ ...formData, jobLocation: value })
                }
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select job location" />
                </SelectTrigger>
                <SelectContent>
                  {jobLocations.map((location) => (
                    <SelectItem key={location.value} value={location.value}>
                      {location.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={loading}
                className="px-6"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading} className="px-6">
                {loading ? "Updating..." : "Update Position"}
              </Button>
            </div>
          </form>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
