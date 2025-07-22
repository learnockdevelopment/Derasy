"use client"

import { useEffect, useState } from "react"
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreVertical } from "lucide-react";

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const getCookie = (name) => {
  const value = `; ${document.cookie}`
  const parts = value.split(`; ${name}=`)
  if (parts.length === 2) return parts.pop().split(";").shift()
  return null
}

export function StudentCardRequestsTable() {
  const columns = [
    {
      id: "studentName",
      accessorFn: (row) => row.student?.name || "",
      header: "اسم الطالب",
      cell: ({ row }) => <span>{row.original.student?.name}</span>,
    },
    {
      id: "studentEmail",
      accessorFn: (row) => row.student?.email || "",
      header: "البريد الإلكتروني",
      cell: ({ row }) => <span>{row.original.student?.email}</span>,
    },
    {
      id: "schoolName",
      accessorFn: (row) => row.school?.name || "",
      header: "المدرسة",
      cell: ({ row }) => <span>{row.original.school?.name}</span>,
    },
    {
      accessorKey: "createdAt",
      header: "تاريخ الطلب",
      cell: ({ row }) =>
        new Date(row.original.createdAt).toLocaleDateString("ar-EG"),
    },
    {
      accessorKey: "status",
      header: "الحالة",
      cell: ({ row }) => {
        const status = row.original.status || "معلق"
        const color =
          status === "مقبول"
            ? "text-green-600"
            : status === "مرفوض"
            ? "text-red-600"
            : "text-yellow-600"
        return <span className={`${color} font-semibold`}>{status}</span>
      },
    },
    {
      id: "actions",
      header: "الإجراءات",
      cell: ({ row }) => (
         <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <MoreVertical className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => updateStatus(row.original._id, "approved")}>
          ✅ قبول
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => updateStatus(row.original._id, "rejected")}>
          ❌ رفض
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleRowClick(row)}>
          👁️ عرض الطلب
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
      ),
    },
  ]

  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [dateFilter, setDateFilter] = useState({ from: "", to: "" })
  const [sorting, setSorting] = useState([])
  const [globalFilter, setGlobalFilter] = useState("")
  const [columnVisibility, setColumnVisibility] = useState({})
  const [rowSelection, setRowSelection] = useState({})
const router = useRouter()

const handleRowClick = (row) => {
  const schoolId = row.original.school?._id
  const requestId = row.original._id
  if (schoolId && requestId) {
    router.push(`/pages/admission/me/schools/${schoolId}/requests/${requestId}`)
  }
}
  const updateStatus = async (id, status) => {
    try {
      const token = getCookie("token")
      await fetch(`/api/admin/id-requests/${id}/change-status`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status }),
      })
      setRequests((prev) =>
        prev.map((r) => (r._id === id ? { ...r, status } : r))
      )
    } catch (err) {
      console.error("❌ Error updating status:", err)
    }
  }

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const token = getCookie("token")
        if (!token) throw new Error("No token found")

        const query = new URLSearchParams(dateFilter).toString()
        const res = await fetch(`/api/admin/id-requests?${query}`, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        })

        if (!res.ok) throw new Error("Failed to fetch requests")

        const data = await res.json()
        setRequests(data.requests || [])
      } catch (err) {
        console.error("❌ Error fetching card requests:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchRequests()
  }, [dateFilter])

  const table = useReactTable({
    data: requests,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      globalFilter,
      columnVisibility,
      rowSelection,
    },
    globalFilterFn: (row, columnId, filterValue) => {
      return Object.values(row.original).some((value) =>
        String(
          typeof value === "object" && value !== null
            ? JSON.stringify(value)
            : value
        )
          .toLowerCase()
          .includes(filterValue.toLowerCase())
      )
    },
  })

  return (
    <Card>
      <CardHeader className="flex flex-col md:flex-row justify-between items-center gap-2">
        <CardTitle>طلبات بطاقات الطلاب</CardTitle>
        <div className="flex gap-2 w-full md:w-auto flex-col md:flex-row">
          <Input
            type="date"
            value={dateFilter.from}
            onChange={(e) =>
              setDateFilter({ ...dateFilter, from: e.target.value })
            }
          />
          <Input
            type="date"
            value={dateFilter.to}
            onChange={(e) =>
              setDateFilter({ ...dateFilter, to: e.target.value })
            }
          />
          <Input
            placeholder="ابحث في جميع الأعمدة..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            className="max-w-sm"
          />
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <ScrollArea className="w-full">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((group) => (
                <TableRow key={group.id}>
                  {group.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={columns.length} className="text-center h-24">
                    جاري التحميل...
                  </TableCell>
                </TableRow>
              ) : table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="text-center h-24">
                    لا توجد طلبات.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </ScrollArea>
        <div className="flex justify-between items-center px-4 py-4">
          <Button
            size="sm"
            variant="outline"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            السابق
          </Button>
          <span className="text-sm">
            صفحة {table.getState().pagination.pageIndex + 1} من{" "}
            {table.getPageCount()}
          </span>
          <Button
            size="sm"
            variant="outline"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            التالي
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
