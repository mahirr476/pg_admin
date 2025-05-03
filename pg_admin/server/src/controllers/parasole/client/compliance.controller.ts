import { Request, Response } from "express";
import { getComplianceWithDetails } from "../../../services/parasole/client/compliance.service";

export const ComplianceController = {
    getCompliance: async (req: Request, res: Response): Promise<void> => {
        try {
            const complianceData = await getComplianceWithDetails();
            
            res.status(200).json({
                success: true,
                message: "Compliance data fetched successfully.",
                data: { complianceData: complianceData }
            });
        } catch (error) {
            console.error("Error fetching Compliance data:", error);
            res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : 'Failed to fetch Compliance data'
            });
        }
    },

};

