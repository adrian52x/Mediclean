import { DisinfectantVolumeEnum } from "@/types";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function VolumePriceFields({ volumes, setVolumes }: {
  volumes: { volume: string; price: string }[];
  setVolumes: (v: { volume: string; price: string }[]) => void;
}) {
    return (
        <div className="space-y-2">
        {volumes.map((v, idx) => (
            <div key={idx} className="flex gap-2 items-center">
                <Select
                    value={v.volume}
                    onValueChange={val => {
                    const newVolumes = [...volumes];
                    newVolumes[idx].volume = val;
                    setVolumes(newVolumes);
                    }}
                    required
                >
                    <SelectTrigger className="max-w-[100px]">
                        <SelectValue placeholder="Volum" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            {Object.values(DisinfectantVolumeEnum).map(vol => (
                            <SelectItem key={vol} value={vol}>{vol}</SelectItem>
                            ))}
                        </SelectGroup>
                    </SelectContent>
                </Select>
                <Input
                    type="number"
                    placeholder="Preț"
                    value={v.price}
                    min={0}
                    onChange={e => {
                    const newVolumes = [...volumes];
                    newVolumes[idx].price = e.target.value;
                    setVolumes(newVolumes);
                    }}
                    className="max-w-[100px]"
                    required
                />
                {volumes.length > 1 && (
                    <Button type="button" variant="destructive" onClick={() => setVolumes(volumes.filter((_, i) => i !== idx))}>
                    Șterge
                    </Button>
                )}
            </div>
        ))}
        <Button
            type="button"
            variant="outline"
            onClick={() => setVolumes([...volumes, { volume: '', price: '' }])}
            className="text-xl"
            disabled={volumes.length >= 6}
        >
            +
        </Button>
        </div>
    );
}