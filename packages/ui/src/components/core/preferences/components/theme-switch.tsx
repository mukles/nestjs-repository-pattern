import { Button } from '@repo/ui/components/ui-kit/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@repo/ui/components/ui-kit/dropdown-menu';
import { Laptop, Moon, Sun } from 'lucide-react';
import { JSX } from 'react/jsx-runtime';
import { usePreferencesStore } from '../hooks';
import { ThemeMode } from '../utils';

export function ThemeSwitch() {
  const { themeMode, handleValueChange } = usePreferencesStore();

  const handleThemeToggle = (event: React.MouseEvent<HTMLButtonElement>) => {
    const { clientX: x, clientY: y } = event;
    const newMode = event.currentTarget.value as ThemeMode;
    handleValueChange('theme_mode', newMode, { x, y });
  };

  const icons: Record<ThemeMode, JSX.Element> = {
    light: <Sun className="h-[1.2rem] w-[1.2rem]" />,
    dark: <Moon className="h-[1.2rem] w-[1.2rem]" />,
    system: <Laptop className="h-[1.2rem] w-[1.2rem]" />,
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="icon" className="h-9 w-9">
          {icons[themeMode]}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem asChild>
          <Button
            value={'light'}
            className={'w-full cursor-pointer justify-start'}
            onClick={handleThemeToggle}
            variant={'ghost'}
          >
            Light
          </Button>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Button
            value={'dark'}
            className={'w-full cursor-pointer justify-start'}
            onClick={handleThemeToggle}
            variant={'ghost'}
          >
            Dark
          </Button>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Button
            value={'system'}
            className={'w-full cursor-pointer justify-start'}
            onClick={handleThemeToggle}
            variant={'ghost'}
          >
            System
          </Button>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
