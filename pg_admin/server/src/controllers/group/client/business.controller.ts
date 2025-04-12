import { getBusiness, getBusinessById, getBusinessBySlug, getBusinessCertificationsByBusinessId, getBusinessOperationsByBusinessId, getBusinessProductsByBusinessId, getBusinessUnitsByBusinessId } from "../../../services/group/client/business.service";
import { Request, Response } from "express";

export const BusinessController = {
    getBusinees: async (req: Request, res: Response): Promise<void> => {
        try {
            const business = await getBusiness();
            
            res.status(200).json({
                success: true,
                message: "Business data fetched successfully.",
                data: {
                    business: business,
                }
            });
        } catch (error) {
            console.error("Error fetching Business data:", error);
            res.status(500).json({
                success: false,
                message: (error as Error).message || 'Failed to fetch Business data'
            });
        }
    },

    getBusinessById: async (req: Request, res: Response): Promise<void> => {
        try {
            const businessId = parseInt(req.params.id, 10);
            const business = await getBusinessById(businessId);

            if (business) {
                res.status(200).json({
                    success: true,
                    message: "Business details fetched successfully.",
                    data: business,
                });
            } else {
                res.status(404).json({
                    success: false,
                    message: "Business not found.",
                });
            }
        } catch (error) {
            console.error("Error fetching business details:", error);
            res.status(500).json({
                success: false,
                message: (error as Error).message || "Failed to fetch business details.",
            });
        }
    },

    getBusinessBySlug: async (req: Request, res: Response): Promise<void> => {
        try {
            const slug = req.params.slug;
            const business = await getBusinessBySlug(slug);

            if (business) {
                const id = business.id;
                const businessOperation = await getBusinessOperationsByBusinessId(id);
                const businessProduct = await getBusinessProductsByBusinessId(id);
                const businessUnit = await getBusinessUnitsByBusinessId(id);
                const businessCertification = await getBusinessCertificationsByBusinessId(id)

                res.status(200).json({
                    success: true,
                    message: "Business details fetched successfully.",
                    data: {
                        business: business,
                        operation: businessOperation,
                        product: businessProduct,
                        units: businessUnit,
                        certifications: businessCertification,
                    }
                });
            } else {
                res.status(404).json({
                    success: false,
                    message: "Business not found.",
                });
            }
        } catch (error) {
            console.error("Error fetching business details:", error);
            res.status(500).json({
                success: false,
                message: (error as Error).message || "Failed to fetch business details.",
            });
        }
    },

    

};