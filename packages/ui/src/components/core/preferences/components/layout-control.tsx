import { Button } from '@repo/ui/components/ui-kit/button';
import { Label } from '@repo/ui/components/ui-kit/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@repo/ui/components/ui-kit/popover';

import {
  ToggleGroup,
  ToggleGroupItem,
} from '@repo/ui/components/ui-kit/toggle-group';
import { Settings } from 'lucide-react';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectValue,
  SelectItem,
} from '@repo/ui/components/ui-kit/select';
import { FONT_SIZE_OPTIONS, THEME_PRESET_OPTIONS } from '../utils';
import { usePreferencesStore } from '../hooks';

export function LayoutControls() {
  const {
    themeMode,
    themePreset,
    collapsible,
    contentLayout,
    navbarStyle,
    variant,
    fontSize,
    handleValueChange,
  } = usePreferencesStore();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button size="icon">
          <Settings />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end">
        <div className="flex flex-col gap-5">
          <div className="space-y-1.5">
            <h4 className="text-sm leading-none font-medium">
              Layout Settings
            </h4>
            <p className="text-xs text-muted-foreground">
              Customize your dashboard layout preferences.
            </p>
          </div>
          <div className="space-y-3">
            <div className="space-y-1">
              <Label className="text-xs font-medium">Preset</Label>
              <Select
                value={themePreset}
                onValueChange={(value) =>
                  handleValueChange('theme_preset', value)
                }
              >
                <SelectTrigger size="sm" className="w-full text-xs">
                  <SelectValue placeholder="Preset" />
                </SelectTrigger>
                <SelectContent>
                  {THEME_PRESET_OPTIONS.map((preset) => (
                    <SelectItem
                      key={preset.value}
                      className="text-xs"
                      value={preset.value}
                    >
                      <span
                        className="size-2.5 rounded-full"
                        style={{
                          backgroundColor:
                            themeMode === 'dark'
                              ? preset.primary.dark
                              : preset.primary.light,
                        }}
                      />
                      {preset.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-medium">Mode</Label>
              <ToggleGroup
                className="w-full **:data-[slot=toggle-group-item]:flex-1 **:data-[slot=toggle-group-item]:text-xs"
                size="sm"
                variant="outline"
                type="single"
                value={themeMode}
                onValueChange={(value) =>
                  handleValueChange('theme_mode', value)
                }
              >
                <ToggleGroupItem value="light" aria-label="Toggle inset">
                  Light
                </ToggleGroupItem>
                <ToggleGroupItem value="dark" aria-label="Toggle sidebar">
                  Dark
                </ToggleGroupItem>
              </ToggleGroup>
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-medium">Sidebar Variant</Label>
              <ToggleGroup
                className="w-full **:data-[slot=toggle-group-item]:flex-1 **:data-[slot=toggle-group-item]:text-xs"
                size="sm"
                variant="outline"
                type="single"
                value={variant}
                onValueChange={(value) =>
                  handleValueChange('sidebar_variant', value)
                }
              >
                <ToggleGroupItem value="inset" aria-label="Toggle inset">
                  Inset
                </ToggleGroupItem>
                <ToggleGroupItem value="sidebar" aria-label="Toggle sidebar">
                  Sidebar
                </ToggleGroupItem>
                <ToggleGroupItem value="floating" aria-label="Toggle floating">
                  Floating
                </ToggleGroupItem>
              </ToggleGroup>
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-medium">Navbar Style</Label>
              <ToggleGroup
                className="w-full **:data-[slot=toggle-group-item]:flex-1 **:data-[slot=toggle-group-item]:text-xs"
                size="sm"
                variant="outline"
                type="single"
                value={navbarStyle}
                onValueChange={(value) =>
                  handleValueChange('navbar_style', value)
                }
              >
                <ToggleGroupItem value="sticky" aria-label="Toggle sticky">
                  Sticky
                </ToggleGroupItem>
                <ToggleGroupItem value="scroll" aria-label="Toggle scroll">
                  Scroll
                </ToggleGroupItem>
              </ToggleGroup>
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-medium">Sidebar Collapsible</Label>
              <ToggleGroup
                className="w-full **:data-[slot=toggle-group-item]:flex-1 **:data-[slot=toggle-group-item]:text-xs"
                size="sm"
                variant="outline"
                type="single"
                value={collapsible}
                onValueChange={(value) =>
                  handleValueChange('sidebar_collapsible', value)
                }
              >
                <ToggleGroupItem value="icon" aria-label="Toggle icon">
                  Icon
                </ToggleGroupItem>
                <ToggleGroupItem
                  value="offcanvas"
                  aria-label="Toggle offcanvas"
                >
                  OffCanvas
                </ToggleGroupItem>
              </ToggleGroup>
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-medium">Content Layout</Label>
              <ToggleGroup
                className="w-full **:data-[slot=toggle-group-item]:flex-1 **:data-[slot=toggle-group-item]:text-xs"
                size="sm"
                variant="outline"
                type="single"
                value={contentLayout}
                onValueChange={(value) =>
                  handleValueChange('content_layout', value)
                }
              >
                <ToggleGroupItem value="centered" aria-label="Toggle centered">
                  Centered
                </ToggleGroupItem>
                <ToggleGroupItem
                  value="full-width"
                  aria-label="Toggle full-width"
                >
                  Full Width
                </ToggleGroupItem>
              </ToggleGroup>
            </div>

            <div className="space-y-1">
              <Label className="text-xs font-medium">Font Size</Label>
              <ToggleGroup
                className="w-full **:data-[slot=toggle-group-item]:flex-1 **:data-[slot=toggle-group-item]:text-xs"
                size="sm"
                variant="outline"
                type="single"
                value={fontSize}
                onValueChange={(value) => handleValueChange('font_size', value)}
              >
                {FONT_SIZE_OPTIONS.map((opt) => (
                  <ToggleGroupItem
                    key={opt.value}
                    value={opt.value}
                    aria-label={opt.label}
                  >
                    {opt.label}
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
