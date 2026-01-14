import React, { useState } from "react";
import { Plus, Loader2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

export const DynamicSelect = ({
  label,
  value,
  placeholder,
  options,
  onValueChange,
  onAddNew,
  isLoading = false,
  required = false,
  disabled = false,
}) => {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newValue, setNewValue] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  const handleAddNew = async (e) => {
    e.preventDefault();
    if (!newValue.trim()) return;

    setIsAdding(true);
    try {
      await onAddNew(newValue.trim());
      setNewValue("");
      setIsAddDialogOpen(false);
    } catch (error) {
      console.log("Error adding new value:", error);
    } finally {
      setIsAdding(false);
    }
  };

  const handleSubmit = () => {
    if (newValue.trim()) {
      handleAddNew({ preventDefault: () => {} });
    }
  };

  return (
    <>
      <div className="space-y-1">
        <Label className="text-sm font-medium text-text-primary">
          {label} {required && <span className="text-red-500">*</span>}
        </Label>
        <Select
          value={value}
          onValueChange={onValueChange}
          disabled={disabled || isLoading}
        >
          <SelectTrigger className="border-input-border w-full focus:border-primary-600 bg-input">
            <SelectValue placeholder={placeholder} />
          </SelectTrigger>
          <SelectContent className="bg-background">
            {options.map((option) => (
              <SelectItem
                className="hover:bg-primary-50 cursor-pointer text-text-secondary"
                key={option.value}
                value={option.value}
              >
                {option.label}
              </SelectItem>
            ))}
            <div className="px-2 py-1 border-t">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setIsAddDialogOpen(true)}
                className="w-full justify-start text-primary-600 hover:bg-primary-50 h-8"
              >
                <Plus className="h-3.5 w-3.5 mr-1.5" />
                Add New {label}
              </Button>
            </div>
          </SelectContent>
        </Select>
      </div>

      <Dialog
        modal={true}
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
      >
        <DialogContent
          onPointerDownOutside={(e) => e.preventDefault()}
          onInteractOutside={(e) => e.preventDefault()}
          className="max-w-md"
        >
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-text-primary">
              Add New {label}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-1">
              <Label className="text-sm font-medium text-text-primary">
                {label}'s Value <span className="text-red-500">*</span>
              </Label>
              <Input
                value={newValue}
                onChange={(e) => setNewValue(e.target.value)}
                placeholder={`Enter new ${label.toLowerCase()}`}
                className="border-input-border focus:border-primary-600 bg-input"
                disabled={isAdding}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleSubmit();
                  }
                }}
              />
            </div>

            <div className="flex flex-col sm:flex-row sm:justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsAddDialogOpen(false);
                  setNewValue("");
                }}
                disabled={isAdding}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={handleSubmit}
                disabled={isAdding || !newValue.trim()}
                className="w-full sm:w-auto bg-black text-white"
              >
                {isAdding ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Adding...
                  </>
                ) : (
                  `Add ${label}`
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
