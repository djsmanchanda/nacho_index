const links = [
  { href: "https://github.com/djsmanchanda", label: "GitHub" },
  { href: "https://www.linkedin.com/in/djsmanchanda", label: "LinkedIn" },
  { href: "https://djsmanchanda.com", label: "djsmanchanda.com" },
  { href: "https://buymeacoffee.com/djsmanchanda", label: "Buy me some Nachos" },
];

export function ProfileLinks() {
  return (
    <footer
      style={{
        position: "fixed",
        right: 16,
        bottom: 12,
        zIndex: 40,
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "flex-end",
        columnGap: 12,
        rowGap: 4,
        fontSize: 11,
        color: "#61616b",
      }}
    >
      {links.map((link) => (
        <a
          key={link.href}
          href={link.href}
          target="_blank"
          rel="noreferrer"
          className="transition hover:text-zinc-300"
        >
          {link.label}
        </a>
      ))}
    </footer>
  );
}
