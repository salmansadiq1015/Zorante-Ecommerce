"use client";

import { useState } from "react";
import { Edit, Search, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export function FAQList({ faqs, onEdit, onDelete }) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Card className="shadow-md">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-bold">
          Frequently Asked Questions
        </CardTitle>
        <div className="relative w-full max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="Search FAQs..."
            className="w-full pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </CardHeader>
      <CardContent>
        {filteredFaqs.length === 0 ? (
          <div className="flex h-32 items-center justify-center rounded-md border border-dashed p-8">
            <p className="text-center text-gray-500">
              No FAQs found. Try a different search or add a new FAQ.
            </p>
          </div>
        ) : (
          <Accordion type="multiple" className="space-y-4">
            {filteredFaqs?.map((faq, i) => (
              <AccordionItem
                key={i}
                value={faq._id}
                className="rounded-lg border border-gray-200 px-4 shadow-sm transition-all hover:shadow"
              >
                <div className="flex items-center justify-between">
                  <AccordionTrigger className="py-4 text-left font-medium hover:text-red-700">
                    {faq?.question}
                  </AccordionTrigger>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className="bg-red-50 text-red-700">
                      {faq?.category}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit(faq);
                      }}
                      className="h-8 w-8 text-gray-500 hover:text-red-700"
                    >
                      <Edit className="h-4 w-4" />
                      <span className="sr-only">Edit</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(faq);
                      }}
                      className="h-8 w-8 text-gray-500 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </div>
                </div>
                <AccordionContent className="pb-4 pt-2 text-gray-600">
                  {faq?.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        )}
      </CardContent>
    </Card>
  );
}
