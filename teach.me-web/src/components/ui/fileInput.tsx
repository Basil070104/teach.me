import { Input } from "@/components/ui/input";

interface InputFileProps {
  width?: string;
  height?: string;
  onChange: (file: File) => void;
}

export function InputFile({ width = "100%", height = "300px", onChange }: InputFileProps) {
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      onChange(selectedFile);
    }
  };

  return (
    <div className="grid w-full max-w-sm items-center gap-1.5">
      <Input
        id="picture"
        type="file"
        accept=".pdf"
        style={{ width, height }}
        className="rounded-md border-zinc-200"
        onChange={handleFileChange}
      />
    </div>
  );
}
