"use client";

import React from "react";
import { Actions, State, useSettings } from "@/lib/stores/settings";
import { BareInput } from "./BareInput";

type InputProps = {
  id: string;
  label: string;
  description: string;
  stateName: keyof State;
  actionName: keyof Actions;
};

export default function SettingsInput({
  id,
  label,
  description,
  stateName,
  actionName,
}: InputProps) {
  const value = useSettings((state) => state[stateName]);
  const setValue = useSettings((state) => state[actionName]);

  return (
    <BareInput id={id} label={label} description={description} value={value} setValue={setValue} />
  );
}
