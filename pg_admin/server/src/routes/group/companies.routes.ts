import express from 'express';
import { authMiddleware } from '../../middleware/auth.middleware';
import { authorize } from '../../middleware/authorization.middleware';
import { CompaniesController } from '../../controllers/group/companies.controller';

const router = express.Router();
router.use(authMiddleware);

// Create a new companies
router.post('/companies', authorize(['paragon_group_create']), CompaniesController.companyCreate);

// Get all companies
router.get('/companies', authorize(['paragon_group_view']), CompaniesController.getAllCompanies);

// Get a single company
router.get('/companies/:id', authorize(['paragon_group_view']), CompaniesController.getCompanyById);

// Update a company
router.put('/companies/:id', authorize(['paragon_group_edit']), CompaniesController.updateCompany);

// Delete a company
router.delete('/companies/:id', authorize(['paragon_group_delete']), CompaniesController.deleteCompany);

export default router;