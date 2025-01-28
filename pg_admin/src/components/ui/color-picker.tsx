// src/components/ui/color-picker.tsx
import { Popover, PopoverContent, PopoverTrigger } from "./popover"
import { Button } from "./button"
import { cn } from "@/lib/utils"

const COLORS = [
  { name: 'Green', value: 'bg-green-500' },
  { name: 'Blue', value: 'bg-blue-500' },
  { name: 'Red', value: 'bg-red-500' },
  { name: 'Yellow', value: 'bg-yellow-500' },
  { name: 'Purple', value: 'bg-purple-500' },
  { name: 'Pink', value: 'bg-pink-500' },
  { name: 'Indigo', value: 'bg-indigo-500' },
  { name: 'Orange', value: 'bg-orange-500' },
] as const

interface ColorPickerProps {
  value: string
  onChange: (color: string) => void
}

export function ColorPicker({ value, onChange }: ColorPickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          className="w-8 h-8 p-0"
        >
          <div className={cn("w-full h-full rounded", value)} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-48 p-2">
        <div className="grid grid-cols-4 gap-1">
          {COLORS.map((color) => (
            <Button
              key={color.value}
              variant="outline"
              className="w-8 h-8 p-0"
              onClick={() => onChange(color.value)}
            >
              <div className={cn("w-full h-full rounded", color.value)} />
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  )
}