"use client";

import { Actions, State, useSettings } from "@/lib/stores/settings";
import React from "react";

type SelectProps = {
  id: string;
  label: string;
  options: string[];
  stateName: keyof State;
  actionName: keyof Actions;
};

/**
 * We have to prevent initial server-side rendering of the select component
 * because the Zustand state from local storage is not available on the server
 * and the select component doesn't update properly once state is loaded.
 */
export default function Select(props: SelectProps) {
  const [hasMounted, setHasMounted] = React.useState(false);

  React.useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return (
      <div className="animate-pulse">
        <div className="w-32 h-4 bg-slate-200 rounded"></div>
        <div className="max-w-xs mt-4 h-10 bg-slate-200 rounded"></div>
      </div>
    );
  }

  return <SelectDynamic {...props} />;
}

function SelectDynamic({ id, label, options, stateName, actionName }: SelectProps) {
  const value = useSettings((state) => state[stateName]);
  const setValue = useSettings((state) => state[actionName]);

  return (
    <div className="max-w-xs">
      <label htmlFor={id} className="block text-sm font-medium leading-6 text-gray-900">
        {label}
      </label>
      <select
        id={id}
        name={id}
        className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6"
        value={value ? value.toString() : ""}
        onChange={(e) => setValue(e.target.value)}
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}
