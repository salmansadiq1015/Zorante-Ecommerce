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
import { Button } from "@/components/ui/button";
import { ChevronDown, Check } from "lucide-react";
import { useState } from "react";

export default function RegionSelector({ defaultRegion = "Pakistan" }) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(defaultRegion);

  const regions = [
    { value: "pakistan", label: "Pakistan" },
    { value: "usa", label: "United States" },
    { value: "uk", label: "United Kingdom" },
    { value: "germany", label: "Germany" },
    { value: "france", label: "France" },
    { value: "italy", label: "Italy" },
    { value: "spain", label: "Spain" },
    { value: "india", label: "India" },
    { value: "china", label: "China" },
    { value: "japan", label: "Japan" },
    { value: "australia", label: "Australia" },
    { value: "canada", label: "Canada" },
    { value: "uae", label: "United Arab Emirates" },
  ];

  // Find the region object that matches the default region (case insensitive)
  const selectedRegion = regions.find(
    (r) => r.label.toLowerCase() === value.toLowerCase()
  ) || {
    value: value.toLowerCase(),
    label: value,
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {selectedRegion.label}
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command>
          <CommandInput placeholder="Search region..." />
          <CommandList>
            <CommandEmpty>No region found.</CommandEmpty>
            <CommandGroup>
              {regions.map((region) => (
                <CommandItem
                  key={region.value}
                  value={region.value}
                  onSelect={() => {
                    setValue(region.label);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={`mr-2 h-4 w-4 ${
                      selectedRegion.value === region.value
                        ? "opacity-100"
                        : "opacity-0"
                    }`}
                  />
                  {region.label}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
