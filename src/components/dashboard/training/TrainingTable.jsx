"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { format } from "date-fns";

export default function TrainingTable({ onEdit }) {
  const { toast } = useToast();
  const [trainings, setTrainings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialog, setDeleteDialog] = useState({
    isOpen: false,
    training: null,
    loading: false,
  });

  const fetchTrainings = async () => {
    try {
      const response = await fetch("/api/training-courses");
      const data = await response.json();
      if (data.success) {
        setTrainings(data.data);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch training courses",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Auto reload data every 30 seconds
  useEffect(() => {
    fetchTrainings();
    const interval = setInterval(fetchTrainings, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleDeleteClick = (training) => {
    setDeleteDialog({
      isOpen: true,
      training,
      loading: false,
    });
  };

  const handleDeleteConfirm = async () => {
    setDeleteDialog((prev) => ({ ...prev, loading: true }));

    try {
      const response = await fetch(
        `/api/training-courses/${deleteDialog.training.trainingId}`,
        {
          method: "DELETE",
        }
      );
      const data = await response.json();

      if (data.success) {
        toast({
          title: "Success",
          description: "Training course deleted successfully",
          variant: "success",
        });
        fetchTrainings();
        setDeleteDialog({ isOpen: false, training: null, loading: false });
      } else {
        throw new Error(data.message || "Failed to delete training course");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete training course",
        variant: "destructive",
      });
      setDeleteDialog((prev) => ({ ...prev, loading: false }));
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="rounded-md border overflow-x-auto">
        <div className="min-w-[1200px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[250px] px-6">Title</TableHead>
                <TableHead className="w-[200px] px-6">Category</TableHead>
                <TableHead className="w-[300px] px-6">Overview</TableHead>
                <TableHead className="w-[200px] px-6">Created By</TableHead>
                <TableHead className="w-[150px] px-6">Created At</TableHead>
                <TableHead className="w-[150px] px-6">Updated At</TableHead>
                <TableHead className="w-[150px] px-6">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {trainings.map((training) => (
                <TableRow key={training.trainingId}>
                  <TableCell className="font-medium px-6">
                    {training.title}
                  </TableCell>
                  <TableCell className="px-6">{training.category}</TableCell>
                  <TableCell className="px-6">
                    <div
                      className="max-w-[300px] truncate"
                      title={training.overview}
                    >
                      {training.overview}
                    </div>
                  </TableCell>
                  <TableCell className="px-6">{training.createdBy}</TableCell>
                  <TableCell className="px-6">
                    {format(new Date(training.createdAt), "yyyy-MM-dd HH:mm")}
                  </TableCell>
                  <TableCell className="px-6">
                    {format(new Date(training.updatedAt), "yyyy-MM-dd HH:mm")}
                  </TableCell>
                  <TableCell className="px-6">
                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEdit(training)}
                        className="w-[80px]"
                      >
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteClick(training)}
                        className="w-[80px]"
                      >
                        Delete
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <Dialog
        open={deleteDialog.isOpen}
        onOpenChange={(isOpen) =>
          !isOpen &&
          setDeleteDialog({ isOpen: false, training: null, loading: false })
        }
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Training Course</DialogTitle>
          </DialogHeader>

          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              Are you sure you want to delete this training course? This action
              cannot be undone.
            </p>
            {deleteDialog.training && (
              <p className="mt-2 font-medium text-foreground">
                {deleteDialog.training.title}
              </p>
            )}
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() =>
                setDeleteDialog({
                  isOpen: false,
                  training: null,
                  loading: false,
                })
              }
              disabled={deleteDialog.loading}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              disabled={deleteDialog.loading}
            >
              {deleteDialog.loading ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
