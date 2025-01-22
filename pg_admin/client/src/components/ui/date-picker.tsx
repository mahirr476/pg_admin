"use client"

import * as React from "react"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { DateRange } from "react-day-picker"

interface DatePickerProps {
  mode?: "single" | "range"
  date?: Date
  dateRange?: DateRange
  onDateChange?: (date?: Date) => void
  onDateRangeChange?: (range: DateRange | undefined) => void
  trigger?: React.ReactNode
  placeholder?: string
}

export function DatePicker({ 
  mode = "single",
  date,
  dateRange,
  onDateChange,
  onDateRangeChange,
  trigger,
  placeholder = "Pick a date" 
}: DatePickerProps) {
  const defaultTrigger = (
    <Button
      variant="outline"
      className={cn(
        "w-full justify-start text-left font-normal",
        !date && !dateRange && "text-muted-foreground"
      )}
    >
      <CalendarIcon className="mr-2 h-4 w-4" />
      {mode === "single" ? (
        date ? format(date, "PPP") : <span>{placeholder}</span>
      ) : (
        dateRange?.from ? (
          dateRange.to ? (
            <>
              {format(dateRange.from, "LLL dd, y")} -{" "}
              {format(dateRange.to, "LLL dd, y")}
            </>
          ) : (
            format(dateRange.from, "LLL dd, y")
          )
        ) : (
          <span>{placeholder}</span>
        )
      )}
    </Button>
  )

  return (
    <Popover>
      <PopoverTrigger asChild>
        {trigger || defaultTrigger}
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 z-[60]" align="start">
        {mode === "single" ? (
          <Calendar
            mode="single"
            selected={date}
            onSelect={onDateChange}
            initialFocus
          />
        ) : (
          <Calendar
            mode="range"
            selected={dateRange}
            onSelect={onDateRangeChange}
            numberOfMonths={2}
            initialFocus
          />
        )}
      </PopoverContent>
    </Popover>
  )
}