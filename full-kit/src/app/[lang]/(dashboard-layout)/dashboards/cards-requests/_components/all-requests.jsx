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

const columns = [
  {
    accessorKey: "student.name",
    header: "اسم الطالب",
    cell: ({ row }) => <span>{row.original.student?.name}</span>,
  },
  {
    accessorKey: "student.email",
    header: "البريد الإلكتروني",
    cell: ({ row }) => <span>{row.original.student?.email}</span>,
  },
  {
    accessorKey: "school.name",
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
      return <span className={color}>{status}</span>
    },
  },
]

export function StudentCardRequestsTable() {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)

  const [sorting, setSorting] = useState([])
  const [columnFilters, setColumnFilters] = useState([])
  const [columnVisibility, setColumnVisibility] = useState({})
  const [rowSelection, setRowSelection] = useState({})

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const token = getCookie("token")

        if (!token) throw new Error("No token found")

        const res = await fetch("/api/admin/id-requests", {
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
  }, [])

  const table = useReactTable({
    data: requests,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  return (
    <Card>
      <CardHeader className="flex flex-col md:flex-row justify-between items-center gap-2">
        <CardTitle>طلبات بطاقات الطلاب</CardTitle>
        <Input
          placeholder="ابحث باسم الطالب..."
          value={table.getColumn("student.name")?.getFilterValue() || ""}
          onChange={(e) =>
            table.getColumn("student.name")?.setFilterValue(e.target.value)
          }
          className="max-w-sm"
        />
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
                  <TableCell
                    colSpan={columns.length}
                    className="text-center h-24"
                  >
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
                  <TableCell
                    colSpan={columns.length}
                    className="text-center h-24"
                  >
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
