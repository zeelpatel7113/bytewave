import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { useToast } from "@/components/ui/toast";

export const DeleteBlogDialog = ({ open, onOpenChange, blogId, onDeleted }) => {
  const { toast } = useToast();

  const handleDelete = async () => {
    try {
      await axios.delete(`/api/blogs?id=${blogId}`);
      toast({ title: "Deleted", description: "Blog deleted successfully." });
      onDeleted(blogId);
      onOpenChange(false);
    } catch (err) {
      console.log(err);
      toast({ title: "Error", description: "Failed to delete blog.", variant: "destructive" });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Confirm Delete</DialogTitle>
        </DialogHeader>
        <p>Are you sure you want to delete this blog? This action cannot be undone.</p>
        <DialogFooter className="flex justify-end gap-2 mt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button variant="destructive" onClick={handleDelete}>Delete</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
