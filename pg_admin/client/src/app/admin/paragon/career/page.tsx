// "use client"
// import { useState } from "react"
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import { Textarea } from "@/components/ui/textarea"
// import { Card } from "@/components/ui/card"
// import { Trash, Upload } from "lucide-react"
// import Image from "next/image"

// export default function CareerForm() {
//   const [loading, setLoading] = useState(false)
//   const [selectedFile, setSelectedFile] = useState<File | null>(null)
//   const [preview, setPreview] = useState<string>("")
//   const [formData, setFormData] = useState({
//     jobTitle: "",
//     department: "",
//     location: "",
//     type: "", // Full-time, Part-time, Contract
//     experience: "",
//     salary: "",
//     description: "",
//     requirements: "",
//     responsibilities: "",
//     deadline: "",
//     status: "active"
//   })

//   const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
//     const { name, value } = e.target
//     setFormData(prev => ({...prev, [name]: value}))
//   }

//   const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0]
//     if (file) {
//       setSelectedFile(file)
//       const reader = new FileReader()
//       reader.onloadend = () => setPreview(reader.result as string)
//       reader.readAsDataURL(file)
//     }
//   }

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault()
//     setLoading(true)
//     try {
//       const data = new FormData()
//       Object.entries(formData).forEach(([key, value]) => data.append(key, value))
//       if(selectedFile) data.append('image', selectedFile)
//       console.log(data)
//       // API call here
//     } catch (error) {
//       console.error(error)
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <Card className="p-6 max-w-full mx-auto">
//       <h2 className="text-2xl font-bold mb-6">Post New Job</h2>
      
//       <form onSubmit={handleSubmit} className="space-y-6">
//         <div>
//           <label className="block font-medium mb-1">Job Title</label>
//           <Input
//             name="jobTitle"
//             value={formData.jobTitle}
//             onChange={handleChange}
//             placeholder="e.g. Senior Software Engineer"
//             required
//           />
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <div>
//             <label className="block font-medium mb-1">Department</label>
//             <Input
//               name="department"
//               value={formData.department}
//               onChange={handleChange}
//               placeholder="e.g. Engineering"
//               required
//             />
//           </div>

//           <div>
//             <label className="block font-medium mb-1">Location</label>
//             <Input
//               name="location"
//               value={formData.location}
//               onChange={handleChange}
//               placeholder="e.g. Dhaka, Bangladesh"
//               required
//             />
//           </div>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//           <div>
//             <label className="block font-medium mb-1">Type</label>
//             <select
//               name="type"
//               value={formData.type}
//               onChange={handleChange}
//               className="w-full rounded border p-2"
//               required
//             >
//               <option value="">Select type</option>
//               <option value="full-time">Full Time</option>
//               <option value="part-time">Part Time</option>
//               <option value="contract">Contract</option>
//             </select>
//           </div>

//           <div>
//             <label className="block font-medium mb-1">Experience (Years)</label>
//             <Input
//               name="experience"
//               value={formData.experience}
//               onChange={handleChange}
//               placeholder="e.g. 3-5"
//               required
//             />
//           </div>

//           <div>
//             <label className="block font-medium mb-1">Salary Range</label>
//             <Input
//               name="salary"
//               value={formData.salary}
//               onChange={handleChange}
//               placeholder="e.g. $60K-80K"
//               required
//             />
//           </div>
//         </div>

//         <div>
//           <label className="block font-medium mb-1">Job Description</label>
//           <Textarea
//             name="description"
//             value={formData.description}
//             onChange={handleChange}
//             className="h-32"
//             placeholder="Enter detailed job description"
//             required
//           />
//         </div>

//         <div>
//           <label className="block font-medium mb-1">Requirements</label>
//           <Textarea
//             name="requirements"
//             value={formData.requirements}
//             onChange={handleChange}
//             className="h-32"
//             placeholder="Enter job requirements"
//             required
//           />
//         </div>

//         <div>
//           <label className="block font-medium mb-1">Responsibilities</label>
//           <Textarea
//             name="responsibilities"
//             value={formData.responsibilities}
//             onChange={handleChange}
//             className="h-32"
//             placeholder="Enter key responsibilities"
//             required
//           />
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//           <div>
//             <label className="block font-medium mb-1">Application Deadline</label>
//             <Input
//               type="date"
//               name="deadline"
//               value={formData.deadline}
//               onChange={handleChange}
//               required
//             />
//           </div>

//           <div>
//             <label className="block font-medium mb-1">Status</label>
//             <select
//               name="status"
//               value={formData.status}
//               onChange={handleChange}
//               className="w-full rounded border p-2"
//               required
//             >
//               <option value="active">Active</option>
//               <option value="draft">Draft</option>
//               <option value="closed">Closed</option>
//             </select>
//           </div>
//         </div>

//         <div>
//           <label className="block font-medium mb-1">Department Image</label>
//           {preview && (
//             <div className="relative w-40 h-40 mb-4">
//               <Image
//                 src={preview}
//                 alt="Preview"
//                 fill
//                 className="rounded object-cover"
//               />
//               <button
//                 type="button"
//                 onClick={() => {
//                   setSelectedFile(null)
//                   setPreview("")
//                 }}
//                 className="absolute -top-2 -right-2 p-1 bg-red-500 rounded-full text-white"
//               >
//                 <Trash size={16} />
//               </button>
//             </div>
//           )}
          
//           <Input
//             id="file"
//             type="file"
//             onChange={handleFileUpload}
//             accept="image/*"
//             className="hidden"
//           />
//           <label htmlFor="file">
//             <Button type="button" variant="outline" className="cursor-pointer">
//               <Upload size={16} className="mr-2" />
//               Upload Image
//             </Button>
//           </label>
//         </div>

//         <div className="flex justify-end gap-4">
//           <Button type="button" variant="outline">Cancel</Button>
//           <Button disabled={loading}>
//             {loading ? "Saving..." : "Post Job"}
//           </Button>
//         </div>
//       </form>
//     </Card>
//   )
// }


import CareerAreaModal from '@/components/paragon/career/careerArea'
import CareerModal from '@/components/paragon/career/careerHero'
import React from 'react'

const Career = () => {
  return (
    <div>
      <CareerModal/>
      <CareerAreaModal/>
    </div>
  )
}

export default Career