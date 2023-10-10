"use client";

import React from "react";
import { useKey } from "@/lib/stores/key";
import { BareInput } from "@/components/BareInput";

type KeyInputProps = {
  id: string;
  label: string;
  description: string;
};

export default function KeyInput({ id, label, description }: KeyInputProps) {
  const value = useKey((state) => state.key);
  const setValue = useKey((state) => state.setKey);

  return (
    <BareInput id={id} label={label} description={description} value={value} setValue={setValue} />
  );
}
