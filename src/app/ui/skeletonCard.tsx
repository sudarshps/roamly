import { Skeleton } from "@/components/ui/skeleton"

export function SkeletonCard() {
  return (
    <div className="flex space-x-6 p-10">
      {[1,2].map((_,i)=>(
        <div key={i} className="flex flex-col space-y-3 p-10">
      
      <Skeleton className="h-[325px] w-[550px] rounded-xl" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
      ))} 
    
    </div>
    
  )
}
