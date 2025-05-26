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
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Info, FileText, ExternalLink } from "lucide-react";

const statusColors = {
  pending: "bg-yellow-500",
  reviewing: "bg-blue-500",
  interviewed: "bg-purple-500",
  selected: "bg-green-500",
  rejected: "bg-red-500",
};

export default function CareerRequestTable({ setEditRequest }) {
  const { toast } = useToast();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({
    isOpen: false,
    request: null,
    loading: false,
  });

  const fetchRequests = async () => {
    try {
      const response = await fetch("/api/career-requests");
      const data = await response.json();
      if (data.success && Array.isArray(data.data)) {
        setRequests(data.data);
      } else {
        setRequests([]);
        console.error("Invalid data format received:", data);
      }
    } catch (error) {
      console.error("Error fetching requests:", error);
      setRequests([]);
      toast({
        title: "Error",
        description: "Failed to fetch career applications",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRequests();
    const interval = setInterval(fetchRequests, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleDeleteClick = (request) => {
    setDeleteDialog({
      isOpen: true,
      request,
      loading: false,
    });
  };

  const handleDeleteConfirm = async () => {
    setDeleteDialog((prev) => ({ ...prev, loading: true }));

    try {
      const response = await fetch(
        `/api/career-requests/${deleteDialog.request.requestId}`,
        {
          method: "DELETE",
        }
      );
      const data = await response.json();

      if (data.success) {
        toast({
          title: "Success",
          description: "Career application deleted successfully",
        });
        fetchRequests();
        setDeleteDialog({ isOpen: false, request: null, loading: false });
      } else {
        throw new Error(data.message || "Failed to delete application");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete application",
        variant: "destructive",
      });
      setDeleteDialog((prev) => ({ ...prev, loading: false }));
    }
  };

  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), "yyyy-MM-dd HH:mm:ss");
    } catch (error) {
      console.error("Date formatting error:", error);
      return "Invalid Date";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-md border overflow-x-auto">
        <div className="min-w-[1400px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px] px-6">Name</TableHead>
                <TableHead className="w-[250px] px-6">Email</TableHead>
                <TableHead className="w-[150px] px-6">Phone</TableHead>
                <TableHead className="w-[150px] px-6">Experience</TableHead>
                <TableHead className="w-[200px] px-6">Position</TableHead>
                <TableHead className="w-[150px] px-6">Status</TableHead>
                <TableHead className="w-[150px] px-6">Created At</TableHead>
                <TableHead className="w-[200px] px-6">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.isArray(requests) && requests.map((request) => {
                const rowKey = request?.requestId || request?._id || `row-${Math.random()}`;
                const currentStatus = request?.statusHistory?.[request.statusHistory?.length - 1]?.status || "pending";
                
                return (
                  <TableRow key={rowKey}>
                    <TableCell className="font-medium px-6">{request?.name || 'N/A'}</TableCell>
                    <TableCell className="px-6">{request?.email || 'N/A'}</TableCell>
                    <TableCell className="px-6">{request?.phone || 'N/A'}</TableCell>
                    <TableCell className="px-6">
                      {request?.experience ? `${request.experience} years` : 'N/A'}
                    </TableCell>
                    <TableCell className="px-6">
                      {request?.careerId?.position || 'N/A'}
                    </TableCell>
                    <TableCell className="px-6">
                      <Badge className={statusColors[currentStatus]}>
                        {currentStatus}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-6">
                      {request?.createdAt ? formatDate(request.createdAt) : 'N/A'}
                    </TableCell>
                    <TableCell className="px-6">
                      <div className="flex gap-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setSelectedRequest(request)}
                          className="w-[80px]"
                        >
                          <Info className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditRequest(request)}
                          className="w-[80px]"
                        >
                          Edit
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => handleDeleteClick(request)}
                          className="w-[80px]"
                        >
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Details Dialog */}
      <Dialog
        open={!!selectedRequest}
        onOpenChange={() => setSelectedRequest(null)}
      >
        <DialogContent className="max-w-[700px] max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Application Details</DialogTitle>
          </DialogHeader>
          {selectedRequest && (
            <ScrollArea className="h-[calc(80vh-100px)] pr-4">
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium">Name</h4>
                    <p className="text-sm text-muted-foreground">
                      {selectedRequest.name}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Email</h4>
                    <p className="text-sm text-muted-foreground">
                      {selectedRequest.email}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Phone</h4>
                    <p className="text-sm text-muted-foreground">
                      {selectedRequest.phone}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Experience</h4>
                    <p className="text-sm text-muted-foreground">
                      {selectedRequest.experience} years
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Position</h4>
                    <p className="text-sm text-muted-foreground">
                      {selectedRequest.careerId?.position || 'N/A'}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Resume</h4>
                    {selectedRequest.resumeUrl ? (
                      <a
                        href={selectedRequest.resumeUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-500 hover:text-blue-700 flex items-center gap-1"
                      >
                        <FileText className="h-4 w-4" />
                        View Resume
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    ) : (
                      <p className="text-sm text-muted-foreground">No resume available</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-semibold">Message</h3>
                  <p className="text-sm text-muted-foreground border rounded-md p-4">
                    {selectedRequest.message || 'No message provided'}
                  </p>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold">Status History</h3>
                  <div className="space-y-4">
                    {[...selectedRequest.statusHistory].reverse().map((status, index) => (
                      <div
                        key={`${selectedRequest.requestId}-status-${index}`}
                        className="border rounded-lg p-4 space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <Badge className={statusColors[status.status]}>
                            {status.status}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {formatDate(status.updatedAt)}
                          </span>
                        </div>
                        {status.note && (
                          <p className="text-sm text-muted-foreground mt-2">
                            {status.note}
                          </p>
                        )}
                        <p className="text-xs text-muted-foreground">
                          Updated by: {status.updatedBy}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  <div>
                    <h4 className="text-sm font-medium">Created At</h4>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(selectedRequest.createdAt)}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Last Updated</h4>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(
                        selectedRequest.statusHistory[
                          selectedRequest.statusHistory.length - 1
                        ]?.updatedAt || selectedRequest.createdAt
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog
        open={deleteDialog.isOpen}
        onOpenChange={(isOpen) =>
          !isOpen &&
          setDeleteDialog({ isOpen: false, request: null, loading: false })
        }
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Career Application</DialogTitle>
          </DialogHeader>

          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              Are you sure you want to delete this career application? This action
              cannot be undone.
            </p>
            {deleteDialog.request && (
              <div className="mt-2 font-medium text-foreground">
                Application from: {deleteDialog.request.name}
              </div>
            )}
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() =>
                setDeleteDialog({ isOpen: false, request: null, loading: false })
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