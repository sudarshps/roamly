import {
    Pagination as PaginationMain,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination"
import { useEffect, useState } from "react"


interface PaginationType {
    totalPosts:number|null;
    currentPgNum: (page: number) => void
}

export function Pagination({ totalPosts, currentPgNum }: PaginationType) {
    const itemsLimit = 5
    const totalPages = Math.ceil(totalPosts! / itemsLimit)
    const [currentPage, setCurrentPage] = useState<number>(1)
    
    const handlePage = (method: string) => {
        if (method === '+') {
            if (currentPage < totalPages) {
                setCurrentPage(prev => prev + 1)
            }
        } else {
            if (currentPage > 1) {
                setCurrentPage(prev => prev - 1)
            }
        }
        currentPgNum(currentPage)
    }

    useEffect(()=>{
        currentPgNum(currentPage)
    },[currentPage])

    return (
        <PaginationMain className="flex justify-start">
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious href="#" onClick={()=>handlePage('-')}/>
                </PaginationItem>
                {[...Array(totalPages)].map((_, ind) => (
                    <PaginationItem key={ind}>
                        <PaginationLink href="#">{ind + 1}</PaginationLink>
                    </PaginationItem>
                ))}

                <PaginationItem>
                    <PaginationEllipsis />
                </PaginationItem>
                <PaginationItem>
                    <PaginationNext href="#" onClick={() => handlePage('+')} />
                </PaginationItem>
            </PaginationContent>
        </PaginationMain>
    )
}