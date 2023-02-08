import React from "react";

type HiddenInputProps = {
  name: string;
  value: string;
};

export default function HiddenInput({ name, value }: HiddenInputProps) {
  return <input type="hidden" name={name} value={value} />;
}
