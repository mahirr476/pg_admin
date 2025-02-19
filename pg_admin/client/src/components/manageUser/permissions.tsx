"use client"
import React, { useState, useEffect } from 'react';
import { Table, TableHead, TableBody, TableRow, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { toast } from 'sonner';

interface Permission {
  id: string;
  name: string;
  description: string;
}

const Permissions: React.FC = () => {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentPermission, setCurrentPermission] = useState<Permission | null>(null);
  const [formData, setFormData] = useState({ name: '', description: '' });

  useEffect(() => {
    fetchPermissions();
  }, []);

  const fetchPermissions = async () => {
    setIsLoading(true);
    try {
      // Replace this with your actual API call
      const response = await fetch('https://api.example.com/permissions');
      const data = await response.json();
      setPermissions(data);
    } catch (error) {
      console.error('Error fetching permissions:', error);
      toast.error('Failed to fetch permissions');
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenDialog = (permission: Permission | null = null) => {
    setCurrentPermission(permission);
    setFormData(permission || { name: '', description: '' });
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setCurrentPermission(null);
    setFormData({ name: '', description: '' });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (currentPermission) {
        // Update existing permission
        await updatePermission(currentPermission.id, formData);
        toast.success('Permission updated successfully');
      } else {
        // Create new permission
        await createPermission(formData);
        toast.success('Permission created successfully');
      }
      fetchPermissions();
      handleCloseDialog();
    } catch (error) {
      console.error('Error saving permission:', error);
      toast.error('Failed to save permission');
    }
  };

  const handleDeletePermission = async (permissionId: string) => {
    if (window.confirm('Are you sure you want to delete this permission?')) {
      try {
        await deletePermission(permissionId);
        toast.success('Permission deleted successfully');
        fetchPermissions();
      } catch (error) {
        console.error('Error deleting permission:', error);
        toast.error('Failed to delete permission');
      }
    }
  };

  // Mock API functions - replace these with actual API calls
  const createPermission = async (permissionData: { name: string; description: string }) => {
    // Implement create permission API call
  };

  const updatePermission = async (permissionId: string, permissionData: { name: string; description: string }) => {
    // Implement update permission API call
  };

  const deletePermission = async (permissionId: string) => {
    // Implement delete permission API call
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Permission Management</h1>
      <Button onClick={() => handleOpenDialog()} className="mb-4">Add New Permission</Button>
      
      {isLoading ? (
        <p>Loading permissions...</p>
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {permissions.map((permission) => (
              <TableRow key={permission.id}>
                <TableCell>{permission.name}</TableCell>
                <TableCell>{permission.description}</TableCell>
                <TableCell>
                  <Button onClick={() => handleOpenDialog(permission)} className="mr-2">Edit</Button>
                  <Button onClick={() => handleDeletePermission(permission.id)} variant="destructive">Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{currentPermission ? 'Edit Permission' : 'Add New Permission'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <Input
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Permission Name"
                required
              />
              <Input
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Permission Description"
                required
              />
            </div>
            <DialogFooter className="mt-4">
              <Button type="button" variant="outline" onClick={handleCloseDialog}>Cancel</Button>
              <Button type="submit">{currentPermission ? 'Update' : 'Create'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Permissions;