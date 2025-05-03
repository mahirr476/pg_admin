import { Request, Response } from "express";
import { getbuyerWithDetails } from "../../../services/parasole/client/buyer.service";

export const BuyerController = {
    getbuyer: async (req: Request, res: Response): Promise<void> => {
        try {
            const buyerData = await getbuyerWithDetails();
            
            res.status(200).json({
                success: true,
                message: "Buyer data fetched successfully.",
                data: { buyerData: buyerData }
            });
        } catch (error) {
            console.error("Error fetching Buyer data:", error);
            res.status(500).json({
                success: false,
                message: error instanceof Error ? error.message : 'Failed to fetch Buyer data'
            });
        }
    },

};

