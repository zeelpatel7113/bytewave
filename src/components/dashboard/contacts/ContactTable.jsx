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
};

export default function ContactTable({ setEditContact }) {
  const { toast } = useToast();
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedContact, setSelectedContact] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({
    isOpen: false,
    contact: null,
    loading: false,
  });

  const fetchContacts = async () => {
    try {
      const response = await fetch("/api/contacts");
      const data = await response.json();
      if (data.success) {
        setContacts(data.data);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch contacts",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
    const interval = setInterval(fetchContacts, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleDeleteClick = (contact) => {
    setDeleteDialog({
      isOpen: true,
      contact,
      loading: false,
    });
  };

  const handleDeleteConfirm = async () => {
    setDeleteDialog((prev) => ({ ...prev, loading: true }));

    try {
      const response = await fetch(
        `/api/contacts/${deleteDialog.contact.requestId}`,
        {
          method: "DELETE",
        }
      );
      const data = await response.json();

      if (data.success) {
        toast({
          title: "Success",
          description: "Contact deleted successfully",
          variant: "success",
        });
        fetchContacts();
        setDeleteDialog({ isOpen: false, contact: null, loading: false });
      } else {
        throw new Error(data.message || "Failed to delete contact");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete contact",
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
                <TableHead className="w-[200px] px-6">Name</TableHead>
                <TableHead className="w-[250px] px-6">Email</TableHead>
                <TableHead className="w-[150px] px-6">Phone</TableHead>
                <TableHead className="w-[150px] px-6">Status</TableHead>
                <TableHead className="w-[150px] px-6">Created At</TableHead>
                <TableHead className="w-[200px] px-6">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contacts.map((contact) => (
                <TableRow key={contact._id || contact.requestId}>
                  <TableCell className="font-medium px-6">
                    {contact.name}
                  </TableCell>
                  <TableCell className="px-6">{contact.email}</TableCell>
                  <TableCell className="px-6">{contact.phone}</TableCell>
                  <TableCell className="px-6">
                    <Badge
                      className={`${
                        statusColors[
                          contact.statusHistory[contact.statusHistory.length - 1]
                            ?.status || "draft"
                        ]
                      }`}
                    >
                      {contact.statusHistory[contact.statusHistory.length - 1]
                        ?.status || "draft"}
                    </Badge>
                  </TableCell>
                  <TableCell className="px-6">
                    {format(new Date(contact.createdAt), "yyyy-MM-dd HH:mm")}
                  </TableCell>
                  <TableCell className="px-6">
                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedContact(contact)}
                        className="w-[80px]"
                      >
                        <Info className="h-4 w-4 mr-1" />
                        View
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditContact(contact)}
                        className="w-[80px]"
                      >
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteClick(contact)}
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

      {/* Details Dialog */}
      <Dialog
        open={!!selectedContact}
        onOpenChange={() => setSelectedContact(null)}
      >
        <DialogContent className="max-w-[700px] max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>Contact Details</DialogTitle>
          </DialogHeader>
          {selectedContact && (
            <ScrollArea className="h-[calc(80vh-100px)] pr-4">
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-sm font-medium">Name</h4>
                    <p className="text-sm text-muted-foreground">
                      {selectedContact.name}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Email</h4>
                    <p className="text-sm text-muted-foreground">
                      {selectedContact.email}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Phone</h4>
                    <p className="text-sm text-muted-foreground">
                      {selectedContact.phone}
                    </p>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-semibold">Message</h3>
                  <p className="text-sm text-muted-foreground border rounded-md p-4">
                    {selectedContact.message}
                  </p>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold">Status History</h3>
                  <div className="space-y-4">
                    {[...selectedContact.statusHistory].reverse().map((status, index) => (
                      <div
                        key={index}
                        className="border rounded-lg p-4 space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <Badge className={statusColors[status.status]}>
                            {status.status}
                          </Badge>
                          <span className="text-sm text-muted-foreground">
                            {format(
                              new Date(status.updatedAt),
                              "yyyy-MM-dd HH:mm:ss"
                            )}
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
                      {format(
                        new Date(selectedContact.createdAt),
                        "yyyy-MM-dd HH:mm:ss"
                      )}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium">Last Updated</h4>
                    <p className="text-sm text-muted-foreground">
                      {format(
                        new Date(
                          selectedContact.statusHistory[
                            selectedContact.statusHistory.length - 1
                          ]?.updatedAt || selectedContact.createdAt
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
          setDeleteDialog({ isOpen: false, contact: null, loading: false })
        }
      >
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Contact</DialogTitle>
          </DialogHeader>

          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              Are you sure you want to delete this contact? This action cannot be
              undone.
            </p>
            {deleteDialog.contact && (
              <div className="mt-2 font-medium text-foreground">
                Contact from: {deleteDialog.contact.name}
              </div>
            )}
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() =>
                setDeleteDialog({ isOpen: false, contact: null, loading: false })
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