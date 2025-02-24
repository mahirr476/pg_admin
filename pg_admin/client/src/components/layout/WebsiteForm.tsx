// components/WebsiteForm.tsx
"use client"

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Cookies from 'js-cookie';
import { Website } from '@/types/website';

interface WebsiteFormData {
  name: string;
  slug: string;
}

interface WebsiteFormProps {
  onSuccess?: () => void;
  initialData?: Website;
}

export function WebsiteForm({ onSuccess, initialData }: WebsiteFormProps) {
  const [formData, setFormData] = useState<WebsiteFormData>({
    name: initialData?.name || '',
    slug: initialData?.slug || ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const token = Cookies.get('token');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      if (!token) {
        throw new Error('Authentication token not found');
      }

      // Validate form data
      if (!formData.name.trim() || !formData.slug.trim()) {
        throw new Error('Name and slug are required');
      }

      // Create request body
      const requestBody = {
        name: formData.name.trim(),
        slug: formData.slug.trim().toLowerCase(),
      };

      // Make API request
      const response = await fetch('http://localhost:7000/api/v1/website', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
      });

      // Get the response data
      const data = await response.json();

      // Check if the request was successful
      if (!response.ok) {
        throw new Error(data.message || 'Failed to add website');
      }

      // Reset form and show success
      setFormData({ name: '', slug: '' });
      onSuccess?.();

    } catch (err: any) {
      console.error('Error adding website:', err);
      setError(err.message || 'Failed to add website');
    } finally {
      setIsLoading(false);
    }
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.value;
    setFormData(prev => ({
      ...prev,
      name,
      // Auto-generate slug if slug is empty or was auto-generated
      slug: prev.slug === generateSlug(prev.name) ? generateSlug(name) : prev.slug
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      <div className="space-y-2">
        <label className="text-sm font-medium">Website Name</label>
        <Input
          value={formData.name}
          onChange={handleNameChange}
          placeholder="Enter website name"
          disabled={isLoading}
          required
          className="w-full"
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Slug</label>
        <Input
          value={formData.slug}
          onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value.toLowerCase() }))}
          placeholder="enter-slug"
          disabled={isLoading}
          required
          className="w-full"
          pattern="[a-z0-9-]+"
          title="Only lowercase letters, numbers, and hyphens are allowed"
        />
        <p className="text-xs text-gray-500">
          Only lowercase letters, numbers, and hyphens are allowed
        </p>
      </div>

      <Button 
        type="submit" 
        className="w-full"
        disabled={isLoading}
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Adding...
          </span>
        ) : initialData ? 'Update Website' : 'Add Website'}
      </Button>
    </form>
  );
}