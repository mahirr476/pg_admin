import { getCompanies, getCompaniesBySlug } from "../../../services/group/client/companies.service";
import { Request, Response } from "express";

export const CompaniesController = {

    getCompanies: async (req: Request, res: Response): Promise<void> => {
        try {
            const activeCompanies = await getCompanies();
            
            res.status(200).json({
                success: true,
                message: "Companies data fetched successfully.",
                data: {
                    business: activeCompanies,
                }
            });
        } catch (error) {
            console.error("Error fetching Companies data:", error);
            res.status(500).json({
                success: false,
                message: (error as Error).message || 'Failed to fetch Companies data'
            });
        }
    },

    getCompaniesBySlug: async (req: Request, res: Response): Promise<void> => {
        try {
            const slug = req.params.slug;
            const companies = await getCompaniesBySlug(slug);

            if (companies) {
                res.status(200).json({
                    success: true,
                    message: "Companies details fetched successfully.",
                    data: {
                        companyDetail: companies,
                    }
                });
            } else {
                res.status(404).json({
                    success: false,
                    message: "Companies not found.",
                });
            }
        } catch (error) {
            console.error("Error fetching Companies details:", error);
            res.status(500).json({
                success: false,
                message: (error as Error).message || "Failed to fetch Companies details.",
            });
        }
    },

};