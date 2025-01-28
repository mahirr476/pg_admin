"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Trash, Upload } from "lucide-react"
import Image from "next/image"

const BUSINESS_ACTIVITIES = {
  POULTRY_FARMING: {
    id: 'poultry-farming',
    title: 'Poultry Farming',
    subItems: ['Layer', 'Broiler', 'Parent Stock', 'Grand Parent Stock']
  },
  PROCESSING_PLANT: {
    id: 'processing-plant',
    title: 'Processing and Further Processing Plant'
  },
  PLASTIC_BAGS: {
    id: 'plastic-bags',
    title: 'Plastic Woven Bags & FIBC'
  },
  TEA_ESTATES: {
    id: 'tea-estates',
    title: 'Tea Estates & Horticulture'
  },
  BISTRO_CAFE: {
    id: 'bistro-cafe',
    title: 'Bistro Cafe & Retail Shops'
  },
  RENEWABLE_ENERGY: {
    id: 'renewable-energy',
    title: 'Renewable Energy'
  },
  FEED_MILLS: {
    id: 'feed-mills',
    title: 'Feed Mills',
    subItems: ['Fish Feed', 'Poultry Feed', 'Cattle Feed']
  },
  CONSUMER_FOODS: {
    id: 'consumer-foods',
    title: 'Consumer Foods'
  },
  FISH_HATCHERY: {
    id: 'fish-hatchery',
    title: 'Fish Hatchery'
  },
  ORGANIC_FERTILIZER: {
    id: 'organic-fertilizer',
    title: 'Organic Fertilizer'
  },
  FLOUR_MILL: {
    id: 'flour-mill',
    title: 'Flour Mill'
  },
  FOOTWEAR: {
    id: 'footwear',
    title: 'Footwear Manufacturing'
  },
  DAIRY: {
    id: 'dairy',
    title: 'Dairy Project'
  }
} as const

type BusinessActivityKey = keyof typeof BUSINESS_ACTIVITIES

export default function BusinessActivityForm() {
  const [loading, setLoading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string>("")
  const [formData, setFormData] = useState({
    activityType: '',
    subItem: '',
    title: "",
    shortDescription: "",
    longDescription: "",
    history: "",
    facilities: "",
    capacity: "",
    technology: "",
    certifications: "",
    achievements: "",
    futureGoals: "",
    location: "",
    employeeCount: "",
    yearEstablished: "",
    status: "active"
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
      if(selectedFile) data.append('image', selectedFile)
      console.log(data)
      // API call here
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const selectedActivity = BUSINESS_ACTIVITIES[formData.activityType as BusinessActivityKey]

  return (
    <Card className="p-6 max-w-full mx-auto ml-64">
      <h2 className="text-2xl font-bold mb-6">Add Business Activity</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block font-medium mb-1">Activity Type</label>
            <select
              name="activityType"
              value={formData.activityType}
              onChange={handleChange}
              className="w-full rounded border p-2"
              required
            >
              <option value="">Select Activity Type</option>
              {Object.values(BUSINESS_ACTIVITIES).map((activity) => (
                <option key={activity.id} value={activity.id}>
                  {activity.title}
                </option>
              ))}
            </select>
          </div>

          {selectedActivity?.subItems && (
            <div>
              <label className="block font-medium mb-1">Sub Category</label>
              <select
                name="subItem"
                value={formData.subItem}
                onChange={handleChange}
                className="w-full rounded border p-2"
                required
              >
                <option value="">Select Sub Category</option>
                {selectedActivity.subItems.map((item) => (
                  <option key={item} value={item}>{item}</option>
                ))}
              </select>
            </div>
          )}
        </div>

        <div>
          <label className="block font-medium mb-1">Title</label>
          <Input
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block font-medium mb-1">Short Description</label>
            <Textarea
              name="shortDescription"
              value={formData.shortDescription}
              onChange={handleChange}
              className="h-24"
              placeholder="Brief overview"
              required
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Long Description</label>
            <Textarea
              name="longDescription"
              value={formData.longDescription}
              onChange={handleChange}
              className="h-24"
              placeholder="Detailed description"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block font-medium mb-1">Year Established</label>
            <Input
              name="yearEstablished"
              type="number"
              value={formData.yearEstablished}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Location</label>
            <Input
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Employee Count</label>
            <Input
              name="employeeCount"
              type="number"
              value={formData.employeeCount}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div>
          <label className="block font-medium mb-1">History</label>
          <Textarea
            name="history"
            value={formData.history}
            onChange={handleChange}
            className="h-32"
            placeholder="Company history and background"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block font-medium mb-1">Facilities</label>
            <Textarea
              name="facilities"
              value={formData.facilities}
              onChange={handleChange}
              className="h-32"
              placeholder="Available facilities"
              required
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Technology</label>
            <Textarea
              name="technology"
              value={formData.technology}
              onChange={handleChange}
              className="h-32"
              placeholder="Technology and equipment used"
              required
            />
          </div>
        </div>

        <div>
          <label className="block font-medium mb-1">Capacity</label>
          <Textarea
            name="capacity"
            value={formData.capacity}
            onChange={handleChange}
            className="h-24"
            placeholder="Production capacity"
            required
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Certifications</label>
          <Textarea
            name="certifications"
            value={formData.certifications}
            onChange={handleChange}
            className="h-24"
            placeholder="List major certifications and accreditations"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Achievements</label>
          <Textarea
            name="achievements"
            value={formData.achievements}
            onChange={handleChange}
            className="h-24"
            placeholder="List key achievements and milestones"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Future Goals</label>
          <Textarea
            name="futureGoals"
            value={formData.futureGoals}
            onChange={handleChange}
            className="h-24"
            placeholder="Outline future plans and objectives"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Activity Images</label>
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
            accept="image/*"
            className="hidden"
          />
          <label htmlFor="file">
            <Button type="button" variant="outline" className="cursor-pointer">
              <Upload size={16} className="mr-2" />
              Upload Image
            </Button>
          </label>
        </div>

        <div>
          <label className="block font-medium mb-1">Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full rounded border p-2"
            required
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="draft">Draft</option>
          </select>
        </div>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline">Cancel</Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Save Activity"}
          </Button>
        </div>
      </form>
    </Card>
  )
}
