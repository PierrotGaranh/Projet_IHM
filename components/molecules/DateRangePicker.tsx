'use client';

import { useState, useRef, useEffect } from 'react';
import { Calendar, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';

interface DateRangePickerProps {
  onChange: (range: { startDate: Date | null; endDate: Date | null; startTime: string; endTime: string }) => void;
  value?: { startDate: Date | null; endDate: Date | null; startTime: string; endTime: string };
  placeholder?: string;
}

export function DateRangePicker({ onChange, value, placeholder = 'Sélectionner une plage' }: DateRangePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [tempStart, setTempStart] = useState<Date | null>(value?.startDate || null);
  const [tempEnd, setTempEnd] = useState<Date | null>(value?.endDate || null);
  const [tempStartTime, setTempStartTime] = useState(value?.startTime || '09:00');
  const [tempEndTime, setTempEndTime] = useState(value?.endTime || '17:00');
  const [selectionStep, setSelectionStep] = useState<'start' | 'end'>('start');
  const [hoverDate, setHoverDate] = useState<Date | null>(null);
  const pickerRef = useRef<HTMLDivElement>(null);

  const emitChange = (start: Date | null, end: Date | null, startTime: string, endTime: string) => {
    if (start && end) {
      const s = new Date(start);
      const [sh, sm] = startTime.split(':').map(Number);
      s.setHours(sh, sm);
      const e = new Date(end);
      const [eh, em] = endTime.split(':').map(Number);
      e.setHours(eh, em);
      onChange({ startDate: s, endDate: e, startTime, endTime });
    } else {
      onChange({ startDate: start, endDate: end, startTime, endTime });
    }
  };

  useEffect(() => {
    if (tempStart && tempEnd) {
      emitChange(tempStart, tempEnd, tempStartTime, tempEndTime);
    }
  }, [tempStart, tempEnd, tempStartTime, tempEndTime]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const formatDisplay = () => {
    if (!tempStart || !tempEnd) return placeholder;
    const startStr = `${tempStart.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })} ${tempStartTime}`;
    const endStr = `${tempEnd.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })} ${tempEndTime}`;
    return `${startStr} → ${endStr}`;
  };

  const clearFilter = () => {
    setTempStart(null);
    setTempEnd(null);
    setTempStartTime('09:00');
    setTempEndTime('17:00');
    setSelectionStep('start');
    setHoverDate(null);
    emitChange(null, null, '09:00', '17:00');
    setIsOpen(false);
  };

  const daysInMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  const firstDayIndex = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  const prevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  const nextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));

  const handleDateClick = (day: number) => {
    const clickedDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    if (clickedDate < new Date(new Date().setHours(0, 0, 0, 0))) return;
    if (selectionStep === 'start') {
      setTempStart(clickedDate);
      setTempEnd(null);
      setSelectionStep('end');
    } else {
      if (tempStart && clickedDate < tempStart) {
        setTempStart(clickedDate);
        setTempEnd(tempStart);
      } else {
        setTempEnd(clickedDate);
      }
      setSelectionStep('start');
    }
  };

  const getDayStatus = (day: number) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    if (!tempStart) return { isStart: false, isEnd: false, inRange: false, hoverInRange: false };
    const isStart = tempStart && date.getTime() === tempStart.getTime();
    const isEnd = tempEnd && date.getTime() === tempEnd.getTime();
    let inRange = false;
    let hoverInRange = false;
    if (tempStart && tempEnd) {
      inRange = date > tempStart && date < tempEnd;
    } else if (tempStart && !tempEnd && hoverDate) {
      const start = tempStart;
      const end = hoverDate;
      if (start && end) {
        if (end > start) {
          inRange = date > start && date < end;
          hoverInRange = date > start && date < end;
        } else {
          inRange = date > end && date < start;
          hoverInRange = date > end && date < start;
        }
      }
    }
    return { isStart, isEnd, inRange, hoverInRange };
  };

  const handleMouseEnter = (day: number) => {
    if (selectionStep === 'end' && tempStart && !tempEnd) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      if (date >= new Date(new Date().setHours(0, 0, 0, 0))) {
        setHoverDate(date);
      }
    }
  };

  const handleMouseLeave = () => {
    setHoverDate(null);
  };

  const bothDatesSelected = tempStart !== null && tempEnd !== null;
  const sameCell = bothDatesSelected && tempStart!.getTime() === tempEnd!.getTime();

  return (
    <div className="relative" ref={pickerRef}>
      <div
        className="flex items-center gap-2 border border-input rounded-lg px-3 py-2 cursor-pointer bg-background hover:bg-muted/50 transition"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="flex-1 text-sm text-foreground">{formatDisplay()}</span>
        {tempStart && tempEnd ? (
          <Button type="button" variant="ghost" onClick={(e) => { e.stopPropagation(); clearFilter(); }} className="p-0 h-auto">
            <X className="w-4 h-4 text-muted-foreground" />
          </Button>
        ) : (
          <Calendar className="w-4 h-4 text-muted-foreground" />
        )}
      </div>

      {isOpen && (
        <div className="absolute z-50 mt-2 bg-card border border-border rounded-lg shadow-lg p-4 w-[380px]">
          <div className="flex items-center justify-between mb-4">
            <Button type="button" variant="ghost" onClick={prevMonth}><ChevronLeft className="w-4 h-4" /></Button>
            <span className="font-semibold">{currentMonth.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}</span>
            <Button type="button" variant="ghost" onClick={nextMonth}><ChevronRight className="w-4 h-4" /></Button>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center text-xs mb-2">
            {['Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa', 'Di'].map(d => <div key={d} className="text-muted-foreground">{d}</div>)}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: firstDayIndex(currentMonth) }).map((_, i) => <div key={`empty-${i}`} />)}
            {Array.from({ length: daysInMonth(currentMonth) }).map((_, i) => {
              const day = i + 1;
              const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
              const isPast = date < new Date(new Date().setHours(0, 0, 0, 0));
              const { isStart, isEnd, inRange, hoverInRange } = getDayStatus(day);

              let cellClassName = 'w-8 h-8 rounded-full text-sm flex items-center justify-center transition-all ';
              if (isPast) {
                cellClassName += 'text-muted-foreground/40 cursor-not-allowed';
              } else {
                cellClassName += 'cursor-pointer hover:bg-primary/20 ';
                if (hoverInRange) cellClassName += 'bg-primary/10 ';
                if (inRange) cellClassName += 'bg-primary/20 ';
                if (isStart || isEnd) {
                  if (bothDatesSelected) {
                    cellClassName += 'bg-primary text-primary-foreground font-bold ';
                  } else {
                    cellClassName += 'bg-primary/30 text-primary font-semibold ';
                  }
                }
              }

              return (
                <div key={day} className="flex flex-col items-center">
                  <button 
                    type="button"
                    onClick={() => !isPast && handleDateClick(day)}
                    onMouseEnter={() => !isPast && handleMouseEnter(day)}
                    onMouseLeave={handleMouseLeave}
                    disabled={isPast}
                    className={cellClassName}
                  >
                    {day}
                  </button>
                  {bothDatesSelected && date.getTime() === tempStart!.getTime() && !sameCell && (
                    <div className="mt-1">
                      <Input
                        type="time"
                        value={tempStartTime}
                        onChange={(e) => setTempStartTime(e.target.value)}
                        className="w-20 h-7 text-xs"
                      />
                    </div>
                  )}
                  {bothDatesSelected && date.getTime() === tempEnd!.getTime() && !sameCell && (
                    <div className="mt-1">
                      <Input
                        type="time"
                        value={tempEndTime}
                        onChange={(e) => setTempEndTime(e.target.value)}
                        className="w-20 h-7 text-xs"
                      />
                    </div>
                  )}
                  {sameCell && date.getTime() === tempStart!.getTime() && (
                    <div className="mt-1 flex gap-1">
                      <Input
                        type="time"
                        value={tempStartTime}
                        onChange={(e) => setTempStartTime(e.target.value)}
                        className="w-20 h-7 text-xs"
                      />
                      <span className="text-xs text-muted-foreground self-center">→</span>
                      <Input
                        type="time"
                        value={tempEndTime}
                        onChange={(e) => setTempEndTime(e.target.value)}
                        className="w-20 h-7 text-xs"
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}