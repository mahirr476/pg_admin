import { Request, Response } from 'express';
import { deleteMultipleAuditLogs, deleteSingleAuditLog, getAllAuditLogs } from '../../services/global/audit-log.service';

export const AuditController = {
  // Get all auditLogs
  // getAll: async (_req: Request, res: Response) => {
  //     try {
  //         const auditLogs = await getAllAuditLogs();
  //         res.status(200).json({ 
  //             status: "success",
  //             message: 'AuditLog fetched successfully', 
  //             // auditLogs
  //             auditLogs: auditLogs.map((auditLog:any) => ({
  //               id: auditLog.id,
  //               userName: auditLog.userName,
  //               userEmail: auditLog.userEmail,
  //               action: auditLog.action,
  //               error_message: auditLog.error_message,
  //               formattedDate: auditLog.formattedDate,
  //               ip_address: auditLog.ip_address,
  //               entity_type: auditLog.entity_type,
  //               entity_id: auditLog.entity_id,
  //               previous_state: auditLog.previous_state,
  //               new_state: auditLog.new_state,
  //               user_agent: auditLog.user_agent,
  //               notes: auditLog.notes,
  //             })),
  //         });
  //     } catch (error) {
  //         // console.error('Error fetch auditLogs:', error);
  //         res.status(500).json({ 
  //             error: (error as Error).message || 'Failed to fetch auditLogs' });
  //     }
  // },

  getAll: async (req: Request, res: Response) => {
    try {
      // Get pagination parameters from the request query
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      
      // Validate pagination parameters
      if (page < 1 || limit < 1 || limit > 100) {
        return res.status(400).json({
          status: "error",
          message: 'Invalid pagination parameters. Page and limit must be positive, and limit cannot exceed 100.'
        });
      }

      // Get paginated audit logs
      const { auditLogs, pagination } = await getAllAuditLogs(page, limit);
      
      // Transform the auditLogs for the response
      const transformedLogs = auditLogs.map((auditLog: any) => ({
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
      }));

      res.status(200).json({
        status: "success",
        message: 'AuditLogs fetched successfully',
        pagination,
        auditLogs: transformedLogs
      });
    } catch (error) {
      res.status(500).json({
        status: "error",
        message: (error as Error).message || 'Failed to fetch auditLogs'
      });
    }
  },

  // Delete multiple audit logs
  deleteMultiple: async (req: Request, res: Response) => {
    try {
      const { ids } = req.body;
      
      // Validate input
      if (!Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({
          status: "error",
          message: 'Please provide an array of IDs to delete'
        });
      }
      
      // Validate that all IDs are numbers
      const validIds = ids.every(id => typeof id === 'number');
      if (!validIds) {
        return res.status(400).json({
          status: "error",
          message: 'All IDs must be numbers'
        });
      }
      
      // Optional: Limit the number of records that can be deleted at once
      if (ids.length > 100) {
        return res.status(400).json({
          status: "error",
          message: 'Cannot delete more than 100 records at once'
        });
      }
      
      const result = await deleteMultipleAuditLogs(ids);
      
      res.status(200).json({
        status: "success",
        message: `${result.count} audit logs deleted successfully`,
        deletedCount: result.count
      });
    } catch (error) {
      console.error('Error deleting audit logs:', error);
      res.status(500).json({
        status: "error",
        error: (error as Error).message || 'Failed to delete audit logs'
      });
    }
  },

  // Delete single audit log
  deleteSingle: async (req: Request, res: Response) => {
    try {
      const id = parseInt(req.params.id);
      
      // Validate ID
      if (isNaN(id)) {
        return res.status(400).json({
          status: "error",
          message: 'Invalid ID format'
        });
      }
      
      const result = await deleteSingleAuditLog(id);
      
      res.status(200).json({
        status: "success",
        message: 'Audit log deleted successfully',
        deletedId: id
      });
    } catch (error: any) {
      // Handle case where record doesn't exist
      if (error.code === 'P2025') {
        return res.status(404).json({
          status: "error",
          message: 'Audit log not found'
        });
      }
      
      console.error('Error deleting audit log:', error);
      res.status(500).json({
        status: "error",
        error: error.message || 'Failed to delete audit log'
      });
    }
  },

};

