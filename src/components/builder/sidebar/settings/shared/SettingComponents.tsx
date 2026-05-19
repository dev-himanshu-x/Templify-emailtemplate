import React from 'react';
import { cn } from '@/lib/utils';
import { validateUrl } from '@/lib/utils';

interface SettingFieldProps {
  label: string;
  children: React.ReactNode;
  className?: string;
  valueDisplay?: string | number;
}

export function SettingField({ label, children, className, valueDisplay }: SettingFieldProps) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <div className="flex items-center justify-between px-1">
        <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">{label}</label>
        {valueDisplay !== undefined && (
          <span className="text-[10px] font-mono text-blue-600 font-bold">{valueDisplay}</span>
        )}
      </div>
      {children}
    </div>
  );
}

interface SettingGroupProps {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function SettingGroup({ title, icon, children, className }: SettingGroupProps) {
  return (
    <section className={cn("space-y-4", className)}>
      <div className="flex items-center gap-2 text-gray-900 mb-1">
        {icon}
        <h3 className="text-[11px] font-bold uppercase tracking-widest">{title}</h3>
      </div>
      <div className="space-y-4">
        {children}
      </div>
    </section>
  );
}

interface ToggleGroupProps<T extends string> {
  options: T[];
  value: T;
  onChange: (value: T) => void;
  className?: string;
}

export function ToggleGroup<T extends string>({ options, value, onChange, className }: ToggleGroupProps<T>) {
  return (
    <div className={cn("flex bg-gray-50 p-1 rounded-lg border border-gray-100 shadow-inner", className)}>
      {options.map((opt) => (
        <button
          key={opt}
          onClick={() => onChange(opt)}
          className={`flex-1 py-1.5 text-[10px] font-medium rounded-md transition-all ${
            value === opt 
              ? 'bg-white text-blue-600 shadow-sm ring-1 ring-gray-200' 
              : 'text-gray-400 hover:text-gray-600'
          }`}
        >
          {opt.charAt(0).toUpperCase() + opt.slice(1)}
        </button>
      ))}
    </div>
  );
}

interface ColorInputProps {
  value: string;
  onChange: (value: string) => void;
  onClear?: () => void;
}

export function ColorInput({ value, onChange, onClear }: ColorInputProps) {
  return (
    <div className="flex gap-2">
      <input 
        type="color"
        value={value === 'transparent' ? '#ffffff' : value}
        onChange={(e) => onChange(e.target.value)}
        className="h-8 w-12 rounded-lg border border-gray-100 cursor-pointer shadow-sm p-0.5 bg-white shrink-0"
      />
      <input 
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="flex-1 min-w-0 bg-gray-50 border border-gray-100 rounded-lg px-2 text-[10px] font-mono text-gray-500 focus:outline-none"
      />
      {onClear && (
        <button 
          onClick={onClear}
          className={cn(
            "px-3 text-[10px] font-medium rounded-lg border transition-all",
            value === 'transparent' ? 'bg-blue-50 border-blue-100 text-blue-600' : 'bg-gray-50 border-gray-100 text-gray-400'
          )}
        >
          Clear
        </button>
      )}
    </div>
  );
}

interface SettingInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  onBlurUrl?: boolean;
}

export function SettingInput({ label, onBlurUrl, className, ...props }: SettingInputProps) {
  return (
    <SettingField label={label}>
      <input 
        {...props}
        onBlur={onBlurUrl ? (e) => {
          validateUrl(e.target.value);
          props.onBlur?.(e);
        } : props.onBlur}
        className={cn(
          "w-full bg-gray-50 border border-gray-100 rounded-lg p-2.5 text-xs text-gray-900 focus:outline-none shadow-inner",
          props.type === 'text' && props.placeholder?.startsWith('https') && "text-blue-600 font-mono text-[10px]",
          className
        )}
      />
    </SettingField>
  );
}

interface SettingNumberProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  color?: string;
  onColorChange?: (color: string) => void;
}

export function SettingNumber({ label, value, onChange, min = 0, max = 100, step = 1, color, onColorChange }: SettingNumberProps) {
  return (
    <SettingField label={label}>
      <div className="space-y-1">
        <div className="flex gap-2 items-center">
          <div className="flex-1 flex items-center gap-2">
            <button 
              onClick={() => onChange(Math.max(min, value - step))}
              className="w-7 h-7 rounded border border-gray-200 bg-white flex items-center justify-center text-gray-500 hover:text-blue-600 transition-colors shadow-sm"
            >
              −
            </button>
            <div className="flex-1 h-7 bg-gray-50/50 border border-gray-100 rounded flex items-center justify-center">
              <span className="text-[9px] font-bold text-gray-500 font-mono">{value}px</span>
            </div>
            <button 
              onClick={() => onChange(Math.min(max, value + step))}
              className="w-7 h-7 rounded border border-gray-200 bg-white flex items-center justify-center text-gray-500 hover:text-blue-600 transition-colors shadow-sm"
            >
              +
            </button>
          </div>
          {onColorChange && (
            <input
              type="color"
              value={color || '#000000'}
              onChange={(e) => onColorChange(e.target.value)}
              className="h-8 w-8 rounded-lg border border-gray-200 cursor-pointer p-0.5 bg-white shrink-0"
            />
          )}
        </div>
      </div>
    </SettingField>
  );
}

interface SettingRangeProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  onChange: (value: number) => void;
  unit?: string;
}

export function SettingRange({ label, value, min, max, step = 1, onChange, unit = 'px' }: SettingRangeProps) {
  return (
    <SettingField label={label} valueDisplay={`${value}${unit}`}>
      <div className="flex items-center gap-3">
        <input 
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value))}
          className="flex-1 h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
        />
        <input 
          type="number"
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value))}
          className="w-12 bg-gray-50 border border-gray-100 rounded-md p-1 text-[10px] text-center focus:outline-none"
        />
      </div>
    </SettingField>
  );
}
