"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import Link from "next/link";
import { MoreHorizontal, Search, Settings } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { motion } from "framer-motion";

// Logo component
const Logo = () => (
  <Link href="/" className="group flex items-center gap-2 relative">
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="relative"
    >
      <Image
        src="/plogoTop.jpg"
        alt="logo"
        width={30}
        height={30}
        className="rounded-md"
      />
      <motion.div
        className="absolute inset-0 bg-blue-500/20 rounded-md"
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.2 }}
      />
    </motion.div>
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="flex flex-col"
    >
      <span className="font-semibold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
        Paragon Group
      </span>
      <span className="text-xs text-gray-600">Admin Panel</span>
    </motion.div>
  </Link>
);

export function Header() {
  return (
    <TooltipProvider delayDuration={300}>
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="fixed top-0 left-0 right-0 h-14 border-b flex items-center justify-between px-4 bg-white z-50 shadow-sm"
      >
        <div className="flex items-center gap-4">
          <Logo />
        </div>

        <div className="flex items-center gap-3">
          <motion.div 
            className="relative"
            whileHover={{ scale: 1.02 }}
          >
            <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500" />
            <Input
              type="text"
              placeholder="Search..."
              className="pl-10 w-[200px] border-blue-100 focus:border-blue-200 transition-colors"
            />
          </motion.div>

          <div className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Button variant="ghost" size="icon" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                    <Settings className="w-5 h-5" />
                  </Button>
                </motion.div>
              </TooltipTrigger>
              <TooltipContent>Settings</TooltipContent>
            </Tooltip>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Avatar className="h-8 w-8 cursor-pointer border-2 border-blue-100 hover:border-blue-300 transition-colors">
                    <AvatarImage src="/api/placeholder/32/32" alt="Admin" />
                    <AvatarFallback className="bg-blue-100 text-blue-700">PG</AvatarFallback>
                  </Avatar>
                </motion.div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="text-blue-800">My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="hover:bg-blue-50 cursor-pointer">
                  View Profile
                </DropdownMenuItem>
                <DropdownMenuItem className="hover:bg-blue-50 cursor-pointer">
                  Edit Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600 hover:bg-red-50 cursor-pointer">
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </motion.div>
      {/* Spacer div to prevent content from going under fixed header */}
      <div className="h-14" />
    </TooltipProvider>
  );
}