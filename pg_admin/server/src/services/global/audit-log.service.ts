import { global } from '../../config/db.config';

// export const createAuditLog = async ({
//   user_id,
//   action,
//   entity_type,
//   entity_id,
//   ip_address,
//   user_agent,
//   previous_state,
//   new_state,
//   error_message,
// }: {
//   user_id?: number;
//   action: string;
//   entity_type: string;
//   entity_id?: number;
//   ip_address?: string;
//   user_agent?: string;
//   previous_state?: Record<string, any>;
//   new_state?: Record<string, any>;
//   error_message?: string;
// }) => {
//   try {
//     await global.auditLog.create({
//       data: {
//         user_id,
//         action,
//         entity_type,
//         entity_id,
//         ip_address,
//         user_agent,
//         previous_state: previous_state ? JSON.stringify(previous_state) : undefined,
//         new_state: new_state ? JSON.stringify(new_state) : undefined,
//         error_message,
//       },
//     });
//   } catch (error) {
//     console.error('Audit log creation failed:', error);
//     throw new Error('Failed to create audit log');
//   }
// };


interface AuditLogData {
  user_id?: number;
  action: string;
  entity_type: string;
  entity_id?: number;
  ip_address?: string;
  user_agent?: string;
  previous_state?: Record<string, any>;
  new_state?: Record<string, any>;
  error_message?: string;
}

export const createAuditLog = async (data: AuditLogData) => {
  try {
    await global.auditLog.create({
      data: {
        ...data,
        previous_state: data.previous_state ? JSON.stringify(data.previous_state) : undefined,
        new_state: data.new_state ? JSON.stringify(data.new_state) : undefined,
      },
    });
  } catch (error) {
    console.error('Audit log creation failed:', error);
  }
};


export const getAllAuditLogs = async () => {
    return await global.auditLog.findMany();
};




