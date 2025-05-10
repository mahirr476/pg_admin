import { Request, Response } from "express";
import { getOperationWithDetails } from "../../../services/parasole/client/operation.service";

export const OperationController = {
    getOperation: async (req: Request, res: Response): Promise<void> => {
        try {
            const operationData = await getOperationWithDetails();
            
            res.status(200).json({
                success: true,
                message: "Operation data fetched successfully.",
                data: { operationData: operationData }
            });
        } catch (error) {
            console.error("Error fetching Operation data:", error);
            res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : 'Failed to fetch Operation data'
            });
        }
    },

};

