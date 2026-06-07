import { useState, useEffect, type FormEvent } from "react";
import type { PropertyCategory } from "@/types";

interface UseCategoryFormProps {
  isOpen: boolean;
  editing: PropertyCategory | null;
  onSubmit: (data: { name: string; description?: string; default_rental_type?: string }) => Promise<void> | void;
}

export const useCategoryForm = ({ isOpen, editing, onSubmit }: UseCategoryFormProps) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [rentalType, setRentalType] = useState<"PER_ROOM" | "WHOLE_PROPERTY">("PER_ROOM");

  useEffect(() => {
    if (isOpen) {
      Promise.resolve().then(() => {
        setName(editing?.name || "");
        setDescription(editing?.description || "");
        setRentalType(editing?.default_rental_type || "PER_ROOM");
      });
    }
  }, [isOpen, editing]);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    await onSubmit({ name, description, default_rental_type: rentalType });
  };

  return {
    name,
    setName,
    description,
    setDescription,
    rentalType,
    setRentalType,
    handleSubmit,
  };
};
