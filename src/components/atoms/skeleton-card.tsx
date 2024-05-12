import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

export default function SkeletonCard() {
  return (
    <Card x-chunk="dashboard-01-chunk-2">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <Skeleton className="h-3 mt-1.5 w-28 rounded-[4px]" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-6 font-bold mt-1.5 w-48 rounded-[4px]" />
        <Skeleton className="h-2 mt-2.5 w-28 rounded-[4px]" />
      </CardContent>
    </Card>
  );
}
