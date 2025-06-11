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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Info } from "lucide-react";

const statusColors = {
  draft: "bg-gray-500",
  pending: "bg-yellow-500",
  followup1: "bg-blue-500",
  followup2: "bg-purple-500",
  approved: "bg-green-500",
  rejected: "bg-red-500",
  completed: "bg-emerald-500",
};

export default function TrainingRequestTable({ setEditRequest }) {
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
      const response = await fetch("/api/training-requests");
      const data = await response.json();
      if (data.success) {
        // Validate and transform the data
        const validatedRequests = data.data.map((request, index) => ({
          ...request,
          requestId: request.requestId || `temp-id-${index}`,
          statusHistory: Array.isArray(request.statusHistory)
            ? request.statusHistory
            : [],
          courseId: request.courseId || { title: "Unknown Course" },
        }));
        setRequests(validatedRequests);
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch training requests",
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
        `/api/training-requests/${deleteDialog.request.requestId}`,
        {
          method: "DELETE",
        }
      );
      const data = await response.json();

      if (data.success) {
        toast({
          title: "Success",
          description: "Request deleted successfully",
          variant: "success",
        });
        fetchRequests();
        setDeleteDialog({ isOpen: false, request: null, loading: false });
      } else {
        throw new Error(data.message || "Failed to delete request");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete request",
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
      {/* Replace the existing table container code with this */}
      <div className="rounded-md border">
        <div className="w-full overflow-auto">
          <div style={{ minWidth: "1500px" }}>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[200px] px-6">Name</TableHead>
                  <TableHead className="w-[250px] px-6">Email</TableHead>
                  <TableHead className="w-[150px] px-6">Phone</TableHead>
                  <TableHead className="w-[150px] px-6">Experience</TableHead>
                  <TableHead className="w-[250px] px-6">Course</TableHead>
                  <TableHead className="w-[150px] px-6">Status</TableHead>
                  <TableHead className="w-[150px] px-6">Created At</TableHead>
                  <TableHead className="w-[250px] px-6">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.map((request, index) => (
                  <TableRow key={request.requestId || `request-${index}`}>
                    <TableCell className="font-medium px-6">
                      {request.name}
                    </TableCell>
                    <TableCell className="px-6">{request.email}</TableCell>
                    <TableCell className="px-6">{request.phone}</TableCell>
                    <TableCell className="px-6 capitalize">
                      {request.experience}
                    </TableCell>
                    <TableCell className="px-6">
                      {(() => {
                        if (!request.courseId) {
                          return "No Course Selected";
                        }

                        // If courseId is properly populated with a title property
                        if (
                          typeof request.courseId === "object" &&
                          request.courseId?.title
                        ) {
                          return request.courseId.title;
                        }

                        // If courseId is just a string ID
                        if (
                          typeof request.courseId === "string" ||
                          request.courseId?._id
                        ) {
                          return "Loading Course..."; // You could fetch the course details here
                        }

                        return "Unknown Course";
                      })()}
                    </TableCell>
                    <TableCell className="px-6">
                      <Badge
                        className={`${
                          statusColors[
                            request.statusHistory[
                              request.statusHistory.length - 1
                            ]?.status || "draft"
                          ]
                        }`}
                      >
                        {request.statusHistory[request.statusHistory.length - 1]
                          ?.status || "draft"}
                      </Badge>
                    </TableCell>
                    <TableCell className="px-6">
                      {format(
                        new Date(request.createdAt || new Date()),
                        "yyyy-MM-dd HH:mm"
                      )}
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
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>

      {/* Details Dialog */}
      <Dialog
        open={!!selectedRequest}
        onOpenChange={() => setSelectedRequest(null)}
      >
        <DialogContent className="max-w-[700px] max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Request Details</DialogTitle>
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
                    <h4 className="text-sm font-medium">Course</h4>
                    <p className="text-sm text-muted-foreground">
                      {selectedRequest.courseId?.title || "Unknown Course"}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Experience Level</h4>
                    <p className="text-sm text-muted-foreground capitalize">
                      {selectedRequest.experience}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-semibold">Message</h3>
                  <p className="text-sm text-muted-foreground border rounded-md p-4">
                    {selectedRequest.message}
                  </p>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold">Status History</h3>
                  <div className="space-y-4">
                    {[...(selectedRequest.statusHistory || [])]
                      .reverse()
                      .map((status, index) => (
                        <div
                          key={`status-${selectedRequest.requestId}-${index}`}
                          className="border rounded-lg p-4 space-y-2"
                        >
                          <div className="flex items-center justify-between">
                            <Badge className={statusColors[status.status]}>
                              {status.status}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              {format(
                                new Date(status.updatedAt || new Date()),
                                "yyyy-MM-dd HH:mm:ss"
                              )}
                            </span>
                          </div>
                          {status.notes && (
                            <p className="text-sm text-muted-foreground mt-2">
                              {status.notes}
                            </p>
                          )}
                          <p className="text-xs text-muted-foreground">
                            Updated by: {status.updatedBy || "Bytewave Admin"}
                          </p>
                        </div>
                      ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  <div>
                    <h4 className="text-sm font-medium">Created At</h4>
                    <p className="text-sm text-muted-foreground">
                      {format(
                        new Date(selectedRequest.createdAt || new Date()),
                        "yyyy-MM-dd HH:mm:ss"
                      )}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Last Updated</h4>
                    <p className="text-sm text-muted-foreground">
                      {format(
                        new Date(
                          selectedRequest.statusHistory[
                            selectedRequest.statusHistory.length - 1
                          ]?.updatedAt ||
                            selectedRequest.createdAt ||
                            new Date()
                        ),
                        "yyyy-MM-dd HH:mm:ss"
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
            <DialogTitle>Delete Training Request</DialogTitle>
          </DialogHeader>

          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              Are you sure you want to delete this training request? This action
              cannot be undone.
            </p>
            {deleteDialog.request && (
              <div className="mt-2 font-medium text-foreground">
                Request from: {deleteDialog.request.name}
              </div>
            )}
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() =>
                setDeleteDialog({
                  isOpen: false,
                  request: null,
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
