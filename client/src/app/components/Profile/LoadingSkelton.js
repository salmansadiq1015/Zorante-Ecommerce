import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingSkelton() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Skeleton */}
      <div className="bg-[#C6080A] text-white p-6">
        <div className="container mx-auto">
          <div className="flex items-center justify-between">
            <Skeleton className="h-8 w-40 bg-white/20" />
            <div className="flex items-center gap-4">
              <Skeleton className="h-10 w-10 rounded-full bg-white/20" />
              <Skeleton className="h-10 w-10 rounded-full bg-white/20" />
              <Skeleton className="h-10 w-10 rounded-full bg-white/20" />
            </div>
          </div>
        </div>
      </div>

      <main className="container mx-auto py-8 px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Profile Summary Skeleton */}
          <Card className="md:col-span-3">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
                <Skeleton className="h-24 w-24 rounded-full" />
                <div className="flex-1">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-2">
                      <Skeleton className="h-8 w-48" />
                      <Skeleton className="h-4 w-40" />
                      <Skeleton className="h-4 w-32" />
                      <div className="flex items-center gap-2 mt-1">
                        <Skeleton className="h-6 w-16 rounded-full" />
                        <Skeleton className="h-6 w-20 rounded-full" />
                      </div>
                    </div>
                    <Skeleton className="h-10 w-32" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div>
                          <Skeleton className="h-3 w-24" />
                          <Skeleton className="h-4 w-20 mt-1" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sidebar Navigation Skeleton */}
          <div className="md:col-span-1">
            <Card>
              <CardHeader className="pb-2">
                <Skeleton className="h-6 w-24" />
              </CardHeader>
              <CardContent className="p-0">
                <nav className="flex flex-col">
                  {[...Array(9)].map((_, i) => (
                    <div key={i} className="flex items-center p-4 border-b">
                      <Skeleton className="h-5 w-5 mr-3" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                  ))}
                </nav>
              </CardContent>
            </Card>

            <Card className="mt-6">
              <CardHeader className="pb-2">
                <Skeleton className="h-6 w-24" />
              </CardHeader>
              <CardContent className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i}>
                    <Skeleton className="h-4 w-20 mb-2" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Main Content Skeleton */}
          <div className="md:col-span-2">
            <div className="mb-6">
              <Skeleton className="h-10 w-full rounded-md" />
            </div>

            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-40" />
                <Skeleton className="h-4 w-60 mt-2" />
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Orders/Content Skeleton */}
                  {[...Array(5)].map((_, i) => (
                    <div
                      key={i}
                      className="flex flex-col md:flex-row items-start justify-between p-4 border rounded-lg"
                    >
                      <div className="flex items-start gap-4 mb-4 md:mb-0">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div>
                          <Skeleton className="h-5 w-32" />
                          <Skeleton className="h-3 w-24 mt-2" />
                          <Skeleton className="h-4 w-16 mt-2" />
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 w-full md:w-auto">
                        <Skeleton className="h-8 w-24" />
                        <Skeleton className="h-8 w-24" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
