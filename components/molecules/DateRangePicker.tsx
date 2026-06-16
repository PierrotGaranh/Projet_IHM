'use client';

import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Calendar, X, ChevronLeft, ChevronRight, RefreshCw, Check } from 'lucide-react';
import { Button } from '@/components/atoms/Button';
import { Input } from '@/components/atoms/Input';

interface DateRangePickerProps {
  onChange: (range: { startDate: Date | null; endDate: Date | null; startTime: string; endTime: string }) => void;
  value?: { startDate: Date | null; endDate: Date | null; startTime: string; endTime: string };
  placeholder?: string;
}

export function DateRangePicker({ onChange, value, placeholder = 'Sélectionner une plage' }: DateRangePickerProps) {
  const [tempStart, setTempStart] = useState<Date | null>(value?.startDate || null);
  const [tempEnd, setTempEnd] = useState<Date | null>(value?.endDate || null);
  const [tempStartTime, setTempStartTime] = useState(value?.startTime || '09:00');
  const [tempEndTime, setTempEndTime] = useState(value?.endTime || '17:00');

  const initialValueRef = useRef({
    startDate: value?.startDate || null,
    endDate: value?.endDate || null,
    startTime: value?.startTime || '09:00',
    endTime: value?.endTime || '17:00',
  });

  useEffect(() => {
    setTempStart(value?.startDate || null);
    setTempEnd(value?.endDate || null);
    setTempStartTime(value?.startTime || '09:00');
    setTempEndTime(value?.endTime || '17:00');
    initialValueRef.current = {
      startDate: value?.startDate || null,
      endDate: value?.endDate || null,
      startTime: value?.startTime || '09:00',
      endTime: value?.endTime || '17:00',
    };
  }, [value]);

  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(() => {
    if (value?.startDate) return new Date(value.startDate);
    return new Date();
  });
  const [selectionStep, setSelectionStep] = useState<'start' | 'end'>('start');
  const [hoverDate, setHoverDate] = useState<Date | null>(null);
  const [pickerPosition, setPickerPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
  const [applyError, setApplyError] = useState<string | null>(null);

  const triggerRef = useRef<HTMLDivElement>(null);
  const pickerRef = useRef<HTMLDivElement>(null);

  const isComplete = tempStart !== null && tempEnd !== null && tempStartTime !== '' && tempEndTime !== '';

  const isSameDay = (d1: Date | null, d2: Date | null) => {
    if (d1 === null && d2 === null) return true;
    if (d1 === null || d2 === null) return false;
    return d1.getFullYear() === d2.getFullYear() &&
           d1.getMonth() === d2.getMonth() &&
           d1.getDate() === d2.getDate();
  };

  const areDatesEqual = (d1: Date | null, d2: Date | null) => {
    if (d1 === null && d2 === null) return true;
    if (d1 === null || d2 === null) return false;
    return d1.getTime() === d2.getTime();
  };

  const hasChanged = () => {
    const init = initialValueRef.current;
    const startChanged = !areDatesEqual(tempStart, init.startDate);
    const endChanged = !areDatesEqual(tempEnd, init.endDate);
    const startTimeChanged = tempStartTime !== init.startTime;
    const endTimeChanged = tempEndTime !== init.endTime;
    return startChanged || endChanged || startTimeChanged || endTimeChanged;
  };

  const updatePickerPosition = () => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const pickerWidth = 380;
    const pickerHeight = 420;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let left = rect.left;
    let top = rect.bottom + 8;

    if (left + pickerWidth > viewportWidth) {
      left = viewportWidth - pickerWidth - 10;
    }
    if (left < 10) left = 10;

    if (top + pickerHeight > viewportHeight) {
      top = rect.top - pickerHeight - 8;
    }
    if (top < 10) top = 10;

    setPickerPosition({ left, top });
  };

  useEffect(() => {
    if (isOpen) {
      updatePickerPosition();
      const handleUpdate = () => updatePickerPosition();
      window.addEventListener('resize', handleUpdate);
      window.addEventListener('scroll', handleUpdate, true);
      return () => {
        window.removeEventListener('resize', handleUpdate);
        window.removeEventListener('scroll', handleUpdate, true);
      };
    }
  }, [isOpen]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        pickerRef.current && !pickerRef.current.contains(e.target as Node) &&
        triggerRef.current && !triggerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const validateAndApply = () => {
    if (!tempStart || !tempEnd) return false;
    const start = new Date(tempStart);
    const [sh, sm] = tempStartTime.split(':').map(Number);
    start.setHours(sh, sm);
    const end = new Date(tempEnd);
    const [eh, em] = tempEndTime.split(':').map(Number);
    end.setHours(eh, em);
    if (start >= end) {
      setApplyError('La date de fin doit être postérieure à la date de début');
      return false;
    }
    setApplyError(null);
    onChange({ startDate: tempStart, endDate: tempEnd, startTime: tempStartTime, endTime: tempEndTime });
    setIsOpen(false);
    return true;
  };

  const resetFilter = () => {
    setTempStart(null);
    setTempEnd(null);
    setTempStartTime('09:00');
    setTempEndTime('17:00');
    setSelectionStep('start');
    setHoverDate(null);
    setApplyError(null);
    onChange({ startDate: null, endDate: null, startTime: '09:00', endTime: '17:00' });
    setIsOpen(false);
  };

  const formatDisplay = () => {
    if (!tempStart || !tempEnd) return placeholder;
    const startStr = `${tempStart.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })} ${tempStartTime}`;
    const endStr = `${tempEnd.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit' })} ${tempEndTime}`;
    return `${startStr} → ${endStr}`;
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
      setApplyError(null);
    } else {
      if (tempStart && clickedDate < tempStart) {
        setTempStart(clickedDate);
        setTempEnd(tempStart);
      } else {
        setTempEnd(clickedDate);
      }
      setSelectionStep('start');
      setApplyError(null);
    }
  };

  const getDayStatus = (day: number) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    if (!tempStart) return { isStart: false, isEnd: false, inRange: false, hoverInRange: false };

    const isStart = isSameDay(date, tempStart);
    const isEnd = tempEnd ? isSameDay(date, tempEnd) : false;

    let inRange = false;
    let hoverInRange = false;

    if (tempStart && tempEnd) {
      const start = new Date(tempStart);
      start.setHours(0, 0, 0, 0);
      const end = new Date(tempEnd);
      end.setHours(0, 0, 0, 0);
      const current = new Date(date);
      current.setHours(0, 0, 0, 0);
      if (current > start && current < end) {
        inRange = true;
      }
    } else if (tempStart && !tempEnd && hoverDate) {
      const start = new Date(tempStart);
      start.setHours(0, 0, 0, 0);
      const end = new Date(hoverDate);
      end.setHours(0, 0, 0, 0);
      const current = new Date(date);
      current.setHours(0, 0, 0, 0);
      if (current > start && current < end) {
        inRange = true;
        hoverInRange = true;
      } else if (current > end && current < start) {
        inRange = true;
        hoverInRange = true;
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
  const sameCell = bothDatesSelected && isSameDay(tempStart, tempEnd);

  return (
    <div className="relative" ref={triggerRef}>
      <div
        className="flex items-center gap-2 border border-input rounded-lg px-3 h-10 cursor-pointer bg-background hover:bg-muted/50 transition"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="flex-1 text-sm text-foreground">{formatDisplay()}</span>
        {tempStart && tempEnd ? (
          <Button type="button" variant="ghost" onClick={(e) => { e.stopPropagation(); resetFilter(); }} className="p-0 h-auto">
            <X className="w-4 h-4 text-muted-foreground" />
          </Button>
        ) : (
          <Calendar className="w-4 h-4 text-muted-foreground" />
        )}
      </div>

      {isOpen && createPortal(
        <div
          ref={pickerRef}
          className="fixed bg-card border border-border rounded-lg shadow-2xl p-4 w-[380px] max-w-[90vw] z-[9999]"
          style={{ top: pickerPosition.top, left: pickerPosition.left }}
        >
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
                  {bothDatesSelected && isStart && !sameCell && (
                    <div className="mt-1">
                      <Input
                        type="time"
                        value={tempStartTime}
                        onChange={(e) => setTempStartTime(e.target.value)}
                        className="w-[44px] h-5 text-[8px] px-0.5 py-0 cursor-pointer"
                      />
                    </div>
                  )}
                  {bothDatesSelected && isEnd && !sameCell && (
                    <div className="mt-1">
                      <Input
                        type="time"
                        value={tempEndTime}
                        onChange={(e) => setTempEndTime(e.target.value)}
                        className="w-[44px] h-5 text-[8px] px-0.5 py-0 cursor-pointer"
                      />
                    </div>
                  )}
                  {sameCell && isStart && (
                    <div className="mt-1 flex items-center gap-0.5">
                      <Input
                        type="time"
                        value={tempStartTime}
                        onChange={(e) => setTempStartTime(e.target.value)}
                        className="w-[44px] h-5 text-[8px] px-0.5 py-0 cursor-pointer"
                      />
                      <span className="text-[8px] text-muted-foreground">→</span>
                      <Input
                        type="time"
                        value={tempEndTime}
                        onChange={(e) => setTempEndTime(e.target.value)}
                        className="w-[44px] h-5 text-[8px] px-0.5 py-0 cursor-pointer"
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {applyError && <p className="text-xs text-destructive mt-1">{applyError}</p>}

          <div className="mt-4 pt-2 border-t border-border flex justify-between gap-2">
            {isComplete && hasChanged() && (
              <Button type="button" variant="primary" onClick={validateAndApply} className="gap-2 text-sm">
                <Check className="w-3 h-3" /> Appliquer
              </Button>
            )}
            <Button type="button" variant="secondary" onClick={resetFilter} className="gap-2 text-sm ml-auto">
              <RefreshCw className="w-3 h-3" /> Réinitialiser
            </Button>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}