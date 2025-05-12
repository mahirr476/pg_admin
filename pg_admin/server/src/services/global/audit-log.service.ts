import { global } from '../../config/db.config';

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
  notes?: string;
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


// export const getAllAuditLogs = async () => {
//     return await global.auditLog.findMany();
// };


// export const getAllAuditLogs = async () => {
//   // Get all audit logs with user information included
//   const auditLogs = await global.auditLog.findMany({
//     include: {
//       user: {
//         select: {
//           // id: true,
//           firstName: true,
//           lastName: true,
//           email: true
//         }
//       }
//     },
//     orderBy: {
//       entry_time: 'desc'
//     }
//   });

//   // Transform the results to include formatted date and user information
//   return auditLogs.map(log => {
//     // Parse JSON strings
//     const newState = log.new_state ? JSON.parse(log.new_state as string) : null;
//     const previousState = log.previous_state ? JSON.parse(log.previous_state as string) : null;
    
//     // Format the date (example: "Mar 8, 2025, 4:54 AM")
//     const formattedDate = new Date(log.entry_time).toLocaleString('en-US', {
//       year: 'numeric',
//       month: 'short',
//       day: 'numeric',
//       hour: 'numeric',
//       minute: '2-digit',
//       hour12: true,
//       timeZone: 'Asia/Dhaka'
//     });

//     // Create user display name if user exists
//     const userName = log.user ? `${log.user.firstName} ${log.user.lastName}` : 'Unknown User';

//     return {
//       ...log,
//       entry_time: log.entry_time,
//       formattedDate,
//       userName,
//       userEmail: log.user?.email || 'Unknown',
//       new_state: newState,
//       previous_state: previousState
//     };
//   });
// };

export const getAllAuditLogs = async (page = 1, limit = 10) => {
  // Calculate the number of records to skip
  const skip = (page - 1) * limit; //If page = 2 and limit = 10, then skip = 10, meaning it skips the first 10 records

  // Get the total count of audit logs for pagination metadata
  const totalCount = await global.auditLog.count();

  // Get paginated audit logs with user information included
  const auditLogs = await global.auditLog.findMany({
    include: {
      user: {
        select: {
          firstName: true,
          lastName: true,
          email: true
        }
      }
    },
    orderBy: {
      entry_time: 'desc'
    },
    skip, //How many rows to skip (calculated earlier).
    take: limit //How many rows to fetch for the current page.
  });

  // Transform the results to include formatted date and user information
  const transformedLogs = auditLogs.map(log => {
    // Parse JSON strings
    const newState = log.new_state ? JSON.parse(log.new_state as string) : null;
    const previousState = log.previous_state ? JSON.parse(log.previous_state as string) : null;
   
    // Format the date (example: "Mar 8, 2025, 4:54 AM")
    const formattedDate = new Date(log.entry_time).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
      timeZone: 'Asia/Dhaka'
    });
    
    // Create user display name if user exists
    const userName = log.user ? `${log.user.firstName} ${log.user.lastName}` : 'Unknown User';
    
    return {
      ...log,
      entry_time: log.entry_time,
      formattedDate,
      userName,
      userEmail: log.user?.email || 'Unknown',
      new_state: newState,
      previous_state: previousState
    };
  });

  // Return both the logs and pagination metadata
  return {
    auditLogs: transformedLogs,
    pagination: {
      total: totalCount,
      page,
      limit,
      totalPages: Math.ceil(totalCount / limit),
      hasMore: page < Math.ceil(totalCount / limit)
    }
  };
};

// deleting multiple audit logs
export const deleteMultipleAuditLogs = async (ids: number[]) => {
  try {
    const result = await global.auditLog.deleteMany({
      where: {
        id: {
          in: ids
        }
      }
    });
    
    return result;
  } catch (error) {
    console.error('Multiple audit logs deletion failed:', error);
    throw error;
  }
};

// Delete single audit log
export const deleteSingleAuditLog = async (id: number) => {
  try {
    const result = await global.auditLog.delete({
      where: {
        id: id
      }
    });
    
    return result;
  } catch (error) {
    console.error('Single audit log deletion failed:', error);
    throw error;
  }
};




