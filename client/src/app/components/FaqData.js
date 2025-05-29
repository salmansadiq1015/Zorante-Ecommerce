"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Search,
  ShoppingBag,
  CreditCard,
  Truck,
  Package,
  RefreshCw,
  HelpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

// Category configuration with icons
const categoryConfig = {
  general: {
    label: "General",
    icon: <HelpCircle className="h-4 w-4" />,
  },
  orders: {
    label: "Orders",
    icon: <ShoppingBag className="h-4 w-4" />,
  },
  payments: {
    label: "Payments",
    icon: <CreditCard className="h-4 w-4" />,
  },
  shipping: {
    label: "Shipping",
    icon: <Truck className="h-4 w-4" />,
  },
  returns: {
    label: "Returns",
    icon: <RefreshCw className="h-4 w-4" />,
  },
  products: {
    label: "Products",
    icon: <Package className="h-4 w-4" />,
  },
  other: {
    label: "Other",
    icon: <HelpCircle className="h-4 w-4" />,
  },
};

export default function FAQPage() {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState("all");

  // Fetch FAQs from API
  const fetchFaqs = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `${process.env.NEXT_PUBLIC_SERVER_URI}/api/v1/faq/all`
      );
      setFaqs(data.faqs);

      // Extract unique categories from FAQs
      const uniqueCategories = Array?.from(
        new Set(data?.faqs?.map((faq) => faq.category))
      );
      setCategories(["all", ...uniqueCategories]);
    } catch (error) {
      console.error("Error fetching FAQs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  // Filter FAQs based on search query and active category
  const filteredFaqs = faqs?.filter((faq) => {
    const matchesSearch =
      searchQuery === "" ||
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      activeCategory === "all" || faq.category === activeCategory;

    return matchesSearch && matchesCategory;
  });

  // Group FAQs by category for display
  const faqsByCategory = filteredFaqs?.reduce((acc, faq) => {
    if (!acc[faq.category]) {
      acc[faq.category] = [];
    }
    acc[faq.category].push(faq);
    return acc;
  }, {});

  // Count total FAQs
  const totalFaqs = faqs?.length;

  // Check if any results match the search query
  const hasSearchResults = filteredFaqs?.length > 0;

  return (
    <div className="min-h-screen relative z-10">
      <div className="container mx-auto py-12 px-4 md:px-6">
        {/* Search */}
        <div className="max-w-2xl mx-auto mb-10">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <Input
              type="text"
              placeholder="Search for answers..."
              className="pl-10 py-6 text-lg"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <p className="text-sm text-gray-500 mt-2">
            {searchQuery
              ? `Showing results for "${searchQuery}"`
              : `Browse through our ${totalFaqs} frequently asked questions`}
          </p>
        </div>

        {/* FAQ Categories */}
        {loading ? (
          <LoadingSkeletonFAQs />
        ) : (
          <Tabs
            value={activeCategory}
            onValueChange={setActiveCategory}
            className="max-w-4xl mx-auto"
          >
            <TabsList className="grid grid-cols-7 mb-8">
              <TabsTrigger value="all" className="flex items-center gap-2">
                <HelpCircle className="h-4 w-4" />
                <span className="hidden sm:inline">All</span>
              </TabsTrigger>

              {categories
                ?.filter((cat) => cat !== "all")
                ?.map((category) => (
                  <TabsTrigger
                    key={category}
                    value={category}
                    className="flex items-center gap-2"
                  >
                    {categoryConfig[category]?.icon || (
                      <HelpCircle className="h-4 w-4" />
                    )}
                    <span className="hidden sm:inline">
                      {categoryConfig[category]?.label ||
                        category?.charAt(0)?.toUpperCase() + category?.slice(1)}
                    </span>
                  </TabsTrigger>
                ))}
            </TabsList>

            {!hasSearchResults && (
              <div className="text-center py-12">
                <h3 className="text-xl font-bold mb-2">No results found</h3>
                <p className="text-gray-600 mb-6">
                  We couldn&apos;t find any questions matching &quot;
                  {searchQuery}&quot;. Try using different keywords or browse
                  through our categories.
                </p>
                <Button
                  variant="outline"
                  onClick={() => setSearchQuery("")}
                  className="bg-red-700 text-white hover:bg-red-800 border-none"
                >
                  Clear Search
                </Button>
              </div>
            )}

            <TabsContent value="all">
              <Card>
                <CardContent className="pt-6">
                  <h2 className="text-2xl font-bold mb-6">All Questions</h2>
                  {hasSearchResults ? (
                    <Accordion type="single" collapsible className="space-y-4">
                      {filteredFaqs?.map((faq) => (
                        <AccordionItem
                          key={faq?._id}
                          value={faq?._id}
                          className="border rounded-lg px-4"
                        >
                          <AccordionTrigger className="text-left font-medium py-4">
                            {faq?.question}
                          </AccordionTrigger>
                          <AccordionContent className="pb-4 text-gray-700">
                            {faq?.answer}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  ) : (
                    <p className="text-gray-500 py-4">No questions available</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {categories
              ?.filter((cat) => cat !== "all")
              ?.map((category) => {
                const categoryFaqs = faqsByCategory[category] || [];

                return (
                  <TabsContent key={category} value={category}>
                    <Card>
                      <CardContent className="pt-6">
                        <h2 className="text-2xl font-bold mb-6">
                          {categoryConfig[category]?.label ||
                            category?.charAt(0).toUpperCase() +
                              category?.slice(1)}{" "}
                          Questions
                        </h2>

                        {categoryFaqs?.length > 0 ? (
                          <Accordion
                            type="single"
                            collapsible
                            className="space-y-4"
                          >
                            {categoryFaqs?.map((faq) => (
                              <AccordionItem
                                key={faq?._id}
                                value={faq?._id}
                                className="border rounded-lg px-4"
                              >
                                <AccordionTrigger className="text-left font-medium py-4">
                                  {faq?.question}
                                </AccordionTrigger>
                                <AccordionContent className="pb-4 text-gray-700">
                                  {faq?.answer}
                                </AccordionContent>
                              </AccordionItem>
                            ))}
                          </Accordion>
                        ) : searchQuery ? (
                          <p className="text-gray-500 py-4">
                            No questions found in this category matching &quot;
                            {searchQuery}&quot;
                          </p>
                        ) : (
                          <p className="text-gray-500 py-4">
                            No questions available in this category
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  </TabsContent>
                );
              })}
          </Tabs>
        )}

        {/* Still Need Help Section */}
        <div className="max-w-4xl mx-auto mt-16 z-30 relative">
          <div className="bg-gradient-to-r from-red-700 to-red-600 rounded-lg p-8 text-white text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Still Need Help?
            </h2>
            <p className="mb-6 max-w-2xl mx-auto">
              Can&apos;t find the answer you&apos;re looking for? Our customer
              service team is here to help you with any questions or concerns.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                className="bg-white text-red-700 px-6 py-3 rounded-md font-medium hover:bg-gray-100 transition-colors"
              >
                <Link href="/contact">Contact Support</Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="bg-transparent border border-white px-6 py-3 rounded-md font-medium hover:bg-white/10 transition-colors"
              >
                <Link href="/chat">Start Live Chat</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Loading skeleton component for FAQs
function LoadingSkeletonFAQs() {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Skeleton for tabs */}
      <div className="grid grid-cols-3 md:grid-cols-7 gap-2 mb-8">
        {Array.from({ length: 7 }).map((_, i) => (
          <Skeleton key={i} className="h-10 w-full rounded-md" />
        ))}
      </div>

      {/* Skeleton for FAQ card */}
      <Card>
        <CardContent className="pt-6">
          <Skeleton className="h-8 w-48 mb-6" />

          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="border rounded-lg px-4 py-4 space-y-4">
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
