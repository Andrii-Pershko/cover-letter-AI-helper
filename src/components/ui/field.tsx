"use client";

import { cn } from "@/lib/utils";
import { ChevronDown } from "lucide-react";
import {
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  type InputHTMLAttributes,
  type KeyboardEvent,
  type TextareaHTMLAttributes,
} from "react";

export const controlClassName =
  "glass-control h-11 w-full rounded-[14px] px-3.5 text-sm text-ink outline-none transition-[border-color,box-shadow,background-color] duration-200 placeholder:text-muted/70 hover:border-[rgb(90_140_132_/_0.42)] hover:bg-white/60 focus:border-accent focus:bg-white/70 focus:shadow-[0_0_0_3px_rgb(44_185_164_/_0.14)] disabled:cursor-not-allowed disabled:opacity-60";

export function Label({
  htmlFor,
  children,
  hint,
}: {
  htmlFor?: string;
  children: React.ReactNode;
  hint?: string;
}) {
  return (
    <label htmlFor={htmlFor} className="flex min-h-5 flex-wrap items-baseline gap-x-2">
      <span className="text-sm font-medium leading-5 text-ink">
        {children}
      </span>
      {hint ? (
        <span className="text-xs leading-5 text-muted">{hint}</span>
      ) : null}
    </label>
  );
}

export function Input({
  className,
  type = "text",
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  if (type === "file") {
    return <FileInput className={className} {...props} />;
  }

  return (
    <input
      type={type}
      className={cn(controlClassName, "file:hidden", className)}
      {...props}
    />
  );
}

export function FileInput({
  className,
  onChange,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  const [fileName, setFileName] = useState("");

  return (
    <label
      className={cn(
        controlClassName,
        "relative flex cursor-pointer items-center justify-between gap-3",
        className,
      )}
    >
      <span
        className={cn(
          "min-w-0 truncate",
          fileName ? "text-ink" : "text-muted/70",
        )}
      >
        {fileName || "Обери PDF, DOCX або TXT"}
      </span>
      <span className="shrink-0 rounded-full bg-white/50 px-2.5 py-1 text-xs font-medium text-muted">
        Файл
      </span>
      <input
        type="file"
        className="sr-only"
        onChange={(event) => {
          setFileName(event.target.files?.[0]?.name ?? "");
          onChange?.(event);
        }}
        {...props}
      />
    </label>
  );
}

export function Textarea({
  className,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(
        "glass-control h-[200px] w-full resize-none rounded-[14px] px-3.5 py-3 text-sm leading-6 text-ink outline-none transition-[border-color,box-shadow,background-color] duration-200 placeholder:text-muted/70 hover:border-[rgb(90_140_132_/_0.42)] hover:bg-white/60 focus:border-accent focus:bg-white/70 focus:shadow-[0_0_0_3px_rgb(44_185_164_/_0.14)] disabled:cursor-not-allowed disabled:opacity-60",
        className,
      )}
      {...props}
    />
  );
}

export type SelectOption = { value: string; label: string };

type SelectProps = {
  id?: string;
  name: string;
  options: Array<string | SelectOption>;
  defaultValue?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
};

export function Select({
  id,
  name,
  options,
  defaultValue = "",
  placeholder = "Обери",
  required,
  disabled,
  className,
}: SelectProps) {
  const generatedId = useId();
  const listId = `${generatedId}-list`;
  const rootRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(defaultValue);
  const [activeIndex, setActiveIndex] = useState(-1);

  const items = useMemo(() => {
    const normalized = options.map((option) =>
      typeof option === "string" ? { value: option, label: option } : option,
    );
    if (value && !normalized.some((option) => option.value === value)) {
      return [{ value, label: value }, ...normalized];
    }
    return normalized;
  }, [options, value]);

  const selected = items.find((option) => option.value === value);
  const selectedIndex = items.findIndex((option) => option.value === value);
  const highlightIndex =
    activeIndex >= 0 ? activeIndex : Math.max(selectedIndex, 0);

  useEffect(() => {
    function onPointerDown(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
        setActiveIndex(-1);
      }
    }
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, []);

  function closeMenu() {
    setOpen(false);
    setActiveIndex(-1);
  }

  function openMenu() {
    setOpen(true);
    setActiveIndex(Math.max(selectedIndex, 0));
  }

  function choose(next: string) {
    setValue(next);
    closeMenu();
  }

  function onKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    if (disabled) return;

    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault();
      if (!open) {
        openMenu();
        return;
      }
      setActiveIndex((current) => {
        if (items.length === 0) return -1;
        const from = current >= 0 ? current : highlightIndex;
        if (event.key === "ArrowDown") {
          return from < items.length - 1 ? from + 1 : 0;
        }
        return from > 0 ? from - 1 : items.length - 1;
      });
    } else if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (!open) {
        openMenu();
        return;
      }
      const option = items[highlightIndex];
      if (option) choose(option.value);
    } else if (event.key === "Escape") {
      closeMenu();
    }
  }

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <input type="hidden" name={name} value={value} required={required} />
      <button
        type="button"
        id={id}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => (open ? closeMenu() : openMenu())}
        onKeyDown={onKeyDown}
        className={cn(
          controlClassName,
          "flex cursor-pointer items-center justify-between gap-3 text-left",
        )}
      >
        <span className={cn("min-w-0 truncate", !selected && "text-muted/70")}>
          {selected?.label ?? placeholder}
        </span>
        <ChevronDown
          className={cn(
            "size-4 shrink-0 text-muted transition-transform",
            open && "rotate-180",
          )}
          aria-hidden
        />
      </button>
      {open ? (
        <ul
          id={listId}
          role="listbox"
          aria-activedescendant={
            open ? `${listId}-${highlightIndex}` : undefined
          }
          className="glass-dropdown absolute z-30 mt-1.5 max-h-60 w-full overflow-auto rounded-[16px] p-1.5"
        >
          {items.map((option, index) => {
            const isSelected = option.value === value;
            const isActive = index === highlightIndex;
            return (
              <li key={option.value} role="presentation">
                <button
                  type="button"
                  id={`${listId}-${index}`}
                  role="option"
                  aria-selected={isSelected}
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => choose(option.value)}
                  className={cn(
                    "flex w-full cursor-pointer rounded-xl px-3.5 py-2.5 text-left text-sm text-ink transition-colors duration-200",
                    isActive && "bg-accent/10",
                    isSelected && "font-medium text-accent",
                  )}
                >
                  {option.label}
                </button>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}

export function Field({
  label,
  hint,
  htmlFor,
  children,
  className,
}: {
  label: string;
  hint?: string;
  htmlFor?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex min-w-0 flex-col gap-1.5", className)}>
      <Label htmlFor={htmlFor} hint={hint}>
        {label}
      </Label>
      {children}
    </div>
  );
}
