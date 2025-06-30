import type * as React from "react"
import { cn } from "@/lib/utils"

export interface UserProps extends React.HTMLAttributes<HTMLDivElement> {}

function User({ className, ...props }: UserProps) {
  return <div className={cn("w-4 h-4 rounded-full bg-gray-500", className)} {...props} />
}

export { User }
