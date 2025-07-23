"use client"

import Image from "next/image"

export default function CardPreview({ idCard, templateImage, fields, formData }) {
  return (
    <div className="bg-white rounded-xl shadow-xl overflow-hidden border-2 border-gray-100 transition-all hover:shadow-2xl">
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-4 text-white">
        <h2 className="text-xl font-bold text-center">معاينة البطاقة</h2>
      </div>

      <div className="p-6 r">
        <div
          style={{
            height: `${idCard.height || 350}px`,
            width: `${idCard.width || 250}px`,
          }}
          className={`relative mx-auto h-[${idCard.height || 350}px] w-[${idCard.width || 250}px] border-2 border-gray-100 rounded-xl overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center shadow-inner`}
        >
          {templateImage ? (
            <>
              <Image
                src={templateImage}
                alt="بطاقة الطالب"
                width={idCard.width || 250}
                height={idCard.height || 350}
                objectFit="contain"
                className="z-0"
              />

              {/* Display fields on top of the card */}
              {fields.map((field, i) => {
                const style = field.style || {}
                const value = formData[field.key]

                const commonStyle = {
                  position: "absolute",
                  left: `${style.xPercentage || 0}%`,
                  top: `${style.yPercentage || 0}%`,
                  width: `${style.width || 100}px`,
                  height: `${style.height || 30}px`,
                  fontSize: `${style.fontSize || 14}px`,
                  fontWeight: style.fontWeight || "normal",
                  color: style.color || "#000",
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                  textOverflow: "ellipsis",
                  textAlign: style.textAlign || "center",
                  backgroundColor: "transparent",
                  padding: "2px",
                  borderRadius: "4px",
                  zIndex: 10,
                }

                if (field.type === "photo" && value instanceof File) {
                  const previewURL = URL.createObjectURL(value)
                  return (
                    <img
                      key={i}
                      src={previewURL}
                      alt={field.key}
                      style={{
                        ...commonStyle,
                        objectFit: "cover",
                        border: "1px solid rgba(0,0,0,0.1)",
                      }}
                    />
                  )
                }

                return (
                  <div key={i} style={commonStyle}>
                    {value || "---"}
                  </div>
                )
              })}
            </>
          ) : (
            <div className="text-center text-gray-400 space-y-2">
              <svg
                className="w-12 h-12 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                ></path>
              </svg>
              <p>لا يوجد قالب للبطاقة</p>
            </div>
          )}
        </div>

        <div className="mt-4 text-sm text-gray-500 text-center">
          <p>املأ النموذج أدناه لرؤية التغييرات على البطاقة</p>
        </div>
      </div>
    </div>
  )
}
