"use client";

import React from "react";
import { Actions, State, useSettings } from "@/lib/stores/settings";

type SelectProps = {
  id: string;
  label: string;
  stateName: keyof State;
  actionName: keyof Actions;
};

export default function Input({ id, label, stateName, actionName }: SelectProps) {
  const value = useSettings((state) => state[stateName]);
  const setValue = useSettings((state) => state[actionName]);

  const updateState = (e: React.FormEvent<HTMLInputElement>) => {
    setValue(e.currentTarget.value);
  };

  return (
    <div className="col-span-full">
      <label htmlFor="street-address" className="block">
        <p className="font-semibold leading-7 text-gray-900">{label}</p>
        <p className="mt-1 text-sm leading-6 text-gray-600">
          {
            "An optional text to guide the model's style or continue a previous audio segment. The prompt should match the audio language."
          }
        </p>
      </label>
      <div className="mt-2">
        <input
          type="text"
          name={id}
          id={id}
          defaultValue={value}
          onBlur={updateState}
          className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
        />
      </div>
    </div>
  );
}
