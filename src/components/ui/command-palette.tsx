
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { FileText, FileCheck, Bell, Sparkles, Search, Key, Settings, User, BookOpen, Shield, CheckSquare, Database, MonitorSmartphone, Sword, Radio } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type CommandItem = {
  category: string;
  title: string;
  description?: string;
  icon: React.ElementType;
  action: () => void;
  keywords?: string[];
  shortcut?: string;
};

export function CommandPalette({ open, onOpenChange }: CommandPaletteProps) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  // Reset search when dialog opens
  useEffect(() => {
    if (open) {
      setSearchQuery('');
    }
  }, [open]);

  const handleKeyDown = (event: KeyboardEvent) => {
    // Check for Command/Control + K
    if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
      event.preventDefault();
      onOpenChange(!open);
    } else if (event.key === 'Escape' && open) {
      onOpenChange(false);
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  // Command items for different categories
  const navigationCommands: CommandItem[] = [
    {
      category: 'Navigation',
      title: 'Go to Dashboard',
      icon: Shield,
      action: () => navigate('/dashboard'),
      keywords: ['home', 'main'],
    },
    {
      category: 'Navigation',
      title: 'Documents',
      description: 'Browse security documents',
      icon: FileText,
      action: () => navigate('/documents'),
      keywords: ['docs', 'files'],
    },
    {
      category: 'Navigation',
      title: 'Knowledge Base',
      description: 'Security knowledge repository',
      icon: BookOpen,
      action: () => navigate('/knowledge-base'),
      keywords: ['kb', 'articles', 'wiki'],
    },
    {
      category: 'Navigation',
      title: 'Asset Inventory',
      description: 'Manage security assets',
      icon: Database,
      action: () => navigate('/assets'),
      keywords: ['assets', 'inventory', 'devices'],
    },
    {
      category: 'Navigation',
      title: 'Compliance',
      description: 'View compliance status',
      icon: CheckSquare,
      action: () => navigate('/compliance'),
      keywords: ['compliance', 'regulations', 'frameworks'],
    },
    {
      category: 'Navigation',
      title: 'SOC Dashboard',
      description: 'Security operations center',
      icon: MonitorSmartphone,
      action: () => navigate('/soc'),
      keywords: ['operations', 'monitoring', 'alerts'],
    },
    {
      category: 'Navigation',
      title: 'Red Team',
      description: 'Red team operations',
      icon: Sword,
      action: () => navigate('/red-team'),
      keywords: ['offensive', 'pentest', 'attack'],
    },
    {
      category: 'Navigation',
      title: 'Threat Intelligence',
      description: 'Threat data and analysis',
      icon: Radio,
      action: () => navigate('/threat-intel'),
      keywords: ['threats', 'intel', 'ioc', 'cti'],
    },
  ];

  const actionCommands: CommandItem[] = [
    {
      category: 'Actions',
      title: 'New Document',
      icon: FileText,
      action: () => navigate('/documents?action=new'),
      shortcut: 'N D',
      keywords: ['create', 'new', 'document', 'write'],
    },
    {
      category: 'Actions',
      title: 'New Template',
      icon: FileCheck,
      action: () => navigate('/templates?action=new'),
      shortcut: 'N T',
      keywords: ['create', 'new', 'template'],
    },
    {
      category: 'Actions',
      title: 'New Security Ticket',
      icon: Bell,
      action: () => navigate('/ticketing?action=new'),
      shortcut: 'N S',
      keywords: ['create', 'new', 'ticket', 'issue'],
    },
    {
      category: 'Actions',
      title: 'Ask AI Assistant',
      icon: Sparkles,
      action: () => navigate('/ai-config'),
      keywords: ['ai', 'assistant', 'help', 'question'],
    },
  ];

  const settingsCommands: CommandItem[] = [
    {
      category: 'Settings',
      title: 'Profile Settings',
      icon: User,
      action: () => navigate('/profile'),
      keywords: ['account', 'user', 'profile'],
    },
    {
      category: 'Settings',
      title: 'Workspace Settings',
      icon: Settings,
      action: () => navigate('/workspace-settings'),
      keywords: ['workspace', 'organization', 'team'],
    },
    {
      category: 'Settings',
      title: 'API Keys',
      icon: Key,
      action: () => navigate('/workspace-settings/api'),
      keywords: ['api', 'keys', 'tokens', 'integrations'],
    },
  ];

  // All commands combined
  const allCommands = [...navigationCommands, ...actionCommands, ...settingsCommands];

  // Filter commands based on search query
  const filteredCommands = searchQuery
    ? allCommands.filter(command => {
        const searchStr = searchQuery.toLowerCase();
        return (
          command.title.toLowerCase().includes(searchStr) ||
          (command.description && command.description.toLowerCase().includes(searchStr)) ||
          (command.keywords && command.keywords.some(keyword => keyword.toLowerCase().includes(searchStr)))
        );
      })
    : allCommands;

  // Group commands by category
  const groupedCommands = filteredCommands.reduce<Record<string, CommandItem[]>>((acc, command) => {
    if (!acc[command.category]) {
      acc[command.category] = [];
    }
    acc[command.category].push(command);
    return acc;
  }, {});

  const handleSelect = (command: CommandItem) => {
    command.action();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[550px] p-0" hideClose>
        <Command className="rounded-lg border shadow-md">
          <div className="flex items-center border-b px-3">
            <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <CommandInput 
              placeholder="Type a command or search..." 
              className="flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
              value={searchQuery}
              onValueChange={setSearchQuery}
            />
          </div>
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            {Object.entries(groupedCommands).map(([category, items]) => (
              <CommandGroup key={category} heading={category}>
                {items.map((item) => (
                  <CommandItem
                    key={`${category}-${item.title}`}
                    onSelect={() => handleSelect(item)}
                    className="flex items-center gap-2 px-4 py-2"
                  >
                    <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border">
                      <item.icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <div className="font-medium">{item.title}</div>
                      {item.description && (
                        <div className="text-xs text-muted-foreground">{item.description}</div>
                      )}
                    </div>
                    {item.shortcut && (
                      <div className="flex items-center gap-1">
                        {item.shortcut.split(' ').map((key, i) => (
                          <React.Fragment key={i}>
                            {i > 0 && <span className="text-muted-foreground">+</span>}
                            <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                              <span className="text-xs">{key}</span>
                            </kbd>
                          </React.Fragment>
                        ))}
                      </div>
                    )}
                  </CommandItem>
                ))}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  );
}

export default CommandPalette;
