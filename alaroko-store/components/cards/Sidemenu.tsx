import MenuItem from "./MenuItem";

interface SideMenuProps {
  entries: string[];
}

export default function SideMenu({ entries }: SideMenuProps) {
  return (
    <aside className="flex w-64 flex-col border-r bg-white p-4">
      <nav className="flex flex-col gap-1">
        {entries.map((entry) => (
          <MenuItem
            key={entry}
            label={entry}
            href={`/${entry.toLowerCase().replace(/\s+/g, "-")}`}
          />
        ))}
      </nav>
    </aside>
  );
}