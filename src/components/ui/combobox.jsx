"use client";

import * as React from "react";
import { Check, ChevronsUpDown, PlusCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";

export function Combobox({
  value,
  onValueChange,
  options,
  onAddNew,
  placeholder = "Select an option...",
}) {
  const [open, setOpen] = React.useState(false);
  const [inputValue, setInputValue] = React.useState("");
  const [showNewOption, setShowNewOption] = React.useState(false);

  const handleInputChange = (value) => {
    setInputValue(value);
    setShowNewOption(!options.includes(value) && value.length > 0);
  };

  const handleAddNew = () => {
    onAddNew(inputValue);
    setOpen(false);
    setInputValue("");
    setShowNewOption(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between h-12"
        >
          {value || placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput 
            placeholder="Search or add new..."
            value={inputValue}
            onValueChange={handleInputChange}
          />
          <CommandEmpty>
            {showNewOption && (
              <button
                className="flex items-center gap-2 px-2 py-1.5 w-full hover:bg-accent"
                onClick={handleAddNew}
              >
                <PlusCircle className="h-4 w-4" />
                Add "{inputValue}"
              </button>
            )}
          </CommandEmpty>
          <CommandGroup>
            {options.map((option) => (
              <CommandItem
                key={option}
                value={option}
                onSelect={() => {
                  onValueChange(option);
                  setOpen(false);
                }}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4",
                    value === option ? "opacity-100" : "opacity-0"
                  )}
                />
                {option}
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </PopoverContent>
    </Popover>
  );
}