"use client"

import { useEffect, useState } from "react"
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
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { SchoolCreateModal } from "./create-school"

export function AllSchoolsTable() {
  const [schools, setSchools] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({ name: "", type: "" })
  const [editingSchoolId, setEditingSchoolId] = useState(null)

  const router = useRouter()

  const getCookie = (name) => {
    const value = `; ${document.cookie}`
    const parts = value.split(`; ${name}=`)
    if (parts.length === 2) return parts.pop().split(";").shift()
    return null
  }

  const fetchSchools = async () => {
    try {
      const token = getCookie("token")
      const res = await fetch(`/api/admin/schools`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      if (!res.ok) throw new Error("Failed to fetch schools")
      const data = await res.json()
      setSchools(data.schools || [])
    } catch (error) {
      console.error("❌ Error loading schools:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSchools()
  }, [])

  const handleSubmit = async () => {
    const token = getCookie("token")
    const url = editingSchoolId
      ? `/api/admin/schools/${editingSchoolId}`
      : `/api/admin/schools`

    const method = editingSchoolId ? "PUT" : "POST"

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      })

      if (!res.ok) throw new Error("Failed to save school")
      await fetchSchools()
      setOpen(false)
      setFormData({ name: "", type: "" })
      setEditingSchoolId(null)
    } catch (error) {
      console.error("❌ Error submitting:", error)
    }
  }

  const handleEdit = (school) => {
  setFormData({ ...school }) // Spread all fields from the school object
  setEditingSchoolId(school._id)
  setOpen(true)
}


  const filtered = schools.filter((school) =>
    school.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <>
      <Card>
        <CardHeader className="flex justify-between items-center">
          <CardTitle>قائمة المدارس</CardTitle>
          <div className="flex gap-2">
            <Input
              placeholder="ابحث باسم المدرسة..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="max-w-sm"
            />
            <SchoolCreateModal open={open} onOpenChange={setOpen} formData={formData} setFormData={setFormData} handleSubmit={handleSubmit} loading={loading}/>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <ScrollArea className="w-full">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>اسم المدرسة</TableHead>
                  <TableHead>النوع</TableHead>
                  <TableHead>عدد الفروع</TableHead>
                  <TableHead>الحالة</TableHead>
                  <TableHead>خيارات</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center h-24">
                      جاري التحميل...
                    </TableCell>
                  </TableRow>
                ) : filtered.length ? (
                  filtered.map((school) => (
                    <TableRow key={school._id}>
                      <TableCell onClick={() => router.push(`/pages/admission/me/schools/${school._id}`)} className="cursor-pointer">
                        {school.name}
                      </TableCell>
                      <TableCell>{school.type}</TableCell>
                      <TableCell>{school.branches?.length || 0}</TableCell>
                      <TableCell>{school.approved ? "✅ معتمد" : "🕒 تحت المراجعة"}</TableCell>
                      <TableCell>
                        <Button size="sm" onClick={() => handleEdit(school)}>تعديل</Button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center h-24">
                      لا توجد مدارس.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </ScrollArea>
        </CardContent>
      </Card>
    </>
  )
}
