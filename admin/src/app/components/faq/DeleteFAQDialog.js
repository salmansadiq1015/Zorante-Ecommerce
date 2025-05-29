"use client";

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

export function DeleteFAQDialog({ open, onOpenChange, faq, onDelete }) {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-red-700">
            Delete FAQ
          </AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this FAQ? This action cannot be
            undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="mt-2 rounded-md border border-gray-200 bg-gray-50 p-4">
          <p className="font-medium">{faq.question}</p>
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={onDelete}
            className="bg-red-700 hover:bg-red-800"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
