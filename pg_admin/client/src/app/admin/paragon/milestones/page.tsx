
"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Trash, Upload } from "lucide-react"
import Image from "next/image"
import { useState } from "react"

export default function MilestoneForm() {
  const [loading, setLoading] = useState(false)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>("")
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    year: ""
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setSelectedImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setSelectedImage(null)
    setImagePreview("")
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    try {
      setLoading(true)
      const submitData = new FormData()
      submitData.append('title', formData.title)
      submitData.append('description', formData.description)
      submitData.append('year', formData.year)
      if (selectedImage) {
        submitData.append('image', selectedImage)
      }
      console.log(submitData)
      // Add API call here
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-full mx-auto p-6">
      <Card className="p-6">
        <div className="mb-6">
          <h2 className="text-2xl font-bold">Add New Milestone</h2>
          <p className="text-gray-600">Add details about company milestone</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Year</label>
            <Input 
              name="year"
              value={formData.year}
              onChange={handleChange}
              placeholder="YYYY"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Title</label>
            <Input 
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter milestone title"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Description</label>
            <Textarea 
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Enter milestone description"
              className="h-32 resize-none"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Image</label>
            <div className="mb-4">
              {imagePreview && (
                <div className="relative w-[200px] h-[200px] mb-4">
                  <Image
                    fill
                    src={imagePreview}
                    alt="Preview"
                    className="object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={removeImage}
                    className="absolute top-2 right-2 p-1 rounded-full bg-red-500 text-white hover:bg-red-600"
                  >
                    <Trash className="h-4 w-4" />
                  </button>
                </div>
              )}
              <div className="flex items-center gap-4">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                  id="image-upload"
                />
                <label htmlFor="image-upload">
                  <Button type="button" variant="secondary" className="cursor-pointer">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Image
                  </Button>
                </label>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4">
            <Button variant="outline" type="button">Cancel</Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save Milestone"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
