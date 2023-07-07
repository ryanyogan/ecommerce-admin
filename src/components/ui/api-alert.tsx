"use client";

import { Copy, Server } from "lucide-react";
import { toast } from "react-hot-toast";
import { Alert, AlertDescription, AlertTitle } from "./alert";
import { Badge, BadgeProps } from "./badge";
import { Button } from "./button";

interface ApiAlertProps {
  title: string;
  description: string;
  variant: "public" | "admin";
}

const textMap: Record<ApiAlertProps["variant"], string> = {
  public: "Public",
  admin: "Admin",
};

const variantMap: Record<ApiAlertProps["variant"], BadgeProps["variant"]> = {
  public: "secondary",
  admin: "destructive",
};

export function ApiAlert({
  title,
  description,
  variant = "public",
}: ApiAlertProps) {
  const onCopy = (description: string) => {
    navigator.clipboard.writeText(description);
    toast.success("URL Copied to Clipboard");
  };

  return (
    <Alert>
      <Server className="h-4 w-4" />
      <AlertTitle className="flex items-center gap-x-2">
        {title}
        <Badge variant={variantMap[variant]}>{textMap[variant]}</Badge>
      </AlertTitle>
      <AlertDescription className="mt-4 flex items-center justify-between">
        <div className="text-xs font-semibold text-indigo-800 underline underline-offset-2">
          <a href={description} target="_blank">
            {description}
          </a>
        </div>
        <Button variant="outline" size="sm" onClick={() => onCopy(description)}>
          <Copy className="h-4 w-4" />
        </Button>
      </AlertDescription>
    </Alert>
  );
}
