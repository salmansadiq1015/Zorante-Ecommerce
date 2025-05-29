import React, { useState } from "react";
import { Check, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export default function CurrencySelector({ defaultCurrency = "EUR" }) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(defaultCurrency);

  const currencies = [
    { value: "EUR", label: "Euro (€)", symbol: "€" },
    { value: "USD", label: "US Dollar ($)", symbol: "$" },
    { value: "GBP", label: "British Pound (£)", symbol: "£" },
    { value: "JPY", label: "Japanese Yen (¥)", symbol: "¥" },
    { value: "CNY", label: "Chinese Yuan (¥)", symbol: "¥" },
    { value: "INR", label: "Indian Rupee (₹)", symbol: "₹" },
    { value: "PKR", label: "Pakistani Rupee (Rs)", symbol: "Rs" },
    { value: "AED", label: "UAE Dirham (د.إ)", symbol: "د.إ" },
  ];

  const selectedCurrency = currencies.find((c) => c.value === value);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selectedCurrency?.label || value}
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search currency..." />
          <CommandList>
            <CommandEmpty>No currency found.</CommandEmpty>
            <CommandGroup>
              {currencies.map((currency) => (
                <CommandItem
                  key={currency.value}
                  value={currency.value}
                  onSelect={() => {
                    setValue(currency.value);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={`mr-2 h-4 w-4 ${
                      value === currency.value ? "opacity-100" : "opacity-0"
                    }`}
                  />
                  {currency.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
