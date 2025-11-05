import * as React from "react";
import { format } from "date-fns";
import { ja } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";

import { Button } from "../components/ui/button";
import { Calendar } from "../components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../components/ui/popover";

type Props = {
    /** YYYY-MM-DD or '' */
    value: string;
    /** YYYY-MM-DD or '' を返す */
    onChange: (v: string) => void;
    /** YYYY-MM-DD で “これ以前を無効化” する最小日 (例: today) */
    min?: string;
    placeholder?: string;
    className?: string;
};

function ymdToDate(ymd: string | undefined) {
    if (!ymd) return undefined;
    // タイムゾーンのズレを避ける（UTC化しない）
    const [y, m, d] = ymd.split("-").map(Number);
    if (!y || !m || !d) return undefined;
    return new Date(y, m - 1, d);
}

function dateToYmd(d?: Date) {
    if (!d) return "";
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
}

export default function DueDatePicker({
    value,
    onChange,
    min,
    placeholder = "期日なし",
    className,
}: Props) {
    const [open, setOpen] = React.useState(false);
    const selected = ymdToDate(value);
    const minDate = ymdToDate(min);

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    type="button"
                    variant="outline"
                    className={className + " inline-flex items-center gap-2 text-xs"}
                >
                    <CalendarIcon className="h-4 w-4" />
                    {selected ? format(selected, "yyyy-MM-dd (EEE)", { locale: ja }) : placeholder}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                    mode="single"
                    selected={selected}
                    onSelect={(d) => {
                        onChange(dateToYmd(d || undefined));
                        setOpen(false);
                    }}
                    locale={ja}
                    // 過去日を無効化
                    disabled={
                        minDate
                            ? (date) =>
                                date < new Date(minDate.getFullYear(), minDate.getMonth(), minDate.getDate())
                            : undefined
                    }
                    initialFocus
                />
                <div className="flex justify-between p-2 border-t">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs"
                        onClick={() => {
                            onChange("");
                            setOpen(false);
                        }}
                    >
                        期日をクリア
                    </Button>
                    <Button variant="ghost" size="sm" className="text-xs" onClick={() => setOpen(false)}>
                        閉じる
                    </Button>
                </div>
            </PopoverContent>
        </Popover>
    );
}
