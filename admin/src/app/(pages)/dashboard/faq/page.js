"use client";
import { AddFAQDialog } from "@/app/components/faq/AddFAQDialog";
import { DeleteFAQDialog } from "@/app/components/faq/DeleteFAQDialog";
import { EditFAQDialog } from "@/app/components/faq/EditFAQDialog";
import { FAQList } from "@/app/components/faq/FAQList";
import MainLayout from "@/app/components/layout/MainLayout";
import Breadcrumb from "@/app/utils/Breadcrumb";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { PlusCircle } from "lucide-react";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function FAQ() {
  const [currentUrl, setCurrentUrl] = useState("");
  const [faqs, setFaqs] = useState([]);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedFaq, setSelectedFaq] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // ------Current Page URL-----
  useEffect(() => {
    if (typeof window !== "undefined") {
      const pathArray = window.location.pathname;
      setCurrentUrl(pathArray);
    }
    // exlint-disable-next-line
  }, []);

  const fetchFaqs = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/faq/all`
      );
      setFaqs(data.faqs);
    } catch (error) {
      console.error("Error fetching FAQs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  const handleAddFaq = (faq) => {
    const newFaq = {
      ...faq,
      id: Math.random().toString(36).substring(2, 9),
    };
    setFaqs([...faqs, newFaq]);
    setIsAddDialogOpen(false);
  };

  const handleEditFaq = (updatedFaq) => {
    setFaqs(faqs?.map((faq) => (faq._id === updatedFaq.id ? updatedFaq : faq)));
    setIsEditDialogOpen(false);
  };

  const handleDeleteFaq = async (id) => {
    try {
      const { data } = await axios.delete(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/faq/delete/${id}`
      );
      if (data) {
        setFaqs(faqs?.filter((faq) => faq._id !== id));
        toast.success("FAQ Deleted Successfully");
      }
    } catch (error) {
      console.error("Error deleting FAQ:", error);
      toast.error("Failed to delete FAQ");
    } finally {
      setIsDeleteDialogOpen(false);
    }
  };

  const openEditDialog = (faq) => {
    setSelectedFaq(faq);
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (faq) => {
    setSelectedFaq(faq);
    setIsDeleteDialogOpen(true);
  };

  return (
    <MainLayout title="FAQ's - Ayoob Admin">
      <div className="p-1 sm:p-2 h-[100%] w-full pb-4  scroll-smooth">
        <div className="flex flex-col gap-4">
          <Breadcrumb path={currentUrl} />
          <div className="flex min-h-screen flex-col bg-gray-50">
            <header className="sticky top-0 z-10 border-b bg-white shadow-sm">
              <div className="flex h-16 items-center px-6">
                <h1 className="text-2xl font-bold text-red-700">
                  FAQ Management
                </h1>
                <div className="ml-auto flex items-center gap-4">
                  <Button
                    onClick={() => setIsAddDialogOpen(true)}
                    className="bg-red-700 hover:bg-red-800"
                  >
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Add FAQ
                  </Button>
                </div>
              </div>
            </header>
            <main className="flex-1 p-6">
              <div className="mx-auto max-w-6xl">
                <FAQList
                  faqs={faqs}
                  onEdit={openEditDialog}
                  onDelete={openDeleteDialog}
                />
              </div>
            </main>

            <AddFAQDialog
              open={isAddDialogOpen}
              onOpenChange={setIsAddDialogOpen}
              onAdd={handleAddFaq}
            />

            {selectedFaq && (
              <>
                <EditFAQDialog
                  open={isEditDialogOpen}
                  onOpenChange={setIsEditDialogOpen}
                  faq={selectedFaq}
                  onEdit={handleEditFaq}
                  fetchFaqs={fetchFaqs}
                />

                <DeleteFAQDialog
                  open={isDeleteDialogOpen}
                  onOpenChange={setIsDeleteDialogOpen}
                  faq={selectedFaq}
                  onDelete={() => handleDeleteFaq(selectedFaq._id)}
                />
              </>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
