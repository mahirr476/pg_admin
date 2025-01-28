"use client"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Trash, Upload } from "lucide-react"

const COMPANIES = {
  AQUA_BREEDERS: { id: 'aqua-breeders', name: 'Aqua Breeders Ltd' },
  BAY_CHICKS: { id: 'bay-chicks', name: 'Bay Chicks Ltd' },
  BAY_GRAND_PARENTS: { id: 'bay-grand-parents', name: 'Bay Grand Parents Ltd' },
  CHITTAGONG_CHICKS: { id: 'chittagong-chicks', name: 'Chittagong Chicks Ltd' },
  CHITTAGONG_FEED: { id: 'chittagong-feed', name: 'Chittagong Feed Ltd' },
  DENM_POULTRY: { id: 'denm-poultry', name: 'Denm Poultry Complex Pvt Ltd' },
  JESSORE_FEED: { id: 'jessore-feed', name: 'Jessore Feed Ltd' },
  MOYNAMOTI_HATCHERY: { id: 'moynamoti-hatchery', name: 'Moynamoti Hatchery Ltd' },
  PARAGON_AGRO: { id: 'paragon-agro', name: 'Paragon Agro Ltd' },
  PARASOL_ENERGY: { id: 'parasol-energy', name: 'Parasol Energy Ltd' },
  PARAGON_FEED: { id: 'paragon-feed', name: 'Paragon Feed Ltd' },
  PARAGON_PLASTIC: { id: 'paragon-plastic', name: 'Paragon Plastic Ltd' },
  PARAGON_PLAST_FIBER: { id: 'paragon-plast-fiber', name: 'Paragon Plast Fiber Ltd' },
  PARAGON_POULTRY: { id: 'paragon-poultry', name: 'Paragon Poultry Ltd' },
  PARAGON_PRESS: { id: 'paragon-press', name: 'Paragon Press Ltd' },
  PARASOLE_FOOTWARE: { id: 'parasole-footware', name: 'Parasole Footware Ltd' },
  RANGPUR_POULTRY: { id: 'rangpur-poultry', name: 'Rangpur Poultry Ltd' },
  SHALBAHAN_FARMS: { id: 'shalbahan-farms', name: 'Shalbahan Farms Ltd' },
  SYMPA_SOLAR: { id: 'sympa-solar', name: 'Sympa Solar Power Ltd' },
  USHA_POULTRY: { id: 'usha-poultry', name: 'Usha Poultry Ltd' },
  FATEHBAGH_TEA: { id: 'fatehbagh-tea', name: 'Fatehbagh Tea Company Ltd' }
} as const

export default function CompanyForm() {
  const [loading, setLoading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string>("")
  const [formData, setFormData] = useState({
    companyId: '',
    tradingName: '',
    legalName: '',
    registrationNumber: '',
    dateEstablished: '',
    vatNumber: '',
    tinNumber: '',
    address: '',
    phone: '',
    email: '',
    website: '',
    description: '',
    mission: '',
    vision: '',
    coreValues: '',
    businessType: '',
    employeeCount: '',
    annualRevenue: '',
    certifications: '',
    status: 'active'
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
      if(selectedFile) data.append('logo', selectedFile)
      console.log(data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="p-6 max-w-full mx-auto ml-64">
      <h2 className="text-2xl font-bold mb-6">Company Information</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block font-medium mb-1">Select Company</label>
          <select
            name="companyId"
            value={formData.companyId}
            onChange={handleChange}
            className="w-full rounded border p-2"
            required
          >
            <option value="">Select a Company</option>
            {Object.values(COMPANIES).map((company) => (
              <option key={company.id} value={company.id}>
                {company.name}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block font-medium mb-1">Trading Name</label>
            <Input
              name="tradingName"
              value={formData.tradingName}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Legal Name</label>
            <Input
              name="legalName"
              value={formData.legalName}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block font-medium mb-1">Registration Number</label>
            <Input
              name="registrationNumber"
              value={formData.registrationNumber}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Date Established</label>
            <Input
              name="dateEstablished"
              type="date"
              value={formData.dateEstablished}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Business Type</label>
            <Input
              name="businessType"
              value={formData.businessType}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block font-medium mb-1">VAT Number</label>
            <Input
              name="vatNumber"
              value={formData.vatNumber}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block font-medium mb-1">TIN Number</label>
            <Input
              name="tinNumber"
              value={formData.tinNumber}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div>
          <label className="block font-medium mb-1">Address</label>
          <Textarea
            name="address"
            value={formData.address}
            onChange={handleChange}
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block font-medium mb-1">Phone</label>
            <Input
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Email</label>
            <Input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Website</label>
            <Input
              name="website"
              value={formData.website}
              onChange={handleChange}
            />
          </div>
        </div>

        <div>
          <label className="block font-medium mb-1">Description</label>
          <Textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="h-32"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block font-medium mb-1">Mission</label>
            <Textarea
              name="mission"
              value={formData.mission}
              onChange={handleChange}
              className="h-32"
              required
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Vision</label>
            <Textarea
              name="vision"
              value={formData.vision}
              onChange={handleChange}
              className="h-32"
              required
            />
          </div>

          <div>
            <label className="block font-medium mb-1">Core Values</label>
            <Textarea
              name="coreValues"
              value={formData.coreValues}
              onChange={handleChange}
              className="h-32"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

          <div>
            <label className="block font-medium mb-1">Annual Revenue</label>
            <Input
              name="annualRevenue"
              value={formData.annualRevenue}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        <div>
          <label className="block font-medium mb-1">Certifications</label>
          <Textarea
            name="certifications"
            value={formData.certifications}
            onChange={handleChange}
            className="h-24"
            placeholder="List major certifications"
          />
        </div>

        <div>
          <label className="block font-medium mb-1">Company Logo</label>
          {preview && (
            <div className="relative w-40 h-40 mb-4">
              <img
                src={preview}
                alt="Preview"
                className="w-full h-full rounded object-contain absolute top-0 left-0"
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
              Upload Logo
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
          </select>
        </div>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline">Cancel</Button>
          <Button type="submit" disabled={loading}>
            {loading ? "Saving..." : "Save Company"}
          </Button>
        </div>
      </form>
    </Card>
  )
}