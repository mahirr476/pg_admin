"use client"

import { useState, useEffect } from 'react'
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
  CardTitle 
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
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from '@/components/ui/pagination'
import { 
  Download, 
  Loader2,
  AlertCircle,
  ArrowUpDown,
  Search
} from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { format, parseISO } from 'date-fns'
import { Badge } from '@/components/ui/badge'
import Cookies from 'js-cookie'

// Interface for the audit log item based on your API structure
interface AuditLog {
  id: number;
  user_id: number;
  ip_address: string;
  action: string;
  entry_time: string;
  previous_state: string | null;
  new_state: string | null;
  error_message: string | null;
  entity_type: string;
  entity_id: number | null;
  user_agent: string;
  notes: string | null;
}

// Interface for the API response
interface AuditLogResponse {
  status: string;
  message: string;
  auditLogs: AuditLog[];
}

export default function AuditLogsPage() {
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([])
  const [filteredLogs, setFilteredLogs] = useState<AuditLog[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  // Filters
  const [searchQuery, setSearchQuery] = useState('')
  const [actionFilter, setActionFilter] = useState('all')
  
  // Sorting
  const [sortColumn, setSortColumn] = useState<string>('entry_time')
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')

  useEffect(() => {
    fetchAuditLogs()
  }, [])

  useEffect(() => {
    applyFilters()
  }, [searchQuery, actionFilter, auditLogs, sortColumn, sortDirection])

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
      
      const response = await fetch('http://localhost:7000/api/v1/audit-logs', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (!response.ok) {
        throw new Error(`Failed to fetch audit logs: ${response.status}`)
      }
      
      const data: AuditLogResponse = await response.json()
      
      if (data.status === 'success' && Array.isArray(data.auditLogs)) {
        setAuditLogs(data.auditLogs)
        setFilteredLogs(data.auditLogs)
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

  // Modified to show all data by removing pagination
  const applyFilters = () => {
    let result = [...auditLogs]
    
    // Search filter (case insensitive)
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(log => 
        log.ip_address?.toLowerCase().includes(query) ||
        log.action?.toLowerCase().includes(query) ||
        log.entity_type?.toLowerCase().includes(query) ||
        log.user_agent?.toLowerCase().includes(query) ||
        (log.error_message && log.error_message.toLowerCase().includes(query))
      )
    }
    
    // Action filter
    if (actionFilter !== 'all') {
      result = result.filter(log => log.action === actionFilter)
    }
    
    // Sorting
    result.sort((a, b) => {
      let compareA, compareB
      
      switch (sortColumn) {
        case 'user_id':
          compareA = a.user_id
          compareB = b.user_id
          break
        case 'action':
          compareA = a.action?.toLowerCase() || ''
          compareB = b.action?.toLowerCase() || ''
          break
        case 'ip_address':
          compareA = a.ip_address?.toLowerCase() || ''
          compareB = b.ip_address?.toLowerCase() || ''
          break
        case 'entity_type':
          compareA = a.entity_type?.toLowerCase() || ''
          compareB = b.entity_type?.toLowerCase() || ''
          break
        case 'entry_time':
        default:
          compareA = new Date(a.entry_time).getTime()
          compareB = new Date(b.entry_time).getTime()
      }
      
      if (compareA < compareB) return sortDirection === 'asc' ? -1 : 1
      if (compareA > compareB) return sortDirection === 'asc' ? 1 : -1
      return 0
    })
    
    setFilteredLogs(result)
  }

  const toggleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortColumn(column)
      setSortDirection('asc')
    }
  }

  // Removed rowsPerPage variable since we're showing all data

  const clearFilters = () => {
    setSearchQuery('')
    setActionFilter('all')
  }

  const handleExport = () => {
    // Create CSV content
    const headers = ['ID', 'User ID', 'IP Address', 'Action', 'Entity Type', 'Time', 'User Agent', 'Notes']
    let csvContent = headers.join(',') + '\n'
    
    filteredLogs.forEach(log => {
      // Format date
      const date = new Date(log.entry_time)
      const formattedDate = format(date, 'yyyy-MM-dd HH:mm:ss')
      
      // Escape commas and quotes in text fields
      const row = [
        log.id,
        log.user_id,
        `"${log.ip_address?.replace(/"/g, '""') || ''}"`,
        `"${log.action?.replace(/"/g, '""') || ''}"`,
        `"${log.entity_type?.replace(/"/g, '""') || ''}"`,
        formattedDate,
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
        return <Badge className="bg-gray-100 text-gray-800 hover:bg-gray-100">{action}</Badge>
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

  // Function to parse and prettify JSON state
  const parseStateJSON = (jsonString: string | null) => {
    if (!jsonString) return null
    
    try {
      const parsed = JSON.parse(jsonString)
      return JSON.stringify(parsed, null, 2)
    } catch (err) {
      return jsonString
    }
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col space-y-4 md:flex-row md:justify-between md:items-center md:space-y-0">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Audit Logs</h1>
          <p className="text-muted-foreground">View system activity and user login history</p>
        </div>
        <Button onClick={handleExport} className="flex items-center gap-2">
          <Download className="h-4 w-4" />
          Export CSV
        </Button>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
          <CardDescription>Filter logs by action type or search by IP, action or event details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium">Search</label>
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by IP, action, details..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">Action Type</label>
              <Select value={actionFilter} onValueChange={setActionFilter}>
                <SelectTrigger>
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
          </div>
          
          <div className="mt-4 flex justify-end">
            <Button
              variant="outline"
              onClick={clearFilters}
              className="flex items-center gap-2"
            >
              Clear Filters
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Audit History</CardTitle>
          <CardDescription>
            Showing {filteredLogs.length} {filteredLogs.length === 1 ? 'record' : 'records'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="flex flex-col items-center gap-2">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="text-sm text-muted-foreground">Loading audit logs...</p>
              </div>
            </div>
          ) : filteredLogs.length === 0 ? (
            <div className="flex justify-center items-center h-64">
              <div className="text-center">
                <p className="text-muted-foreground">No audit logs found</p>
                <Button 
                  variant="outline" 
                  className="mt-4" 
                  onClick={clearFilters}
                >
                  Clear Filters
                </Button>
              </div>
            </div>
          ) : (
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader className="bg-muted/50 sticky top-0">
                  <TableRow>
                    <TableHead 
                      className="cursor-pointer whitespace-nowrap"
                      onClick={() => toggleSort('user_id')}
                    >
                      User ID
                      {sortColumn === 'user_id' && (
                        <ArrowUpDown className="ml-2 h-4 w-4 inline-block" />
                      )}
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer whitespace-nowrap"
                      onClick={() => toggleSort('action')}
                    >
                      Action 
                      {sortColumn === 'action' && (
                        <ArrowUpDown className="ml-2 h-4 w-4 inline-block" />
                      )}
                    </TableHead>
                    <TableHead
                      className="cursor-pointer whitespace-nowrap"
                      onClick={() => toggleSort('ip_address')}
                    >
                      IP Address
                      {sortColumn === 'ip_address' && (
                        <ArrowUpDown className="ml-2 h-4 w-4 inline-block" />
                      )}
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer whitespace-nowrap"
                      onClick={() => toggleSort('entity_type')}
                    >
                      Entity Type
                      {sortColumn === 'entity_type' && (
                        <ArrowUpDown className="ml-2 h-4 w-4 inline-block" />
                      )}
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer whitespace-nowrap"
                      onClick={() => toggleSort('entry_time')}
                    >
                      Time 
                      {sortColumn === 'entry_time' && (
                        <ArrowUpDown className="ml-2 h-4 w-4 inline-block" />
                      )}
                    </TableHead>
                    <TableHead className="whitespace-nowrap">Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredLogs.map((log) => {
                    const newState = parseStateJSON(log.new_state)
                    
                    return (
                      <TableRow key={log.id} className="hover:bg-muted/30">
                        <TableCell className="font-medium">{log.user_id}</TableCell>
                        <TableCell>{getActionBadge(log.action)}</TableCell>
                        <TableCell className="font-mono text-xs">{log.ip_address}</TableCell>
                        <TableCell>{log.entity_type}</TableCell>
                        <TableCell className="whitespace-nowrap">
                          <div>{format(new Date(log.entry_time), 'MMM d, yyyy')}</div>
                          <div className="text-xs text-muted-foreground">{format(new Date(log.entry_time), 'HH:mm:ss')}</div>
                        </TableCell>
                        <TableCell>
                          <div className="max-w-xs truncate">
                            {newState && (
                              <div className="text-xs">
                                <Button 
                                  variant="ghost" 
                                  className="h-auto p-0 text-blue-600 hover:text-blue-800 hover:bg-transparent"
                                  onClick={() => alert(newState)}
                                >
                                  View Details
                                </Button>
                              </div>
                            )}
                            {log.error_message && (
                              <div className="text-xs text-red-500">
                                Error: {log.error_message}
                              </div>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}