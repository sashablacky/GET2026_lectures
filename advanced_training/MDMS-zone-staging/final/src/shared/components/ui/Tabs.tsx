import type { ReactNode } from "react";
import "./ui.css";

export interface TabItem<K extends string> {
  id: K;
  label: ReactNode;
}

interface TabsProps<K extends string> {
  tabs: TabItem<K>[];
  value: K;
  onChange: (id: K) => void;
  label?: string;
}

export default function Tabs<K extends string>({ tabs, value, onChange, label }: TabsProps<K>) {
  return (
    <div className="tabs" role="tablist" aria-label={label}>
      {tabs.map((tab) => (
        <button
          key={tab.id}
          type="button"
          role="tab"
          aria-selected={tab.id === value}
          className={`tabs__tab ${tab.id === value ? "tabs__tab--active" : ""}`}
          onClick={() => onChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
