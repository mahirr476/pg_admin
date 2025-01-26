"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Trash, Upload } from "lucide-react"
import Image from "next/image"

export default function MediaForm() {
  const [loading, setLoading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string>("")
  const [formData, setFormData] = useState({
    title: "",
    caption: "",
    mediaType: "",
    link: "",
    order: ""
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({...prev, [name]: value}))
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      const reader = new FileReader()
      reader.onloadend = () => setPreview(reader.result as string)
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const data = new FormData()
      Object.entries(formData).forEach(([key, value]) => data.append(key, value))
      if(selectedFile) data.append('file', selectedFile)
      // API call here
      console.log(data)
    } catch (error) {
      console.error(error) 
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="p-6 max-w-full mx-auto ml-64">
      <h2 className="text-2xl font-bold mb-6">Add Media</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block font-medium mb-1">Title</label>
          <Input
            name="title" 
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Caption</label>
          <Textarea
            name="caption"
            value={formData.caption}
            onChange={handleChange}
            className="h-24"
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Type</label>
          <select
            name="mediaType"
            value={formData.mediaType}
            onChange={handleChange}
            className="w-full rounded border p-2"
            required
          >
            <option value="">Select type</option>
            <option value="image">Image</option>
            <option value="video">Video</option>
            <option value="document">Document</option>
          </select>
        </div>

        <div>
          <label className="block font-medium mb-1">Link (Optional)</label>
          <Input
            name="link"
            value={formData.link}
            onChange={handleChange}
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Order</label>
          <Input
            name="order"
            type="number"
            value={formData.order}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Media File</label>
          {preview && (
            <div className="relative w-40 h-40 mb-4">
              <Image
                src={preview}
                alt="Preview"
                fill
                className="rounded object-cover"
              />
              <button
                type="button"
                onClick={() => {
                  setSelectedFile(null)
                  setPreview("")
                }}
                className="absolute -top-2 -right-2 p-1 bg-red-500 rounded-full text-white"
              >
                <Trash size={16} />
              </button>
            </div>
          )}
          
          <Input
            id="file"
            type="file"
            onChange={handleFileUpload}
            className="hidden"
          />
          <label htmlFor="file">
            <Button type="button" variant="outline" className="cursor-pointer">
              <Upload size={16} className="mr-2" />
              Upload File
            </Button>
          </label>
        </div>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline">Cancel</Button>
          <Button disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </Button>
        </div>
      </form>
    </Card>
  )
}
