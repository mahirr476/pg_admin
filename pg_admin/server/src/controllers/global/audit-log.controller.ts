import { Request, Response } from 'express';
import { getAllAuditLogs } from '../../services/global/audit-log.service';

export const AuditController = {
  // Get all auditLogs
  getAll: async (_req: Request, res: Response) => {
      try {
          const auditLogs = await getAllAuditLogs();
          res.status(200).json({ 
              status: "success",
              message: 'AuditLog fetched successfully', 
              auditLogs 
          });
      } catch (error) {
          // console.error('Error fetch auditLogs:', error);
          res.status(500).json({ 
              error: (error as Error).message || 'Failed to fetch auditLogs' });
      }
  },
};

