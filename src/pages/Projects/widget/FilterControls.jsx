// widget/FilterControls.jsx
import React from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function FilterControls({ 
  filterStatus, 
  filterType, 
  filterClient, 
  clientOptions, 
  projectTypes,
  onStatusChange, 
  onTypeChange,
  onClientChange 
}) {
  return (
    <div className="flex flex-wrap gap-2 items-center">
      {/* Project Type Filter */}
      <Select value={filterType} onValueChange={onTypeChange}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Project Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="All Types">All Types</SelectItem>
          {projectTypes.map(type => (
            <SelectItem key={type} value={type}>
              {type}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Client Filter */}
      <Select value={filterClient} onValueChange={onClientChange}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Client" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="All Clients">All Clients</SelectItem>
          {clientOptions.map(c => (
            <SelectItem key={c.id} value={String(c.id)}>
              {c.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}