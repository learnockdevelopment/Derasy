"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Rnd } from "react-rnd"
import Swal from "sweetalert2"

export default function EditSchoolCardFieldsPage() {
  const router = useRouter()
  const { id } = useParams()
  const [studentIdCardFields, setFields] = useState([])
  const [loading, setLoading] = useState(true)
  const [template, setTemplate] = useState("")
  const [uploadProgress, setUploadProgress] = useState(0)
  const [cardDimensions, setCardDimensions] = useState({
    width: 350,
    height: 220,
    aspectRatio: "free",
  })
  async function fetchCardFields() {
    try {
      const res = await fetch(`/api/schools/my/${id}`)
      const data = await res.json()
      console.log("Fetched card fields:", data)
      if (!res.ok) throw new Error(data.message)
      setFields(
        (data.school?.studentIdCardFields || []).map((field) => ({
          ...field,
          style: field.style || {
            x: 10,
            y: 10,
            width: 120,
            height: 30,
            zIndex: 1,
          },
        }))
      )
      setTemplate(data.school?.idCard?.url || "")

      // Set saved dimensions if they exist
      if (data.school?.idCard) {
        setCardDimensions(data.school.idCard)
      }
    } catch (err) {
      Swal.fire({ icon: "error", title: "خطأ", text: err.message })
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    if (!id) return

    fetchCardFields()
  }, [id])

  function handleCardFieldChange(index, key, value) {
    const updatedFields = [...studentIdCardFields]
    updatedFields[index][key] = value

    if (key === "type" && value !== "select") {
      updatedFields[index].options = []
    }

    setFields(updatedFields)
  }

  function handleAddCardField() {
    setFields([
      ...studentIdCardFields,
      {
        key: "",
        type: "text",
        options: [],
        style: { x: 10, y: 10, width: 120, height: 30, zIndex: 1 },
      },
    ])
  }

  function handleRemoveCardField(index) {
    const updatedFields = [...studentIdCardFields]
    updatedFields.splice(index, 1)
    setFields(updatedFields)
  }

  function bringForward(index) {
    const updated = [...studentIdCardFields]
    updated[index].style.zIndex = (updated[index].style.zIndex || 1) + 1
    setFields(updated)
  }

  function sendBackward(index) {
    const updated = [...studentIdCardFields]
    updated[index].style.zIndex = Math.max(
      1,
      (updated[index].style.zIndex || 1) - 1
    )
    setFields(updated)
  }
  async function saveCardSettings() {
    const res = await fetch(`/api/schools/my/${id}/dimensions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(cardDimensions),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.message)
    return data
  }

  async function saveCardFields() {
    const res = await fetch(`/api/schools/my/${id}/card`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ studentIdCardFields }),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.message)
    return data
  }

  async function handleSave(e) {
    e.preventDefault()

    for (const field of studentIdCardFields) {
      if (!field.key || !field.type) {
        Swal.fire({
          icon: "warning",
          title: "تحذير",
          text: "يرجى تعبئة كل الحقول المطلوبة",
        })
        return
      }
    }

    try {
      // Step 1: Save card settings (dimensions)
      await saveCardSettings()

      // Step 2: Save card fields
      await saveCardFields()
      setLoading(true)
      Swal.fire({ icon: "success", title: "تم الحفظ بنجاح" })
    } catch (err) {
      Swal.fire({ icon: "error", title: "خطأ", text: err.message })
    } finally {
      setLoading(false)
    }
  }

  if (loading) return <div className="text-center mt-10">جاري التحميل...</div>

  function handleCardFieldStyleChange(index, key, value) {
    const updated = [...studentIdCardFields]
    updated[index].style = {
      ...(updated[index].style || {}),
      [key]: value,
    }
    setFields(updated)
  }

  function handleDimensionChange(key, value) {
    setCardDimensions((prev) => {
      const newDims = { ...prev, [key]: value }

      // Maintain aspect ratio if locked
      if (key === "width" && prev.aspectRatio !== "free") {
        const ratio = prev.aspectRatio === "standard" ? 85.6 / 54 : 1
        newDims.height = Math.round(value / ratio)
      } else if (key === "height" && prev.aspectRatio !== "free") {
        const ratio = prev.aspectRatio === "standard" ? 85.6 / 54 : 1
        newDims.width = Math.round(value * ratio)
      }

      return newDims
    })
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 font-[Cairo]">
      <h1 className="text-3xl font-bold text-center mb-8 text-purple-700">
        تعديل حقول بطاقة الطالب
      </h1>

      <form
        onSubmit={handleSave}
        className="bg-white rounded-xl shadow-lg p-6 mb-8"
      >
        {/* Card Dimensions Controls */}
        <div className="mb-8 p-4 border border-gray-200 rounded-lg bg-gray-50">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            إعدادات البطاقة
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Aspect Ratio */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                نسبة الأبعاد
              </label>
              <select
                value={cardDimensions.aspectRatio}
                onChange={(e) =>
                  handleDimensionChange("aspectRatio", e.target.value)
                }
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              >
                <option value="free">حر</option>
                <option value="standard">قياسي (85.6×54 ملم)</option>
                <option value="square">مربع (1:1)</option>
              </select>
            </div>

            {/* Width */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                العرض (بكسل)
              </label>
              <input
                type="number"
                min="100"
                max="1000"
                value={cardDimensions.width}
                onChange={(e) =>
                  handleDimensionChange("width", parseInt(e.target.value))
                }
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Height */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                الارتفاع (بكسل)
              </label>
              <input
                type="number"
                min="100"
                max="1000"
                value={cardDimensions.height}
                onChange={(e) =>
                  handleDimensionChange("height", parseInt(e.target.value))
                }
                className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                disabled={cardDimensions.aspectRatio !== "free"}
              />
            </div>
          </div>
        </div>

        {/* Template Upload */}
       <div className="mb-8">
  <label className="block text-sm font-medium text-gray-700 mb-2">
    خلفية البطاقة
  </label>
  <div className="flex items-center gap-4">
    <label className="flex-1 cursor-pointer">
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:bg-gray-50 transition-colors flex flex-col items-center justify-center relative">
        {uploadProgress > 0 && uploadProgress < 100 && (
          <div className="absolute top-0 left-0 right-0 bg-gray-200 h-2 rounded-t-lg">
            <div 
              className="bg-purple-600 h-full rounded-t-lg transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        )}
        <svg
          className={`w-10 h-10 mb-2 ${uploadProgress > 0 ? 'text-purple-500' : 'text-gray-400'}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
          ></path>
        </svg>
        <span className={`text-sm ${uploadProgress > 0 ? 'text-purple-600' : 'text-gray-500'}`}>
          {uploadProgress > 0 ? 
            `جاري الرفع... ${uploadProgress}%` : 
            'اضغط لرفع صورة الخلفية'}
        </span>
        <input
          type="file"
          accept="image/*"
          onChange={async (e) => {
            const file = e.target.files?.[0]
            if (!file) return

            // Reset progress
            setUploadProgress(0)

            const formData = new FormData()
            formData.append("file", file)

            try {
              const xhr = new XMLHttpRequest()
              
              xhr.upload.addEventListener('progress', (event) => {
                if (event.lengthComputable) {
                  const percentComplete = Math.round((event.loaded / event.total) * 100)
                  setUploadProgress(percentComplete)
                }
              })

              xhr.onreadystatechange = () => {
                if (xhr.readyState === 4) {
                  if (xhr.status === 200) {
                    const result = JSON.parse(xhr.responseText)
                    setTemplate(result.url)
                    setUploadProgress(0) // Reset progress bar
                    Swal.fire({
                      icon: "success",
                      title: "تم رفع الخلفية بنجاح",
                    })
                    fetchCardFields()
                  } else {
                    setUploadProgress(0) // Reset progress bar on error
                    Swal.fire({
                      icon: "error",
                      title: "فشل الرفع",
                      text: xhr.statusText,
                    })
                  }
                }
              }

              xhr.open('POST', `/api/schools/my/${id}/template`, true)
              xhr.send(formData)

            } catch (err) {
              setUploadProgress(0)
              Swal.fire({
                icon: "error",
                title: "فشل الرفع",
                text: err.message,
              })
            }
          }}
          className="hidden"
        />
      </div>
    </label>
    {template && (
      <div className="w-24 h-24 rounded-md overflow-hidden border border-gray-200 shadow-sm">
        <img
          src={template}
          alt="Template Preview"
          className="w-full h-full object-cover"
        />
      </div>
    )}
  </div>
</div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Preview Section */}
          <div className="lg:w-1/2">
            <div className="sticky top-4">
              <h2 className="text-xl font-semibold mb-4 text-gray-800 text-center">
                معاينة البطاقة
              </h2>
              <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm">
                <div
                  className="mx-auto relative bg-cover bg-center bg-gray-100"
                  style={{
                    width: `${cardDimensions.width}px`,
                    height: `${cardDimensions.height}px`,
                    backgroundImage: `url(${template})`,
                    aspectRatio:
                      cardDimensions.aspectRatio === "free"
                        ? "unset"
                        : cardDimensions.aspectRatio === "standard"
                          ? "85.6/54"
                          : "1/1",
                  }}
                >
                  {studentIdCardFields.map((field, index) => (
                    <Rnd
                      key={index}
                      size={{
                        width: field.style?.width || 120,
                        height: field.style?.height || 30,
                      }}
                      position={{
                        x: field.style?.x || 0,
                        y: field.style?.y || 0,
                      }}
                      style={{
                        zIndex: field.style?.zIndex || 1,
                        border: "1px dashed rgba(124, 58, 237, 0.5)",
                        backgroundColor: "rgba(255, 255, 255, 0.7)",
                      }}
                      bounds="parent"
                      onDragStop={(e, d) => {
                        const updated = [...studentIdCardFields]
                        updated[index].style.x = d.x
                        updated[index].style.y = d.y
                        setFields(updated)
                      }}
                      onResizeStop={(e, direction, ref, delta, position) => {
                        const updated = [...studentIdCardFields]
                        updated[index].style.width = parseInt(ref.style.width)
                        updated[index].style.height = parseInt(ref.style.height)
                        updated[index].style.x = position.x
                        updated[index].style.y = position.y
                        setFields(updated)
                      }}
                    >
                      <div className="h-full w-full overflow-hidden flex items-center justify-center p-1">
                        <span className="text-xs font-medium text-purple-700">
                          {field.key}
                        </span>
                      </div>
                    </Rnd>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Fields Editor Section */}
          <div className="lg:w-1/2">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              حقول البطاقة
            </h2>

            {studentIdCardFields.map((field, index) => (
              <div
                key={index}
                className="mb-6 p-4 border border-gray-200 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-medium text-gray-700">
                    الحقل #{index + 1}
                  </h3>
                  <button
                    type="button"
                    onClick={() => handleRemoveCardField(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      ></path>
                    </svg>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      اسم الحقل
                    </label>
                    <input
                      type="text"
                      placeholder="مثال: الاسم، الرقم الجامعي"
                      value={field.key}
                      onChange={(e) =>
                        handleCardFieldChange(index, "key", e.target.value)
                      }
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      نوع الحقل
                    </label>
                    <select
                      value={field.type}
                      onChange={(e) =>
                        handleCardFieldChange(index, "type", e.target.value)
                      }
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="text">نص</option>
                      <option value="number">رقم</option>
                      <option value="date">تاريخ</option>
                      <option value="photo">صورة</option>
                      <option value="select">اختيار من قائمة</option>
                    </select>
                  </div>
                </div>

                {/* Select Options */}
                {field.type === "select" && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      خيارات القائمة (مفصولة بفواصل)
                    </label>
                    <input
                      type="text"
                      placeholder="مثال: علوم, هندسة, طب"
                      value={field.options?.join(",") || ""}
                      onChange={(e) =>
                        handleCardFieldChange(
                          index,
                          "options",
                          e.target.value.split(",").map((opt) => opt.trim())
                        )
                      }
                      className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                )}

                {/* Style Controls */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    إعدادات التنسيق
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">
                        الموقع X
                      </label>
                      <input
                        type="number"
                        value={field.style?.x || 0}
                        onChange={(e) =>
                          handleCardFieldStyleChange(
                            index,
                            "x",
                            parseInt(e.target.value)
                          )
                        }
                        className="w-full p-1 border border-gray-300 rounded text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">
                        الموقع Y
                      </label>
                      <input
                        type="number"
                        value={field.style?.y || 0}
                        onChange={(e) =>
                          handleCardFieldStyleChange(
                            index,
                            "y",
                            parseInt(e.target.value)
                          )
                        }
                        className="w-full p-1 border border-gray-300 rounded text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">
                        العرض
                      </label>
                      <input
                        type="number"
                        value={field.style?.width || 120}
                        onChange={(e) =>
                          handleCardFieldStyleChange(
                            index,
                            "width",
                            parseInt(e.target.value)
                          )
                        }
                        className="w-full p-1 border border-gray-300 rounded text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">
                        الارتفاع
                      </label>
                      <input
                        type="number"
                        value={field.style?.height || 30}
                        onChange={(e) =>
                          handleCardFieldStyleChange(
                            index,
                            "height",
                            parseInt(e.target.value)
                          )
                        }
                        className="w-full p-1 border border-gray-300 rounded text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">
                        حجم الخط
                      </label>
                      <input
                        type="number"
                        value={field.style?.fontSize || 12}
                        onChange={(e) =>
                          handleCardFieldStyleChange(
                            index,
                            "fontSize",
                            parseInt(e.target.value)
                          )
                        }
                        className="w-full p-1 border border-gray-300 rounded text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">
                        لون النص
                      </label>
                      <input
                        type="color"
                        value={field.style?.color || "#000000"}
                        onChange={(e) =>
                          handleCardFieldStyleChange(
                            index,
                            "color",
                            e.target.value
                          )
                        }
                        className="w-full h-8 border border-gray-300 rounded cursor-pointer"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">
                        سمك الخط
                      </label>
                      <select
                        value={field.style?.fontWeight || "normal"}
                        onChange={(e) =>
                          handleCardFieldStyleChange(
                            index,
                            "fontWeight",
                            e.target.value
                          )
                        }
                        className="w-full p-1 border border-gray-300 rounded text-sm"
                      >
                        <option value="normal">عادي</option>
                        <option value="bold">عريض</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-500 mb-1">
                        الطبقة (Z-Index)
                      </label>
                      <input
                        type="number"
                        value={field.style?.zIndex || 1}
                        onChange={(e) =>
                          handleCardFieldStyleChange(
                            index,
                            "zIndex",
                            parseInt(e.target.value)
                          )
                        }
                        className="w-full p-1 border border-gray-300 rounded text-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Layer Controls */}
                <div className="flex justify-between items-center">
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => sendBackward(index)}
                      className="flex items-center gap-1 px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 15l7-7 7 7"
                        ></path>
                      </svg>
                      للخلف
                    </button>
                    <button
                      type="button"
                      onClick={() => bringForward(index)}
                      className="flex items-center gap-1 px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded text-sm"
                    >
                      للأمام
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 9l-7 7-7-7"
                        ></path>
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}

            <button
              type="button"
              onClick={handleAddCardField}
              className="w-full mt-4 px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg flex items-center justify-center gap-2 transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                ></path>
              </svg>
              إضافة حقل جديد
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-4 mt-8">
          <button
            type="submit"
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium flex items-center gap-2 transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              ></path>
            </svg>
            حفظ التعديلات
          </button>

          <button
            type="button"
            onClick={() => {
              const link = `${window.location.origin}/pages/admission/me/schools/${id}/request`
              navigator.clipboard.writeText(link)

              Swal.fire({
                icon: "success",
                title: "تم نسخ الرابط!",
                html: `تم نسخ رابط طلب البطاقة إلى الحافظة:<br><a href="${link}" target="_blank" class="text-blue-600 underline">${link}</a>`,
                confirmButtonText: "تم",
              })
            }}
            className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium flex items-center gap-2 transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
              ></path>
            </svg>
            نسخ رابط طلب البطاقة
          </button>
        </div>
      </form>
    </div>
  )
}
