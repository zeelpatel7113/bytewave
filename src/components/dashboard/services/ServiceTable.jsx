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

export default function ServiceTable({ onEdit }) {
  const { toast } = useToast();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteDialog, setDeleteDialog] = useState({
    isOpen: false,
    service: null,
    loading: false
  });

  const fetchServices = async () => {
    try {
      const response = await fetch("/api/services");
      const data = await response.json();
      if (data.success) {
        setServices(data.data);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch services",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Auto reload data every 30 seconds
  useEffect(() => {
    fetchServices();
    const interval = setInterval(fetchServices, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleDeleteClick = (service) => {
    setDeleteDialog({
      isOpen: true,
      service,
      loading: false
    });
  };

  const handleDeleteConfirm = async () => {
    setDeleteDialog(prev => ({ ...prev, loading: true }));
    
    try {
      const response = await fetch(`/api/services/${deleteDialog.service.serviceId}`, {
        method: "DELETE",
      });
      const data = await response.json();
      
      if (data.success) {
        toast({
          title: "Success",
          description: "Service deleted successfully",
          variant: "success",
        });
        fetchServices();
        setDeleteDialog({ isOpen: false, service: null, loading: false });
      } else {
        throw new Error(data.message || "Failed to delete service");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete service",
        variant: "destructive",
      });
      setDeleteDialog(prev => ({ ...prev, loading: false }));
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
                <TableHead className="w-[300px] px-6">Overview</TableHead>
                <TableHead className="w-[200px] px-6">Created By</TableHead>
                <TableHead className="w-[150px] px-6">Created At</TableHead>
                <TableHead className="w-[150px] px-6">Updated At</TableHead>
                <TableHead className="w-[150px] px-6">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {services.map((service) => (
                <TableRow key={service.serviceId}>
                  <TableCell className="font-medium px-6">{service.title}</TableCell>
                  <TableCell className="px-6">
                    <div className="max-w-[300px] truncate" title={service.overview}>
                      {service.overview}
                    </div>
                  </TableCell>
                  <TableCell className="px-6">{service.createdBy}</TableCell>
                  <TableCell className="px-6">
                    {format(new Date(service.createdAt), "yyyy-MM-dd HH:mm")}
                  </TableCell>
                  <TableCell className="px-6">
                    {format(new Date(service.updatedAt), "yyyy-MM-dd HH:mm")}
                  </TableCell>
                  <TableCell className="px-6">
                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onEdit(service)}
                        className="w-[80px]"
                      >
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteClick(service)}
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

      <Dialog open={deleteDialog.isOpen} onOpenChange={(isOpen) => !isOpen && setDeleteDialog({ isOpen: false, service: null, loading: false })}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Service</DialogTitle>
            <DialogDescription className="pt-4">
              Are you sure you want to delete this service? This action cannot be undone.
              {deleteDialog.service && (
                <p className="mt-2 font-medium text-foreground">{deleteDialog.service.title}</p>
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setDeleteDialog({ isOpen: false, service: null, loading: false })}
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