"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Edit, MoreHorizontal, Search, Trash2 } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";

export default function ContactsManagement() {
  // Sample data based on the provided JSON structure
  const [contacts, setContacts] = useState([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [editingContact, setEditingContact] = useState(null);
  const [deleteContactId, setDeleteContactId] = useState(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  //   Fetch Contacts
  const fetchContacts = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/contact/all`
      );
      setContacts(data.contacts);
    } catch (error) {
      console.error("Error fetching contacts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, []);

  // Filter contacts based on search query and status filter
  const filteredContacts = contacts?.filter((contact) => {
    const matchesSearch =
      contact.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.orderId.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || contact.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Format date to be more readable
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  // Handle edit contact
  const handleEditContact = (contact) => {
    setEditingContact({ ...contact });
    setIsEditDialogOpen(true);
  };

  // Handle save edited contact
  const handleSaveContact = async () => {
    if (editingContact) {
      setContacts(
        contacts.map((contact) =>
          contact._id === editingContact._id ? editingContact : contact
        )
      );
      try {
        const { data } = await axios.put(
          `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/contact/update/${editingContact._id}`,
          editingContact
        );
        if (data) {
          setContacts(
            contacts.map((contact) =>
              contact._id === editingContact._id ? data.contact : contact
            )
          );
          setIsEditDialogOpen(false);
          toast.success("Contact updated successfully");
        }
      } catch (error) {
        console.error("Error updating contact:", error);
        setError(error?.response?.data?.message);
        toast.error(error?.response?.data?.message);
      }
    }
  };

  // Handle delete contact
  const handleDeleteContact = (id) => {
    setDeleteContactId(id);
    setIsDeleteDialogOpen(true);
  };

  // Confirm delete contact
  const confirmDeleteContact = async () => {
    try {
      const { data } = await axios.delete(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/contact/delete/${deleteContactId}`
      );
      if (data) {
        setContacts(
          contacts.filter((contact) => contact._id !== deleteContactId)
        );
        setIsDeleteDialogOpen(false);
        toast.success("Contact deleted successfully");
      }
    } catch (error) {
      console.error("Error deleting contact:", error);
      setError(error?.response?.data?.message);
      toast.error(error?.response?.data?.message);
    }
  };

  // Get status badge color
  const getStatusBadge = (status) => {
    switch (status) {
      case "pending":
        return (
          <Badge
            variant="outline"
            className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100"
          >
            Pending
          </Badge>
        );
      case "in-progress":
        return (
          <Badge
            variant="outline"
            className="bg-blue-100 text-blue-800 hover:bg-blue-100"
          >
            In Progress
          </Badge>
        );
      case "resolved":
        return (
          <Badge
            variant="outline"
            className="bg-green-100 text-green-800 hover:bg-green-100"
          >
            Resolved
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex flex-col space-y-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <h1 className="text-2xl font-bold text-red-700">
            Contact Management
          </h1>
          <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
            <div className="relative flex-grow">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Search contacts..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {loading ? (
          <div className="grid gap-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <Card key={index} className="overflow-hidden animate-pulse">
                <CardHeader className="bg-white p-4 pb-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="h-4 bg-gray-200 rounded w-32 mb-2" />
                      <div className="h-3 bg-gray-100 rounded w-24" />
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-12 bg-gray-200 rounded" />
                      <div className="h-8 w-8 bg-gray-200 rounded-full" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-2">
                  <div className="h-3 bg-gray-200 rounded w-full mb-2" />
                  <div className="h-3 bg-gray-100 rounded w-3/4 mb-2" />
                  <div className="h-3 bg-gray-100 rounded w-2/3" />
                  <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-gray-400 gap-2">
                    <div className="h-3 bg-gray-100 rounded w-24" />
                    <div className="flex flex-col sm:flex-row sm:gap-4">
                      <div className="h-3 bg-gray-100 rounded w-20" />
                      <div className="h-3 bg-gray-100 rounded w-20" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredContacts.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border">
            <h3 className="text-xl font-medium mb-2">No contacts found</h3>
            <p className="text-gray-500">
              Try adjusting your search or filter criteria
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {filteredContacts.map((contact) => (
              <Card key={contact._id} className="overflow-hidden">
                <CardHeader className="bg-white p-4 pb-0">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg font-semibold">
                        {contact.subject}
                      </CardTitle>
                      <p className="text-sm text-gray-500 mt-1">
                        Order ID: {contact.orderId}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(contact.status)}
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Actions</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleEditContact(contact)}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => handleDeleteContact(contact._id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4 pt-2">
                  <div className="mt-2 whitespace-pre-line text-sm text-gray-700">
                    {contact.message}
                  </div>
                  <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-gray-500 gap-2">
                    <div>User ID: {contact.user}</div>
                    <div className="flex flex-col sm:flex-row sm:gap-4">
                      <span>Created: {formatDate(contact.createdAt)}</span>
                      <span>Updated: {formatDate(contact.updatedAt)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Edit Contact Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Contact</DialogTitle>
            <DialogDescription>
              Make changes to the contact information below.
            </DialogDescription>
          </DialogHeader>
          {editingContact && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="subject">Subject</Label>
                <Input
                  id="subject"
                  value={editingContact.subject}
                  onChange={(e) =>
                    setEditingContact({
                      ...editingContact,
                      subject: e.target.value,
                    })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="orderId">Order ID</Label>
                <Input
                  id="orderId"
                  value={editingContact.orderId}
                  onChange={(e) =>
                    setEditingContact({
                      ...editingContact,
                      orderId: e.target.value,
                    })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  rows={5}
                  value={editingContact.message}
                  onChange={(e) =>
                    setEditingContact({
                      ...editingContact,
                      message: e.target.value,
                    })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={editingContact.status}
                  onValueChange={(value) =>
                    setEditingContact({
                      ...editingContact,
                      status: value,
                    })
                  }
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="resolved">Resolved</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              className="bg-red-700 hover:bg-red-800 text-white"
              onClick={handleSaveContact}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              contact and remove it from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-700 hover:bg-red-800"
              onClick={confirmDeleteContact}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
