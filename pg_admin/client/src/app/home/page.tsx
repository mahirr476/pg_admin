'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface Section {
 id: number;
 title: string;
 description: string;
 image: File | null;
}

const initialSections: Section[] = [
 { id: 1, title: 'Section 1', description: 'Description 1', image: null },
 { id: 2, title: 'Section 2', description: 'Description 2', image: null },
 { id: 3, title: 'Section 3', description: 'Description 3', image: null },
 { id: 4, title: 'Section 4', description: 'Description 4', image: null },
 { id: 5, title: 'Section 5', description: 'Description 5', image: null },
 { id: 6, title: 'Section 6', description: 'Description 6', image: null },
];

export default function Home() {
 const [sections, setSections] = useState<Section[]>(initialSections);
 const [editingSection, setEditingSection] = useState<Section | null>(null);

 const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
   e.preventDefault();
   const formData = new FormData(e.currentTarget);

   if (editingSection) {
     const updatedSections = sections.map((section) =>
       section.id === editingSection.id
         ? {
             ...section,
             title: formData.get('title') as string,
             description: formData.get('description') as string,
             image: formData.get('image') as File,
           }
         : section
     );
     setSections(updatedSections);
     setEditingSection(null);
   } else {
     const newSection: Section = {
       id: Date.now(),
       title: formData.get('title') as string,
       description: formData.get('description') as string,
       image: formData.get('image') as File,
     };
     setSections([...sections, newSection]);
   }

   e.currentTarget.reset();
 };

 const handleEdit = (section: Section) => {
   setEditingSection(section);
 };

 const handleDelete = (id: number) => {
   setSections(sections.filter((section) => section.id !== id));
 };

 return (
   <div className="ml-64 p-6 bg-gray-50 min-h-screen">
     <form onSubmit={handleSubmit}>
       <div className="mb-4">
         <label htmlFor="title" className="block mb-2">
           Title
         </label>
         <Input
           type="text"
           id="title"
           name="title"
           defaultValue={editingSection?.title}
           required
         />
       </div>
       <div className="mb-4">
         <label htmlFor="description" className="block mb-2">
           Description
         </label>
         <Textarea
           id="description"
           name="description"
           defaultValue={editingSection?.description}
           required
         />
       </div>
       <div className="mb-4">
         <label htmlFor="image" className="block mb-2">
           Image
         </label>
         <Input type="file" id="image" name="image" accept="image/*" />
       </div>
       <Button type="submit">{editingSection ? 'Update' : 'Submit'}</Button>
       {editingSection && (
         <Button
           type="button"
           onClick={() => setEditingSection(null)}
           className="ml-2"
         >
           Cancel
         </Button>
       )}
     </form>

     {sections.map((section) => (
       <div key={section.id} className="my-4">
         <h2 className="text-xl font-bold">{section.title}</h2>
         <p>{section.description}</p>
         {section.image && (
           <img
             src={URL.createObjectURL(section.image)}
             alt={section.title}
             className="mt-2"
           />
         )}
         <div className="mt-2 flex space-x-2">
           <Button onClick={() => handleEdit(section)}>Edit</Button>
           <Button
             onClick={() => handleDelete(section.id)}
             variant="destructive"
           >
             Delete
           </Button>
         </div>
       </div>
     ))}
   </div>
 );
}