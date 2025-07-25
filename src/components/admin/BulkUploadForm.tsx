"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface BulkUploadFormProps {
  uploadAction: (jsonContent: string) => Promise<{ success: boolean; message: string; count?: number }>;
  requiredFormat: string;
}

export function BulkUploadForm({ uploadAction, requiredFormat }: BulkUploadFormProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Submitting bulk upload", file);
    if (!file) {
      toast("No file selected.", { description: "Please select a JSON file to upload." });
      return;
    }

    setIsSubmitting(true);
    const reader = new FileReader();
    reader.onload = async (event) => {
      const content = event.target?.result as string;
      console.log("File read, content:", content);
      try {
        const result = await uploadAction(content);
        console.log("Upload action result:", result);
        if (result.success) {
          toast("Upload Successful", { description: `${result.count} items added.` });
        } else {
          toast("Upload Failed", { description: result.message });
        }
      } catch (error) {
        toast("An error occurred.", { description: String(error) });
      } finally {
        setIsSubmitting(false);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="flex items-center gap-4">
        <label htmlFor="bulk-upload-file" className="sr-only">Choose tournament JSON file</label>
        <Input id="bulk-upload-file" type="file" accept=".json" onChange={handleFileChange} required placeholder="Choose file" title="Choose tournament JSON file" />
        <Button type="submit" disabled={isSubmitting || !file} title="Upload selected tournament JSON file">
          {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Upload File
        </Button>
      </form>
      <div>
        <h4 className="font-semibold text-lg mb-2">Required JSON Format:</h4>
        <p className="text-sm text-muted-foreground mb-2">
          Upload a JSON file containing an array of objects. Each object must match the following structure.
        </p>
        <pre className="p-4 bg-gray-900 rounded-md text-sm text-green-400 overflow-x-auto">
          <code>{requiredFormat}</code>
        </pre>
      </div>
    </div>
  );
} 