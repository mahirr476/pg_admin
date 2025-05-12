
// "use client"

// import { useState, useEffect, useCallback } from 'react'
// import { 
//   Table, 
//   TableHeader, 
//   TableRow, 
//   TableHead, 
//   TableBody, 
//   TableCell
// } from '@/components/ui/table'
// import { 
//   Card, 
//   CardContent, 
//   CardDescription, 
//   CardHeader, 
//   CardTitle,
//   CardFooter
// } from '@/components/ui/card'
// import { Button } from '@/components/ui/button'
// import { Input } from '@/components/ui/input'
// import { 
//   Select, 
//   SelectContent, 
//   SelectItem, 
//   SelectTrigger, 
//   SelectValue 
// } from '@/components/ui/select'
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog"
// import {
//   Tooltip,
//   TooltipContent,
//   TooltipProvider,
//   TooltipTrigger,
// } from "@/components/ui/tooltip"
// import { 
//   Download, 
//   Loader2,
//   AlertCircle,
//   ArrowUpDown,
//   Search,
//   RefreshCw,
//   Eye,
//   Calendar,
//   Mail,
//   User,
//   Globe,
//   HardDrive,
//   Info,
//   Clock
// } from 'lucide-react'
// import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
// import { format } from 'date-fns'
// import { Badge } from '@/components/ui/badge'
// import Cookies from 'js-cookie'

// // Updated interface for the audit log item based on your JSON format
// interface AuditLog {
//   id: number;
//   userName: string;
//   userEmail: string;
//   action: string;
//   error_message: string | null;
//   formattedDate: string;
//   ip_address: string;
//   entity_type: string;
//   entity_id: number | null;
//   previous_state: any;
//   new_state: any;
//   user_agent: string;
//   notes: string | null;
// }

// // Interface for the API response
// interface AuditLogResponse {
//   status: string;
//   message: string;
//   auditLogs: AuditLog[];
// }

// export default function AuditLogsPage() {
//   const [auditLogs, setAuditLogs] = useState<AuditLog[]>([])
//   const [filteredLogs, setFilteredLogs] = useState<AuditLog[]>([])
//   const [isLoading, setIsLoading] = useState(true)
//   const [error, setError] = useState<string | null>(null)
//   const [isRefreshing, setIsRefreshing] = useState(false)
  
//   // Filters
//   const [searchQuery, setSearchQuery] = useState('')
//   const [actionFilter, setActionFilter] = useState('all')
//   const [entityFilter, setEntityFilter] = useState('all')
  
//   // Sorting
//   const [sortColumn, setSortColumn] = useState<string>('formattedDate')
//   const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')

//   useEffect(() => {
//     fetchAuditLogs()
//   }, [])

//   // Modified to show all data by default
//   const applyFilters = useCallback(() => {
//     let result = [...auditLogs]
    
//     // Search filter (case insensitive)
//     if (searchQuery) {
//       const query = searchQuery.toLowerCase()
//       result = result.filter(log => 
//         log.ip_address?.toLowerCase().includes(query) ||
//         log.action?.toLowerCase().includes(query) ||
//         log.entity_type?.toLowerCase().includes(query) ||
//         log.user_agent?.toLowerCase().includes(query) ||
//         log.userName?.toLowerCase().includes(query) ||
//         log.userEmail?.toLowerCase().includes(query) ||
//         (log.error_message && log.error_message.toLowerCase().includes(query))
//       )
//     }
    
//     // Action filter
//     if (actionFilter !== 'all') {
//       result = result.filter(log => log.action === actionFilter)
//     }

//     // Entity filter
//     if (entityFilter !== 'all') {
//       result = result.filter(log => log.entity_type === entityFilter)
//     }
    
//     // Sorting
//     result.sort((a, b) => {
//       let compareA, compareB
      
//       switch (sortColumn) {
//         case 'userName':
//           compareA = a.userName?.toLowerCase() || ''
//           compareB = b.userName?.toLowerCase() || ''
//           break
//         case 'userEmail':
//           compareA = a.userEmail?.toLowerCase() || ''
//           compareB = b.userEmail?.toLowerCase() || ''
//           break
//         case 'action':
//           compareA = a.action?.toLowerCase() || ''
//           compareB = b.action?.toLowerCase() || ''
//           break
//         case 'ip_address':
//           compareA = a.ip_address?.toLowerCase() || ''
//           compareB = b.ip_address?.toLowerCase() || ''
//           break
//         case 'entity_type':
//           compareA = a.entity_type?.toLowerCase() || ''
//           compareB = b.entity_type?.toLowerCase() || ''
//           break
//         case 'formattedDate':
//         default:
//           // Parse the formatted date back to a timestamp for sorting
//           const dateA = new Date(a.formattedDate).getTime() || 0
//           const dateB = new Date(b.formattedDate).getTime() || 0
//           compareA = dateA
//           compareB = dateB
//       }
      
//       if (compareA < compareB) return sortDirection === 'asc' ? -1 : 1
//       if (compareA > compareB) return sortDirection === 'asc' ? 1 : -1
//       return 0
//     })
    
//     setFilteredLogs(result)
//   }, [auditLogs, searchQuery, actionFilter, entityFilter, sortColumn, sortDirection])

//   useEffect(() => {
//     applyFilters()
//   }, [applyFilters])

//   useEffect(() => {
//     applyFilters()
//   }, [searchQuery, actionFilter, entityFilter, auditLogs, sortColumn, sortDirection, applyFilters])

//   const fetchAuditLogs = async () => {
//     setIsLoading(true)
//     setError(null)
    
//     try {
//       const token = Cookies.get('token')
      
//       if (!token) {
//         setError('Authentication token not found')
//         setIsLoading(false)
//         return
//       }
      
//       const response = await fetch('http://localhost:7000/api/v1/audit-logs', {
//         headers: {
//           Authorization: `Bearer ${token}`,
//           'Content-Type': 'application/json'
//         }
//       })
      
//       if (!response.ok) {
//         throw new Error(`Failed to fetch audit logs: ${response.status}`)
//       }
      
//       const data: AuditLogResponse = await response.json()
//       console.log('Audit logs data:', data)
      
//       if (data.status === 'success' && Array.isArray(data.auditLogs)) {
//         setAuditLogs(data.auditLogs)
//         setFilteredLogs(data.auditLogs)
//       } else {
//         throw new Error('Invalid response format')
//       }
//     } catch (err) {
//       console.error('Error fetching audit logs:', err)
//       setError(err instanceof Error ? err.message : 'Failed to fetch audit logs')
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   const refreshData = async () => {
//     setIsRefreshing(true)
//     await fetchAuditLogs()
//     setIsRefreshing(false)
//   }

//   const toggleSort = (column: string) => {
//     if (sortColumn === column) {
//       setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
//     } else {
//       setSortColumn(column)
//       setSortDirection('asc')
//     }
//   }

//   const clearFilters = () => {
//     setSearchQuery('')
//     setActionFilter('all')
//     setEntityFilter('all')
//   }

//   const handleExport = () => {
//     // Create CSV content
//     const headers = ['ID', 'User Name', 'User Email', 'Action', 'Entity Type', 'Time', 'IP Address', 'User Agent', 'Notes']
//     let csvContent = headers.join(',') + '\n'
    
//     filteredLogs.forEach(log => {
//       // Escape commas and quotes in text fields
//       const row = [
//         log.id,
//         `"${log.userName?.replace(/"/g, '""') || ''}"`,
//         `"${log.userEmail?.replace(/"/g, '""') || ''}"`,
//         `"${log.action?.replace(/"/g, '""') || ''}"`,
//         `"${log.entity_type?.replace(/"/g, '""') || ''}"`,
//         `"${log.formattedDate?.replace(/"/g, '""') || ''}"`,
//         `"${log.ip_address?.replace(/"/g, '""') || ''}"`,
//         `"${log.user_agent?.replace(/"/g, '""') || ''}"`,
//         `"${log.notes?.replace(/"/g, '""') || ''}"`,
//       ]
      
//       csvContent += row.join(',') + '\n'
//     })
    
//     // Create a blob and download link
//     const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
//     const url = URL.createObjectURL(blob)
//     const link = document.createElement('a')
//     link.setAttribute('href', url)
//     link.setAttribute('download', `audit_logs_${format(new Date(), 'yyyy-MM-dd')}.csv`)
//     document.body.appendChild(link)
//     link.click()
//     document.body.removeChild(link)
//   }

//   const getActionBadge = (action: string) => {
//     switch (action) {
//       case 'LOGIN_SUCCESS':
//         return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Login Success</Badge>
//       case 'LOGIN_FAILED':
//         return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Login Failed</Badge>
//       case 'LOGOUT':
//         return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Logout</Badge>
//       case 'PROFILE_UPDATE':
//         return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Profile Update</Badge>
//       case 'PASSWORD_RESET':
//         return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">Password Reset</Badge>
//       case 'USER_CREATE':
//         return <Badge className="bg-teal-100 text-teal-800 hover:bg-teal-100">User Created</Badge>
//       case 'USER_DELETE':
//         return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">User Deleted</Badge>
//       default:
//         return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">{action.replace(/_/g, ' ')}</Badge>
//     }
//   }

//   // Get unique actions for the filter dropdown
//   const getUniqueActions = () => {
//     const actions = new Set<string>()
//     auditLogs.forEach(log => {
//       if (log.action) actions.add(log.action)
//     })
//     return Array.from(actions)
//   }

//   // Get unique entity types for the filter dropdown
//   const getUniqueEntityTypes = () => {
//     const entities = new Set<string>()
//     auditLogs.forEach(log => {
//       if (log.entity_type) entities.add(log.entity_type)
//     })
//     return Array.from(entities)
//   }

//   return (
//     <div className="container mx-auto py-8 space-y-6">
//       <div className="flex flex-col space-y-4 md:flex-row md:justify-between md:items-center md:space-y-0">
//         <div>
//           <h1 className="text-3xl font-bold tracking-tight">Audit Logs</h1>
//           <p className="text-muted-foreground mt-1">View detailed system activity and user actions</p>
//         </div>
//         <div className="flex gap-3">
//           <Button 
//             variant="outline" 
//             onClick={refreshData} 
//             className="flex items-center gap-2"
//             disabled={isRefreshing}
//           >
//             {isRefreshing ? (
//               <Loader2 className="h-4 w-4 animate-spin" />
//             ) : (
//               <RefreshCw className="h-4 w-4" />
//             )}
//             Refresh
//           </Button>
//           <Button onClick={handleExport} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700">
//             <Download className="h-4 w-4" />
//             Export CSV
//           </Button>
//         </div>
//       </div>

//       {error && (
//         <Alert variant="destructive" className="border-red-400">
//           <AlertCircle className="h-4 w-4" />
//           <AlertTitle>Error</AlertTitle>
//           <AlertDescription>{error}</AlertDescription>
//         </Alert>
//       )}

//       <Card className="shadow-md border-gray-100">
//         <CardHeader className="bg-gray-50 rounded-t-lg">
//           <CardTitle className="text-xl flex items-center gap-2">
//             <Search className="h-5 w-5 text-indigo-500" />
//             Advanced Filters
//           </CardTitle>
//           <CardDescription>Filter logs by action type, entity or search for specific details</CardDescription>
//         </CardHeader>
//         <CardContent className="pt-6">
//           <div className="grid gap-6 md:grid-cols-3">
//             <div className="space-y-2">
//               <label className="text-sm font-medium flex items-center gap-1">
//                 <Search className="h-4 w-4 text-gray-500" />
//                 Search
//               </label>
//               <div className="relative">
//                 <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
//                 <Input
//                   placeholder="Search users, emails, IP addresses..."
//                   className="pl-10 py-6 rounded-lg border-gray-300"
//                   value={searchQuery}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//                 />
//               </div>
//             </div>
            
//             <div className="space-y-2">
//               <label className="text-sm font-medium flex items-center gap-1">
//                 <Info className="h-4 w-4 text-gray-500" />
//                 Action Type
//               </label>
//               <Select value={actionFilter} onValueChange={setActionFilter}>
//                 <SelectTrigger className="rounded-lg border-gray-300 py-6">
//                   <SelectValue placeholder="Select action" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="all">All Actions</SelectItem>
//                   {getUniqueActions().map(action => (
//                     <SelectItem key={action} value={action}>
//                       {action.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>
            
//             <div className="space-y-2">
//               <label className="text-sm font-medium flex items-center gap-1">
//                 <HardDrive className="h-4 w-4 text-gray-500" />
//                 Entity Type
//               </label>
//               <Select value={entityFilter} onValueChange={setEntityFilter}>
//                 <SelectTrigger className="rounded-lg border-gray-300 py-6">
//                   <SelectValue placeholder="Select entity" />
//                 </SelectTrigger>
//                 <SelectContent>
//                   <SelectItem value="all">All Entities</SelectItem>
//                   {getUniqueEntityTypes().map(entity => (
//                     <SelectItem key={entity} value={entity}>
//                       {entity}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>
//           </div>
          
//           <div className="mt-6 flex justify-end">
//             <Button
//               variant="outline"
//               onClick={clearFilters}
//               className="flex items-center gap-2"
//             >
//               Clear All Filters
//             </Button>
//           </div>
//         </CardContent>
//       </Card>

//       <Card className="shadow-md overflow-hidden border-gray-100">
//         <CardHeader className="bg-gray-50 border-b pb-6">
//           <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
//             <div>
//               <CardTitle className="text-xl flex items-center gap-2">
//                 <Clock className="h-5 w-5 text-indigo-500" />
//                 Activity Timeline
//               </CardTitle>
//               <CardDescription className="mt-1">
//                 Showing {filteredLogs.length} {filteredLogs.length === 1 ? 'record' : 'records'}
//               </CardDescription>
//             </div>
//             <div className="flex items-center text-sm text-gray-500 bg-white py-1 px-3 rounded-full border">
//               <Calendar className="h-4 w-4 mr-2 text-indigo-500" />
//               Last Updated: {format(new Date(), 'MMM d, yyyy HH:mm:ss')}
//             </div>
//           </div>
//         </CardHeader>
//         <CardContent className="p-0">
//           {isLoading ? (
//             <div className="flex justify-center items-center h-64">
//               <div className="flex flex-col items-center gap-2">
//                 <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
//                 <p className="text-sm text-muted-foreground mt-2">Loading audit logs...</p>
//               </div>
//             </div>
//           ) : filteredLogs.length === 0 ? (
//             <div className="flex justify-center items-center h-64">
//               <div className="text-center">
//                 <AlertCircle className="h-10 w-10 text-gray-400 mx-auto mb-2" />
//                 <p className="text-lg font-medium text-gray-700">No audit logs found</p>
//                 <p className="text-muted-foreground mb-4">Try changing or clearing your filter settings</p>
//                 <Button 
//                   variant="outline" 
//                   onClick={clearFilters}
//                 >
//                   Clear Filters
//                 </Button>
//               </div>
//             </div>
//           ) : (
//             <div className="overflow-x-auto">
//               <Table>
//                 <TableHeader className="bg-gray-50 sticky top-0">
//                   <TableRow>
//                     <TableHead 
//                       className="cursor-pointer whitespace-nowrap font-medium"
//                       onClick={() => toggleSort('userName')}
//                     >
//                       <div className="flex items-center">
//                         <User className="h-4 w-4 mr-2 text-gray-500" />
//                         User
//                         {sortColumn === 'userName' && (
//                           <ArrowUpDown className="ml-2 h-4 w-4 inline-block" />
//                         )}
//                       </div>
//                     </TableHead>
//                     <TableHead 
//                       className="cursor-pointer whitespace-nowrap font-medium"
//                       onClick={() => toggleSort('action')}
//                     >
//                       <div className="flex items-center">
//                         <Info className="h-4 w-4 mr-2 text-gray-500" />
//                         Action 
//                         {sortColumn === 'action' && (
//                           <ArrowUpDown className="ml-2 h-4 w-4 inline-block" />
//                         )}
//                       </div>
//                     </TableHead>
//                     <TableHead
//                       className="cursor-pointer whitespace-nowrap font-medium"
//                       onClick={() => toggleSort('ip_address')}
//                     >
//                       <div className="flex items-center">
//                         <Globe className="h-4 w-4 mr-2 text-gray-500" />
//                         IP Address
//                         {sortColumn === 'ip_address' && (
//                           <ArrowUpDown className="ml-2 h-4 w-4 inline-block" />
//                         )}
//                       </div>
//                     </TableHead>
//                     <TableHead 
//                       className="cursor-pointer whitespace-nowrap font-medium"
//                       onClick={() => toggleSort('entity_type')}
//                     >
//                       <div className="flex items-center">
//                         <HardDrive className="h-4 w-4 mr-2 text-gray-500" />
//                         Entity Type
//                         {sortColumn === 'entity_type' && (
//                           <ArrowUpDown className="ml-2 h-4 w-4 inline-block" />
//                         )}
//                       </div>
//                     </TableHead>
//                     <TableHead 
//                       className="cursor-pointer whitespace-nowrap font-medium"
//                       onClick={() => toggleSort('formattedDate')}
//                     >
//                       <div className="flex items-center">
//                         <Calendar className="h-4 w-4 mr-2 text-gray-500" />
//                         Time 
//                         {sortColumn === 'formattedDate' && (
//                           <ArrowUpDown className="ml-2 h-4 w-4 inline-block" />
//                         )}
//                       </div>
//                     </TableHead>
//                     <TableHead className="whitespace-nowrap font-medium text-right">Details</TableHead>
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {filteredLogs.map((log) => (
//                     <TableRow key={log.id} className="hover:bg-gray-50 border-b border-gray-100">
//                       <TableCell>
//                         <div className="flex flex-col">
//                           <span className="font-medium text-gray-900">{log.userName}</span>
//                           <span className="text-xs text-gray-500 flex items-center mt-1">
//                             <Mail className="h-3 w-3 mr-1" />{log.userEmail}
//                           </span>
//                         </div>
//                       </TableCell>
//                       <TableCell>
//                         {getActionBadge(log.action)}
//                         {log.error_message && (
//                           <div className="mt-1 text-xs text-red-500">
//                             {log.error_message}
//                           </div>
//                         )}
//                       </TableCell>
//                       <TableCell>
//                         <TooltipProvider>
//                           <Tooltip>
//                             <TooltipTrigger asChild>
//                               <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
//                                 {log.ip_address.split(':').pop()}
//                               </span>
//                             </TooltipTrigger>
//                             <TooltipContent>
//                               <p className="font-mono">{log.ip_address}</p>
//                               <p className="text-xs text-gray-500 mt-1">User Agent: {log.user_agent}</p>
//                             </TooltipContent>
//                           </Tooltip>
//                         </TooltipProvider>
//                       </TableCell>
//                       <TableCell>
//                         <Badge variant="outline" className="bg-gray-50">
//                           {log.entity_type}
//                         </Badge>
//                         {log.entity_id && (
//                           <div className="text-xs text-gray-500 mt-1">
//                             ID: {log.entity_id}
//                           </div>
//                         )}
//                       </TableCell>
//                       <TableCell className="whitespace-nowrap">
//                         <div className="flex items-center text-gray-900">
//                           <Clock className="h-3 w-3 mr-2 text-gray-500" />
//                           {log.formattedDate}
//                         </div>
//                       </TableCell>
//                       <TableCell className="text-right">
//                         {log.new_state && (
//                           <Dialog>
//                             <DialogTrigger asChild>
//                               <Button variant="ghost" size="sm" className="text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50">
//                                 <Eye className="h-4 w-4 mr-1" />
//                                 View Details
//                               </Button>
//                             </DialogTrigger>
//                             <DialogContent className="sm:max-w-md">
//                               <DialogHeader>
//                                 <DialogTitle>Event Details</DialogTitle>
//                                 <DialogDescription>
//                                   Activity ID: {log.id} • {log.formattedDate}
//                                 </DialogDescription>
//                               </DialogHeader>
//                               <div className="grid gap-4 py-4">
//                                 <div className="space-y-2">
//                                   <h3 className="text-sm font-medium">New State</h3>
//                                   <pre className="bg-gray-50 p-4 rounded-md text-sm overflow-auto max-h-60">
//                                     {JSON.stringify(log.new_state, null, 2)}
//                                   </pre>
//                                 </div>
                                
//                                 {log.previous_state && (
//                                   <div className="space-y-2">
//                                     <h3 className="text-sm font-medium">Previous State</h3>
//                                     <pre className="bg-gray-50 p-4 rounded-md text-sm overflow-auto max-h-60">
//                                       {JSON.stringify(log.previous_state, null, 2)}
//                                     </pre>
//                                   </div>
//                                 )}
                                
//                                 {log.notes && (
//                                   <div className="space-y-2">
//                                     <h3 className="text-sm font-medium">Notes</h3>
//                                     <p className="text-sm text-gray-500">{log.notes}</p>
//                                   </div>
//                                 )}
//                               </div>
//                             </DialogContent>
//                           </Dialog>
//                         )}
//                       </TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </div>
//           )}
//         </CardContent>
//         <CardFooter className="bg-gray-50 border-t py-4 flex justify-between items-center">
//           <div className="text-sm text-gray-500">
//             Filter results: {filteredLogs.length} of {auditLogs.length} records
//           </div>
//           <Button variant="outline" onClick={refreshData} className="flex items-center gap-2">
//             <RefreshCw className="h-4 w-4" />
//             Refresh Data
//           </Button>
//         </CardFooter>
//       </Card>
//     </div>
//   )
// }






"use client"

import { useState, useEffect, useCallback } from 'react'
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell
} from '@/components/ui/table'
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { 
  Download, 
  Loader2,
  AlertCircle,
  ArrowUpDown,
  Search,
  RefreshCw,
  Eye,
  Calendar,
  Mail,
  User,
  Globe,
  HardDrive,
  Info,
  Clock,
  Trash2,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  Square,
  CheckSquare,
  CheckSquare2
} from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { format } from 'date-fns'
import { Badge } from '@/components/ui/badge'
import Cookies from 'js-cookie'

// Updated interface for the audit log item based on your JSON format
interface AuditLog {
  id: number;
  userName: string;
  userEmail: string;
  action: string;
  error_message: string | null;
  formattedDate: string;
  ip_address: string;
  entity_type: string;
  entity_id: number | null;
  previous_state: any;
  new_state: any;
  user_agent: string;
  notes: string | null;
}

// Interface for the API response
interface AuditLogResponse {
  status: string;
  message: string;
  auditLogs: AuditLog[];
  pagination?: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasMore: boolean;
  };
}

export default function AuditLogsPage() {
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([])
  const [filteredLogs, setFilteredLogs] = useState<AuditLog[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalRecords, setTotalRecords] = useState(0)
  const [itemsPerPage, setItemsPerPage] = useState(10)
  
  // Selection state
  const [selectedItems, setSelectedItems] = useState<number[]>([])
  const [selectAll, setSelectAll] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [logToDelete, setLogToDelete] = useState<number | null>(null)
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('')
  const [actionFilter, setActionFilter] = useState('all')
  const [entityFilter, setEntityFilter] = useState('all')
  
  // Sorting
  const [sortColumn, setSortColumn] = useState<string>('formattedDate')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')

  useEffect(() => {
    fetchAuditLogs()
  }, [currentPage, itemsPerPage]) // Refetch when page or limit changes

  // Reset to page 1 when filters or sorting change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, actionFilter, entityFilter, sortColumn, sortDirection])

  // Reset selections when page changes
  useEffect(() => {
    setSelectedItems([])
    setSelectAll(false)
  }, [currentPage])

  // For now, use simpler query params until we verify basic functionality
  const fetchAuditLogs = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      const token = Cookies.get('token')
      
      if (!token) {
        setError('Authentication token not found')
        setIsLoading(false)
        return
      }
      
      // Simplify to just basic pagination for troubleshooting
      const response = await fetch(`http://localhost:7000/api/v1/audit-logs?page=${currentPage}&limit=${itemsPerPage}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (!response.ok) {
        throw new Error(`Failed to fetch audit logs: ${response.status}`)
      }
      
      const data = await response.json()
      
      if (data.status === 'success') {
        console.log("API Response:", data);
        // Update auditLogs with the data from the server
        setAuditLogs(data.auditLogs || []);
        setFilteredLogs(data.auditLogs || []);
        
        // Update pagination data
        if (data.pagination) {
          setTotalPages(data.pagination.totalPages);
          setTotalRecords(data.pagination.total);
        }
      } else {
        throw new Error('Invalid response format')
      }
    } catch (err) {
      console.error('Error fetching audit logs:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch audit logs')
    } finally {
      setIsLoading(false)
    }
  }

  const refreshData = async () => {
    setIsRefreshing(true)
    setIsLoading(true) // Add loading state during refresh
    await fetchAuditLogs()
    setIsRefreshing(false)
    setSelectedItems([])
    setSelectAll(false)
  }

  const toggleSort = (column: string) => {
    setIsLoading(true) // Show loading when changing sort
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(column)
      setSortDirection('asc')
    }
  }

  const applyFilters = useCallback(() => {
    // Reset to first page when filters change
    setCurrentPage(1)
    // Show loading state
    setIsLoading(true)
    // Fetch filtered data from server
    fetchAuditLogs()
  }, [searchQuery, actionFilter, entityFilter, sortColumn, sortDirection])

  useEffect(() => {
    applyFilters()
  }, [applyFilters])

  // Pagination handlers
  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber)
    setIsLoading(true) // Show loading when changing pages
    setSelectedItems([]) // Clear selections when changing page
    setSelectAll(false)
  }
  
  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1)
      setIsLoading(true) // Show loading when changing pages
      setSelectedItems([])
      setSelectAll(false)
    }
  }
  
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1)
      setIsLoading(true) // Show loading when changing pages
      setSelectedItems([])
      setSelectAll(false)
    }
  }

  const clearFilters = () => {
    setIsLoading(true) // Show loading when clearing filters
    setSearchQuery('')
    setActionFilter('all')
    setEntityFilter('all')
  }

  const handleExport = () => {
    // Create CSV content
    const headers = ['ID', 'User Name', 'User Email', 'Action', 'Entity Type', 'Time', 'IP Address', 'User Agent', 'Notes']
    let csvContent = headers.join(',') + '\n'
    
    filteredLogs.forEach(log => {
      // Escape commas and quotes in text fields
      const row = [
        log.id,
        `"${log.userName?.replace(/"/g, '""') || ''}"`,
        `"${log.userEmail?.replace(/"/g, '""') || ''}"`,
        `"${log.action?.replace(/"/g, '""') || ''}"`,
        `"${log.entity_type?.replace(/"/g, '""') || ''}"`,
        `"${log.formattedDate?.replace(/"/g, '""') || ''}"`,
        `"${log.ip_address?.replace(/"/g, '""') || ''}"`,
        `"${log.user_agent?.replace(/"/g, '""') || ''}"`,
        `"${log.notes?.replace(/"/g, '""') || ''}"`,
      ]
      
      csvContent += row.join(',') + '\n'
    })
    
    // Create a blob and download link
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', `audit_logs_${format(new Date(), 'yyyy-MM-dd')}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const getActionBadge = (action: string) => {
    switch (action) {
      case 'LOGIN_SUCCESS':
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Login Success</Badge>
      case 'LOGIN_FAILED':
        return <Badge className="bg-red-100 text-red-800 hover:bg-red-100">Login Failed</Badge>
      case 'LOGOUT':
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Logout</Badge>
      case 'PROFILE_UPDATE':
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Profile Update</Badge>
      case 'PASSWORD_RESET':
        return <Badge className="bg-purple-100 text-purple-800 hover:bg-purple-100">Password Reset</Badge>
      case 'USER_CREATE':
        return <Badge className="bg-teal-100 text-teal-800 hover:bg-teal-100">User Created</Badge>
      case 'USER_DELETE':
        return <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">User Deleted</Badge>
      default:
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">{action.replace(/_/g, ' ')}</Badge>
    }
  }

  // Get unique actions for the filter dropdown
  const getUniqueActions = () => {
    const actions = new Set<string>()
    auditLogs.forEach(log => {
      if (log.action) actions.add(log.action)
    })
    return Array.from(actions)
  }

  // Get unique entity types for the filter dropdown
  const getUniqueEntityTypes = () => {
    const entities = new Set<string>()
    auditLogs.forEach(log => {
      if (log.entity_type) entities.add(log.entity_type)
    })
    return Array.from(entities)
  }

  // Selection handlers
  const toggleSelectItem = (id: number) => {
    setSelectedItems(prevSelected => {
      if (prevSelected.includes(id)) {
        return prevSelected.filter(item => item !== id)
      } else {
        return [...prevSelected, id]
      }
    })
  }

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedItems([])
    } else {
      const allIds = filteredLogs.map(item => item.id)
      setSelectedItems(allIds)
    }
    setSelectAll(!selectAll)
  }

  // Effect to update selectAll state when selectedItems changes
  useEffect(() => {
    if (filteredLogs.length > 0) {
      const allSelected = filteredLogs.every(item => 
        selectedItems.includes(item.id)
      )
      setSelectAll(allSelected)
    } else {
      setSelectAll(false)
    }
  }, [selectedItems, filteredLogs])

  // Delete handlers
  const confirmDeleteSingle = (id: number) => {
    setLogToDelete(id)
    setIsDeleteDialogOpen(true)
  }

  const confirmDeleteSelected = () => {
    if (selectedItems.length > 0) {
      setIsDeleteDialogOpen(true)
      setLogToDelete(null) // null indicates bulk delete
    }
  }

  const handleDelete = async () => {
    try {
      setIsLoading(true)
      const token = Cookies.get('token')
      
      if (!token) {
        setError('Authentication token not found')
        setIsLoading(false)
        return
      }
      
      const idsToDelete = logToDelete !== null ? [logToDelete] : selectedItems
      
      // Make the API call to delete the records
      const response = await fetch('http://localhost:7000/api/v1/audit-logs', {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ids: idsToDelete })
      })
      
      if (!response.ok) {
        throw new Error(`Failed to delete audit logs: ${response.status}`)
      }
      
      await fetchAuditLogs()
      
      // Clear selections
      setSelectedItems([])
      setSelectAll(false)
      
      // Close dialog
      setIsDeleteDialogOpen(false)
      setLogToDelete(null)
      
    } catch (err) {
      console.error('Error deleting audit logs:', err)
      setError(err instanceof Error ? err.message : 'Failed to delete audit logs')
      setIsLoading(false)
    }
  }

  // Add a debugging log
  useEffect(() => {
    console.log("Current items in filteredLogs:", filteredLogs);
  }, [filteredLogs]);

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex flex-col space-y-4 md:flex-row md:justify-between md:items-center md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Audit Logs</h1>
          <p className="text-muted-foreground mt-1">View detailed system activity and user actions</p>
        </div>
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            onClick={refreshData} 
            className="flex items-center gap-2"
            disabled={isRefreshing}
          >
            {isRefreshing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
            Refresh
          </Button>
          <Button onClick={handleExport} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700">
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </div>

      {error && (
        <Alert variant="destructive" className="border-red-400">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card className="shadow-md border-gray-100">
        <CardHeader className="bg-gray-50 rounded-t-lg">
          <CardTitle className="text-xl flex items-center gap-2">
            <Search className="h-5 w-5 text-indigo-500" />
            Advanced Filters
          </CardTitle>
          <CardDescription>Filter logs by action type, entity or search for specific details</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid gap-6 md:grid-cols-3">
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-1">
                <Search className="h-4 w-4 text-gray-500" />
                Search
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search users, emails, IP addresses..."
                  className="pl-10 py-6 rounded-lg border-gray-300"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-1">
                <Info className="h-4 w-4 text-gray-500" />
                Action Type
              </label>
              <Select value={actionFilter} onValueChange={setActionFilter}>
                <SelectTrigger className="rounded-lg border-gray-300 py-6">
                  <SelectValue placeholder="Select action" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Actions</SelectItem>
                  {getUniqueActions().map(action => (
                    <SelectItem key={action} value={action}>
                      {action.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-1">
                <HardDrive className="h-4 w-4 text-gray-500" />
                Entity Type
              </label>
              <Select value={entityFilter} onValueChange={setEntityFilter}>
                <SelectTrigger className="rounded-lg border-gray-300 py-6">
                  <SelectValue placeholder="Select entity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Entities</SelectItem>
                  {getUniqueEntityTypes().map(entity => (
                    <SelectItem key={entity} value={entity}>
                      {entity}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="mt-6 flex justify-end">
            <Button
              variant="outline"
              onClick={clearFilters}
              className="flex items-center gap-2"
            >
              Clear All Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-md overflow-hidden border-gray-100">
        <CardHeader className="bg-gray-50 border-b pb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle className="text-xl flex items-center gap-2">
                <Clock className="h-5 w-5 text-indigo-500" />
                Activity Timeline
              </CardTitle>
              <CardDescription className="mt-1">
                {totalRecords > 0 ? (
                  `Showing ${((currentPage - 1) * itemsPerPage) + 1}-${Math.min(currentPage * itemsPerPage, totalRecords)} of ${totalRecords} ${totalRecords === 1 ? 'record' : 'records'}`
                ) : (
                  "No records to display"
                )}
              </CardDescription>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center text-sm text-gray-500 bg-white py-1 px-3 rounded-full border">
                <Calendar className="h-4 w-4 mr-2 text-indigo-500" />
                Last Updated: {format(new Date(), 'MMM d, yyyy HH:mm:ss')}
              </div>
              {selectedItems.length > 0 && (
                <Button 
                  variant="destructive" 
                  onClick={confirmDeleteSelected}
                  className="flex items-center gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete Selected ({selectedItems.length})
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
                <p className="text-sm text-muted-foreground mt-2">Loading audit logs...</p>
              </div>
            </div>
          ) : (!filteredLogs || filteredLogs.length === 0) && !isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="text-center">
                <AlertCircle className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                <p className="text-lg font-medium text-gray-700">No audit logs found</p>
                <p className="text-muted-foreground mb-4">Try changing or clearing your filter settings</p>
                <Button 
                  variant="outline" 
                  onClick={clearFilters}
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-gray-50 sticky top-0">
                  <TableRow>
                    <TableHead className="w-10">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="p-0 h-6 w-6" 
                        onClick={handleSelectAll}
                        aria-label="Select all"
                      >
                        {selectAll ? (
                          <CheckSquare2 className="h-5 w-5 text-indigo-600" />
                        ) : (
                          <Square className="h-5 w-5 text-gray-400" />
                        )}
                      </Button>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer whitespace-nowrap font-medium"
                      onClick={() => toggleSort('userName')}
                    >
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-2 text-gray-500" />
                        User
                        {sortColumn === 'userName' && (
                          <ArrowUpDown className="ml-2 h-4 w-4 inline-block" />
                        )}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer whitespace-nowrap font-medium"
                      onClick={() => toggleSort('action')}
                    >
                      <div className="flex items-center">
                        <Info className="h-4 w-4 mr-2 text-gray-500" />
                        Action 
                        {sortColumn === 'action' && (
                          <ArrowUpDown className="ml-2 h-4 w-4 inline-block" />
                        )}
                      </div>
                    </TableHead>
                    <TableHead
                      className="cursor-pointer whitespace-nowrap font-medium"
                      onClick={() => toggleSort('ip_address')}
                    >
                      <div className="flex items-center">
                        <Globe className="h-4 w-4 mr-2 text-gray-500" />
                        IP Address
                        {sortColumn === 'ip_address' && (
                          <ArrowUpDown className="ml-2 h-4 w-4 inline-block" />
                        )}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer whitespace-nowrap font-medium"
                      onClick={() => toggleSort('entity_type')}
                    >
                      <div className="flex items-center">
                        <HardDrive className="h-4 w-4 mr-2 text-gray-500" />
                        Entity Type
                        {sortColumn === 'entity_type' && (
                          <ArrowUpDown className="ml-2 h-4 w-4 inline-block" />
                        )}
                      </div>
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer whitespace-nowrap font-medium"
                      onClick={() => toggleSort('formattedDate')}
                    >
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                        Time 
                        {sortColumn === 'formattedDate' && (
                          <ArrowUpDown className="ml-2 h-4 w-4 inline-block" />
                        )}
                      </div>
                    </TableHead>
                    <TableHead className="whitespace-nowrap font-medium">Details</TableHead>
                    <TableHead className="whitespace-nowrap font-medium text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLogs && filteredLogs.length > 0 ? (
                    filteredLogs.map((log) => (
                      <TableRow key={log.id} className="hover:bg-gray-50 border-b border-gray-100">
                        <TableCell>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="p-0 h-6 w-6" 
                            onClick={() => toggleSelectItem(log.id)}
                            aria-label={`Select log ${log.id}`}
                          >
                            {selectedItems.includes(log.id) ? (
                              <CheckSquare2 className="h-5 w-5 text-indigo-600" />
                            ) : (
                              <Square className="h-5 w-5 text-gray-400" />
                            )}
                          </Button>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium text-gray-900">{log.userName}</span>
                            <span className="text-xs text-gray-500 flex items-center mt-1">
                              <Mail className="h-3 w-3 mr-1" />{log.userEmail}
                            </span>
                          </div>
                        </TableCell>
                        <TableCell>
                          {getActionBadge(log.action)}
                          {log.error_message && (
                            <div className="mt-1 text-xs text-red-500">
                              {log.error_message}
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <span className="font-mono text-xs bg-gray-100 px-2 py-1 rounded">
                                  {log.ip_address.split(':').pop()}
                                </span>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p className="font-mono">{log.ip_address}</p>
                                <p className="text-xs text-gray-500 mt-1">User Agent: {log.user_agent}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-gray-50">
                            {log.entity_type}
                          </Badge>
                          {log.entity_id && (
                            <div className="text-xs text-gray-500 mt-1">
                              ID: {log.entity_id}
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          <div className="flex items-center text-gray-900">
                            <Clock className="h-3 w-3 mr-2 text-gray-500" />
                            {log.formattedDate}
                          </div>
                        </TableCell>
                        <TableCell>
                          {log.new_state && (
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="ghost" size="sm" className="text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50">
                                  <Eye className="h-4 w-4 mr-1" />
                                  View Details
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-md">
                                <DialogHeader>
                                  <DialogTitle>Event Details</DialogTitle>
                                  <DialogDescription>
                                    Activity ID: {log.id} • {log.formattedDate}
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                  <div className="space-y-2">
                                    <h3 className="text-sm font-medium">New State</h3>
                                    <pre className="bg-gray-50 p-4 rounded-md text-sm overflow-auto max-h-60">
                                      {JSON.stringify(log.new_state, null, 2)}
                                    </pre>
                                  </div>
                                  
                                  {log.previous_state && (
                                    <div className="space-y-2">
                                      <h3 className="text-sm font-medium">Previous State</h3>
                                      <pre className="bg-gray-50 p-4 rounded-md text-sm overflow-auto max-h-60">
                                        {JSON.stringify(log.previous_state, null, 2)}
                                      </pre>
                                    </div>
                                  )}
                                  
                                  {log.notes && (
                                    <div className="space-y-2">
                                      <h3 className="text-sm font-medium">Notes</h3>
                                      <p className="text-sm text-gray-500">{log.notes}</p>
                                    </div>
                                  )}
                                </div>
                              </DialogContent>
                            </Dialog>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => confirmDeleteSingle(log.id)}
                            className="text-red-600 hover:text-red-800 hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center py-8">
                        <p className="text-gray-500">No records found on this page</p>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
        <CardFooter className="bg-gray-50 border-t py-4 flex justify-between items-center flex-wrap gap-4">
          <div className="text-sm text-gray-500">
            Total Records: {totalRecords}
          </div>
          
          {/* Pagination Controls */}
          {filteredLogs.length > 0 && (
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={goToPreviousPage}
                disabled={currentPage === 1}
                className="h-8 w-8 p-0"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              {/* Simple pagination numbers */}
              <div className="flex items-center space-x-1">
                {[...Array(Math.min(5, totalPages))].map((_, i) => {
                  let pageNumber;
                  
                  // Logic to show the right set of page numbers
                  if (totalPages <= 5) {
                    // Show all pages if 5 or fewer
                    pageNumber = i + 1;
                  } else if (currentPage <= 3) {
                    // Show first 5 pages
                    pageNumber = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    // Show last 5 pages
                    pageNumber = totalPages - 4 + i;
                  } else {
                    // Show current page and 2 pages on each side
                    pageNumber = currentPage - 2 + i;
                  }
                  
                  return (
                    <Button
                      key={i}
                      variant={currentPage === pageNumber ? "default" : "outline"}
                      size="sm"
                      onClick={() => paginate(pageNumber)}
                      className={`h-8 w-8 p-0 ${currentPage === pageNumber ? 'bg-indigo-600 hover:bg-indigo-700' : ''}`}
                    >
                      {pageNumber}
                    </Button>
                  );
                })}
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={goToNextPage}
                disabled={currentPage === totalPages}
                className="h-8 w-8 p-0"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
          
          <Button variant="outline" onClick={refreshData} className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh Data
          </Button>
        </CardFooter>
      </Card>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-red-600">Confirm Deletion</DialogTitle>
            <DialogDescription>
              {logToDelete !== null
                ? "Are you sure you want to delete this audit log? This action cannot be undone."
                : `Are you sure you want to delete ${selectedItems.length} selected audit logs? This action cannot be undone.`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 mt-4">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button 
              variant="destructive" 
              onClick={handleDelete}
              className="flex items-center gap-2"
            >
              <Trash2 className="h-4 w-4" />
              {logToDelete !== null ? "Delete Log" : "Delete Selected"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}