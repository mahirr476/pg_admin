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
              // auditLogs
              auditLogs: auditLogs.map((auditLog:any) => ({
                id: auditLog.id,
                userName: auditLog.userName,
                userEmail: auditLog.userEmail,
                action: auditLog.action,
                error_message: auditLog.error_message,
                formattedDate: auditLog.formattedDate,
                ip_address: auditLog.ip_address,
                entity_type: auditLog.entity_type,
                entity_id: auditLog.entity_id,
                previous_state: auditLog.previous_state,
                new_state: auditLog.new_state,
                user_agent: auditLog.user_agent,
                notes: auditLog.notes,
              })),
          });
      } catch (error) {
          // console.error('Error fetch auditLogs:', error);
          res.status(500).json({ 
              error: (error as Error).message || 'Failed to fetch auditLogs' });
      }
  },
};

