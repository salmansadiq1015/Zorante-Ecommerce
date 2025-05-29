"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import axios from "axios";
import toast from "react-hot-toast";
import { Loader } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const formSchema = z.object({
  id: z.string(),
  question: z.string().min(5, {
    message: "Question must be at least 5 characters.",
  }),
  answer: z.string().min(10, {
    message: "Answer must be at least 10 characters.",
  }),
  category: z.string().min(1, {
    message: "Please select a category.",
  }),
});

export function EditFAQDialog({ open, onOpenChange, faq, onEdit, fetchFaqs }) {
  const [loading, setLoading] = useState(false);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: faq?.id || "",
      question: faq?.question || "",
      answer: faq?.answer || "",
      category: faq?.category || "",
    },
  });

  useEffect(() => {
    if (faq) {
      form.reset({
        id: faq.id,
        question: faq.question,
        answer: faq.answer,
        category: faq.category,
      });
    }
  }, [faq, form]);

  const onSubmit = async (values) => {
    setLoading(true);

    try {
      const { data } = await axios.put(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/faq/update/${faq?._id}`,
        values
      );
      if (data) {
        fetchFaqs();
        toast.success("FAQ Updated Successfully");
        onEdit(values);
        onOpenChange(false);
      }
    } catch (error) {
      console.error("Error updating FAQ:", error);
      toast.error("Failed to update FAQ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-red-700">
            Edit FAQ
          </DialogTitle>
          <DialogDescription>
            Make changes to the frequently asked question.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Hidden ID field */}
            <FormField
              control={form.control}
              name="id"
              render={({ field }) => <input type="hidden" {...field} />}
            />

            <FormField
              control={form.control}
              name="question"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Question</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="answer"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Answer</FormLabel>
                  <FormControl>
                    <Textarea className="min-h-[120px]" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="general">General</SelectItem>
                      <SelectItem value="orders">Orders</SelectItem>
                      <SelectItem value="payments">Payments</SelectItem>
                      <SelectItem value="shipping">Shipping</SelectItem>
                      <SelectItem value="returns">Returns</SelectItem>
                      <SelectItem value="products">Products</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="bg-red-700 hover:bg-red-800 flex items-center gap-1"
                onClick={() => onSubmit(form.getValues())}
                disabled={loading}
              >
                Save Changes
                {loading && <Loader className="animate-spin" size={18} />}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
