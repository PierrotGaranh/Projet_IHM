'use client';

import { useState, useRef, useEffect } from 'react';
import { Search, ChevronDown, X } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import { Label } from '@/components/atoms/Label';

interface UserSearchSelectProps {
  users: { id: string; firstName: string; lastName: string; email: string }[];
  value: string;
  onChange: (userId: string) => void;
  label?: string;
  placeholder?: string;
  error?: string;
}

export function UserSearchSelect({ users, value, onChange, label, placeholder = 'Rechercher un utilisateur...', error }: UserSearchSelectProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const selectedUser = users.find(u => u.id === value);

  useEffect(() => {
    if (selectedUser) {
      setSearchTerm(`${selectedUser.firstName} ${selectedUser.lastName}`);
    } else {
      setSearchTerm('');
    }
  }, [selectedUser]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredUsers = users.filter(u =>
    u.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelect = (user: typeof users[0]) => {
    onChange(user.id);
    setSearchTerm(`${user.firstName} ${user.lastName} (${user.email})`);
    setIsOpen(false);
  };

  const clearSelection = () => {
    onChange('');
    setSearchTerm('');
    setIsOpen(false);
  };

  return (
    <div className="space-y-1" ref={dropdownRef}>
      {label && <Label>{label}</Label>}
      <div className="relative">
        <div className="flex items-center gap-2">
          <div className="flex-1 relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setIsOpen(true);
                if (value) clearSelection();
              }}
              onFocus={() => setIsOpen(true)}
              placeholder={placeholder}
              className={`input-base w-full pr-8 ${error ? 'border-destructive' : ''}`}
            />
            <Button type="button" variant="ghost" onClick={() => setIsOpen(!isOpen)} className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground">
              <ChevronDown className="w-4 h-4" />
            </Button>
          </div>        
          {value && (
            <Button type="button" variant="ghost" onClick={clearSelection} className="p-2 text-destructive">
              <X className="w-4 h-4" />
            </Button>
          )}
        </div>
        {isOpen && (
          <div className="absolute z-50 mt-1 w-full bg-card border border-border rounded-lg shadow-lg max-h-60 overflow-y-auto">
            {filteredUsers.length === 0 ? (
              <div className="p-3 text-sm text-muted-foreground">Aucun utilisateur trouvé</div>
            ) : (
              filteredUsers.map(user => (
                <button
                  key={user.id}
                  type="button"
                  className="w-full text-left px-3 py-2 hover:bg-muted transition-colors text-sm"
                  onClick={() => handleSelect(user)}
                >
                  <div className="font-medium">{user.firstName} {user.lastName}</div>
                  <div className="text-xs text-muted-foreground">{user.email}</div>
                </button>
              ))
            )}
          </div>
        )}
        {error && <p className="text-xs text-destructive mt-1">{error}</p>}
      </div>
    </div>
  );
}