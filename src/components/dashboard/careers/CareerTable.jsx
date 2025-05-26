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
import { Badge } from "@/components/ui/badge";

export default function CareerTable({ onEdit }) {
  const { toast } = useToast();
  const [careers, setCareers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialog, setDeleteDialog] = useState({
    isOpen: false,
    career: null,
    loading: false,
  });

  const fetchCareers = async () => {
    try {
      // Only fetch active career positions
      const response = await fetch("/api/career-posting?isActive=true");
      const data = await response.json();
      if (data.success) {
        setCareers(data.data);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch career positions",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Auto reload data every 30 seconds
  useEffect(() => {
    fetchCareers();
    const interval = setInterval(fetchCareers, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleDeleteClick = (career) => {
    setDeleteDialog({
      isOpen: true,
      career,
      loading: false,
    });
  };

  const handleDeleteConfirm = async () => {
    setDeleteDialog((prev) => ({ ...prev, loading: true }));

    try {
      // Perform hard delete
      const response = await fetch(
        `/api/career-posting/${deleteDialog.career._id}`,
        {
          method: "DELETE",
        }
      );
      const data = await response.json();

      if (data.success) {
        toast({
          title: "Success",
          description: "Career position deleted successfully",
          variant: "success",
        });
        // Remove the deleted item from the local state
        setCareers(careers.filter(c => c._id !== deleteDialog.career._id));
        setDeleteDialog({ isOpen: false, career: null, loading: false });
      } else {
        throw new Error(data.message || "Failed to delete career position");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete career position",
        variant: "destructive",
      });
      setDeleteDialog((prev) => ({ ...prev, loading: false }));
    }
  };

  const getExperienceLevelBadgeVariant = (level) => {
    const variants = {
      senior: "default",
      "mid-senior": "secondary",
      mid: "outline",
      "entry-level": "destructive",
      intern: "warning",
    };
    return variants[level] || "default";
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
                <TableHead className="w-[200px] px-6">Position</TableHead>
                <TableHead className="w-[150px] px-6">Career Type</TableHead>
                <TableHead className="w-[150px] px-6">Experience</TableHead>
                <TableHead className="w-[150px] px-6">Project Type</TableHead>
                <TableHead className="w-[100px] px-6">Location</TableHead>
                <TableHead className="w-[200px] px-6">Core Skills</TableHead>
                <TableHead className="w-[150px] px-6">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {careers.map((career) => (
                <TableRow key={career._id}>
                  <TableCell className="font-medium px-6">
                    {career.position}
                  </TableCell>
                  <TableCell className="px-6">{career.careerType}</TableCell>
                  <TableCell className="px-6">
                    <Badge variant={getExperienceLevelBadgeVariant(career.experienceLevel)}>
                      {career.experienceRange}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-6">{career.projectType}</TableCell>
                  <TableCell className="px-6">{career.jobLocation}</TableCell>
                  <TableCell className="px-6">
                    <div className="flex flex-wrap gap-1">
                      {career.coreSkills.map((skill, index) => (
                        <Badge key={index} variant="outline">
                          {skill.skill}
                        </Badge>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="px-6">
                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEdit(career)}
                        className="w-[80px]"
                      >
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteClick(career)}
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
          setDeleteDialog({ isOpen: false, career: null, loading: false })
        }
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Career Position</DialogTitle>
          </DialogHeader>

          <div className="py-4">
            <DialogDescription className="text-sm text-muted-foreground">
              Are you sure you want to delete this career position? This action
              cannot be undone.
            </DialogDescription>
            {deleteDialog.career && (
              <p className="mt-2 font-medium text-foreground">
                {deleteDialog.career.position} - {deleteDialog.career.careerType}
              </p>
            )}
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() =>
                setDeleteDialog({
                  isOpen: false,
                  career: null,
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