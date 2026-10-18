import Link from "next/link";

export default function QuickLink({
  href,
  title,
  description,
}: {
  href: string;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="block rounded-lg border border-gray-200 p-4 transition hover:border-blue-400 hover:bg-gray-50"
    >
      <h3 className="font-semibold text-gray-900">{title}</h3>

      <p className="mt-1 text-sm text-gray-500">{description}</p>
    </Link>
  );
}