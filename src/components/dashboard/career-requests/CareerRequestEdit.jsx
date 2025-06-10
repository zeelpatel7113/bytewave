"use client";

import { useState } from "react";
import { useToast } from "@/components/ui/toast";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { getCurrentDateTime } from "@/lib/utils";

export default function CareerRequestEdit({ request, isOpen, onClose, onSuccess }) {
  const { toast } = useToast();
  const [status, setStatus] = useState(
    request?.statusHistory[request.statusHistory.length - 1]?.status || "pending"
  );
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`/api/career-requests/${request.requestId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          status,
          note,
          updatedAt: getCurrentDateTime(),
          updatedBy: "Bytewave Admin",
        }),
      });

      const data = await response.json();
      if (data.success) {
        toast({
          title: "Success",
          description: "Application status updated successfully",
        });
        onSuccess();
        onClose();
      } else {
        throw new Error(data.message || "Failed to update status");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to update application status",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[500px] p-0">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle className="text-xl font-semibold">
            Update Application Status
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-3">
            <Label className="text-base font-medium">Status</Label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="reviewing">Reviewing</SelectItem>
                <SelectItem value="interviewed">Interviewed</SelectItem>
                <SelectItem value="selected">Selected</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <Label className="text-base font-medium">Note</Label>
            <Textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Add a note about this status change"
              required
              className="min-h-[120px] resize-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="px-6"
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={loading}
              className="px-6"
            >
              {loading ? "Updating..." : "Update Status"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}