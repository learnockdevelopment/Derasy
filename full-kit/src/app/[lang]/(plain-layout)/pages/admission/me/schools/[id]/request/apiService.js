export async function fetchSchoolData(id) {
  const res = await fetch(`/api/schools/my/public/${id}`)
  const data = await res.json()
  if (!res.ok) throw new Error(data.message)
  return data
}

export async function quickRegister(email) {
  const response = await fetch("/api/register/quick-register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  })
  const data = await response.json()
  if (!response.ok) throw new Error(data.message)
  return data
}

export async function verifyOtp(email, otp) {
  const response = await fetch("/api/register/verify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, otp }),
  })
  const data = await response.json()
  if (!response.ok) throw new Error(data.message)
  return data
}

export async function submitCardRequest(id, formData, token) {
  const fd = new FormData()
  fd.append("schoolId", id)

  const fieldsArray = Object.entries(formData).map(([key, value]) => ({
    key,
    value: value instanceof File ? `photo_${key}` : value,
  }))

  Object.entries(formData).forEach(([key, value]) => {
    if (value instanceof File) {
      fd.append(`photo_${key}`, value)
    }
  })

  fd.append("fields", JSON.stringify(fieldsArray))

  const res = await fetch(`/api/schools/my/${id}/card/request`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    body: fd,
  })

  const data = await res.json()
  if (!res.ok) throw new Error(data.message)
  return data
}
