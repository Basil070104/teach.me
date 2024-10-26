import { Input } from "@/components/ui/input";

interface InputFileProps {
  width?: string;
  height?: string;
}

export function InputFile({ width = "100%", height = "300px" }: InputFileProps) {
  return (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Input
        id="picture"
        type="file"
        style={{ width, height }} // Set width and height dynamically
        className="rounded-md border-zinc-200"
      />
    </div>
  );
}