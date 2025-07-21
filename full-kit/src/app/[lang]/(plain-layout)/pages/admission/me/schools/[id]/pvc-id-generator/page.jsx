"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Swal from "sweetalert2";
import { Rnd } from "react-rnd";

export default function EditSchoolCardFieldsPage() {
  const router = useRouter();
  const { id } = useParams();
  const [studentIdCardFields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [template, setTemplate] = useState("");
  useEffect(() => {
    if (!id) return;

    async function fetchCardFields() {
      try {
        const res = await fetch(`/api/schools/my/${id}`);
        const data = await res.json();

        if (!res.ok) throw new Error(data.message);
        setFields(
          (data.school?.studentIdCardFields || []).map((field) => ({
            ...field,
            style: field.style || { x: 10, y: 10, width: 120, height: 30, zIndex: 1 },
          }))
        );
        setTemplate(data.school?.idCard.url || "");
      } catch (err) {
        Swal.fire({ icon: "error", title: "خطأ", text: err.message });
      } finally {
        setLoading(false);
      }
    }

    fetchCardFields();
  }, [id]);

  function handleCardFieldChange(index, key, value) {
    const updatedFields = [...studentIdCardFields];
    updatedFields[index][key] = value;

    if (key === "type" && value !== "select") {
      updatedFields[index].options = [];
    }

    setFields(updatedFields);
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
    ]);
  }

  function handleRemoveCardField(index) {
    const updatedFields = [...studentIdCardFields];
    updatedFields.splice(index, 1);
    setFields(updatedFields);
  }

  function bringForward(index) {
    const updated = [...studentIdCardFields];
    updated[index].style.zIndex = (updated[index].style.zIndex || 1) + 1;
    setFields(updated);
  }

  function sendBackward(index) {
    const updated = [...studentIdCardFields];
    updated[index].style.zIndex = Math.max(1, (updated[index].style.zIndex || 1) - 1);
    setFields(updated);
  }

  async function handleSave(e) {
    e.preventDefault();

    for (const field of studentIdCardFields) {
      if (!field.key || !field.type) {
        Swal.fire({ icon: "warning", title: "تحذير", text: "يرجى تعبئة كل الحقول المطلوبة" });
        return;
      }
    }

    try {
      const res = await fetch(`/api/schools/my/${id}/card`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentIdCardFields }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      Swal.fire({ icon: "success", title: "تم الحفظ بنجاح" });
    } catch (err) {
      Swal.fire({ icon: "error", title: "خطأ", text: err.message });
    }
  }

  if (loading) return <div className="text-center mt-10">جاري التحميل...</div>;
  function handleCardFieldStyleChange(index, key, value) {
    const updated = [...studentIdCardFields];
    updated[index].style = {
      ...(updated[index].style || {}),
      [key]: value,
    };
    setFields(updated);
  }

  return (
    <>
      <form onSubmit={handleSave} className="max-w-5xl mx-auto mt-10 p-6 font-[Cairo]">
        <h1 className="text-2xl font-bold text-center mb-6 text-purple-700">
          تعديل حقول بطاقة الطالب
        </h1>
        <div className="mb-6">
          <label className="block font-medium mb-2">خلفية البطاقة</label>
          <input
            type="file"
            accept="image/*"
            onChange={async (e) => {
              const file = e.target.files?.[0];
              if (!file) return;

              const formData = new FormData();
              formData.append("file", file);

              const upload = await fetch(`/api/schools/my/${id}/template`, {
                method: "POST",
                body: formData,
              });

              const result = await upload.json();
              if (upload.ok) {
                setCardBackgroundUrl(result.url);
                Swal.fire({ icon: "success", title: "تم رفع الخلفية بنجاح" });
              } else {
                Swal.fire({ icon: "error", title: "فشل الرفع", text: result.message });
              }
            }}
            className="border rounded px-4 py-2"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Left: Editor */}
          <div>
            {studentIdCardFields.map((field, index) => (
              <div key={index} className="mb-4 p-4 border rounded bg-gray-50">
                {/* Key + Type + Delete */}
                <div className="flex gap-2 items-center mb-2">
                  <input
                    type="text"
                    placeholder="اسم الحقل (key)"
                    value={field.key}
                    onChange={(e) => handleCardFieldChange(index, "key", e.target.value)}
                    className="p-2 border rounded w-1/2"
                  />
                  <select
                    value={field.type}
                    onChange={(e) => handleCardFieldChange(index, "type", e.target.value)}
                    className="p-2 border rounded w-1/2"
                  >
                    <option value="text">نص</option>
                    <option value="number">رقم</option>
                    <option value="date">تاريخ</option>
                    <option value="photo">صورة</option>
                    <option value="select">اختيار من قائمة</option>
                  </select>
                  <button
                    type="button"
                    onClick={() => handleRemoveCardField(index)}
                    className="text-red-600 ml-2"
                  >
                    حذف
                  </button>
                </div>

                {/* Select Options */}
                {field.type === "select" && (
                  <input
                    type="text"
                    placeholder="القيم (مفصولة بفواصل)"
                    value={field.options?.join(",") || ""}
                    onChange={(e) =>
                      handleCardFieldChange(
                        index,
                        "options",
                        e.target.value.split(",").map((opt) => opt.trim())
                      )
                    }
                    className="p-2 border rounded w-full mb-2"
                  />
                )}

                {/* Style Controls */}
                <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                  <input
                    type="number"
                    placeholder="X"
                    value={field.style?.x || 0}
                    onChange={(e) => handleCardFieldStyleChange(index, "x", parseInt(e.target.value))}
                    className="p-1 border rounded"
                  />
                  <input
                    type="number"
                    placeholder="Y"
                    value={field.style?.y || 0}
                    onChange={(e) => handleCardFieldStyleChange(index, "y", parseInt(e.target.value))}
                    className="p-1 border rounded"
                  />
                  <input
                    type="number"
                    placeholder="العرض (Width)"
                    value={field.style?.width || 120}
                    onChange={(e) => handleCardFieldStyleChange(index, "width", parseInt(e.target.value))}
                    className="p-1 border rounded"
                  />
                  <input
                    type="number"
                    placeholder="الارتفاع (Height)"
                    value={field.style?.height || 30}
                    onChange={(e) => handleCardFieldStyleChange(index, "height", parseInt(e.target.value))}
                    className="p-1 border rounded"
                  />
                  <input
                    type="number"
                    placeholder="حجم الخط"
                    value={field.style?.fontSize || 12}
                    onChange={(e) => handleCardFieldStyleChange(index, "fontSize", parseInt(e.target.value))}
                    className="p-1 border rounded"
                  />
                  <input
                    type="text"
                    placeholder="لون النص (hex)"
                    value={field.style?.color || "#000000"}
                    onChange={(e) => handleCardFieldStyleChange(index, "color", e.target.value)}
                    className="p-1 border rounded"
                  />
                  <select
                    value={field.style?.fontWeight || "normal"}
                    onChange={(e) => handleCardFieldStyleChange(index, "fontWeight", e.target.value)}
                    className="p-1 border rounded"
                  >
                    <option value="normal">عادي</option>
                    <option value="bold">عريض</option>
                  </select>
                  <input
                    type="number"
                    placeholder="Z-Index"
                    value={field.style?.zIndex || 1}
                    onChange={(e) => handleCardFieldStyleChange(index, "zIndex", parseInt(e.target.value))}
                    className="p-1 border rounded"
                  />
                </div>

                {/* Layer Buttons */}
                <div className="flex gap-4 mt-3">
                  <button
                    type="button"
                    onClick={() => bringForward(index)}
                    className="text-sm px-2 py-1 bg-blue-100 hover:bg-blue-200 rounded"
                  >
                    للأمام
                  </button>
                  <button
                    type="button"
                    onClick={() => sendBackward(index)}
                    className="text-sm px-2 py-1 bg-blue-100 hover:bg-blue-200 rounded"
                  >
                    للخلف
                  </button>
                </div>
              </div>
            ))}

            {/* Add Button */}
            <button
              type="button"
              onClick={handleAddCardField}
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded"
            >
              + إضافة حقل جديد
            </button>
          </div>


          {/* Right: Preview */}
          <div>
            <h2 className="text-lg font-semibold mb-3 text-gray-700 text-center">معاينة البطاقة</h2>
            <div
              className="w-[350px] h-[220px] border rounded shadow-md p-4 mx-auto relative bg-cover bg-center"
              style={{ backgroundImage: `url(${template})` }}
            >

              {studentIdCardFields.map((field, index) => (
                <Rnd
                  key={index}
                  size={{ width: field.style?.width || 120, height: field.style?.height || 30 }}
                  position={{ x: field.style?.x || 0, y: field.style?.y || 0 }}
                  style={{ zIndex: field.style?.zIndex || 1 }}
                  bounds="parent"
                  onDragStop={(e, d) => {
                    const updated = [...studentIdCardFields];
                    updated[index].style.x = d.x;
                    updated[index].style.y = d.y;
                    setFields(updated);
                  }}
                  onResizeStop={(e, direction, ref, delta, position) => {
                    const updated = [...studentIdCardFields];
                    updated[index].style.width = parseInt(ref.style.width);
                    updated[index].style.height = parseInt(ref.style.height);
                    updated[index].style.x = position.x;
                    updated[index].style.y = position.y;
                    setFields(updated);
                  }}
                >
                  <div className="border bg-white bg-opacity-90 text-xs p-1 cursor-move h-full w-full overflow-hidden">
                    <strong>{field.key}</strong>
                  </div>
                </Rnd>
              ))}
            </div>
          </div>
        </div>

        <div className="text-center mt-8">
          <button
            type="submit"
            className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700"
          >
            حفظ التعديلات
          </button>
        </div>
      </form>
      <div className="text-center mt-4">
        <button
          type="button"
          onClick={() => {
            const link = `${window.location.origin}/pages/admission/me/schools/${id}/request`;
            navigator.clipboard.writeText(link);

            Swal.fire({
              icon: 'success',
              title: 'تم نسخ الرابط!',
              html: `تم نسخ رابط طلب البطاقة إلى الحافظة:<br><a href="${link}" target="_blank">${link}</a>`,
              confirmButtonText: 'تم',
            });
          }}

          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
        >
          نسخ رابط طلب البطاقة
        </button>
      </div>
    </>
  );
}