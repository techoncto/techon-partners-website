import Image from "next/image";

export default function BrandLogo({
  onDark = false,
  size = "sm",
  priority = false,
}: {
  onDark?: boolean;
  size?: "sm" | "md";
  priority?: boolean;
}) {
  const iconBox = size === "md" ? "h-10 w-10" : "h-9 w-9";
  const typeSize = size === "md" ? "text-xl" : "text-[17px]";
  const nameColor = onDark ? "text-white" : "text-navy-900";

  return (
    <span className="inline-flex items-center gap-2.5">
      <Image
        src="/techon_partners_icon_transparent.png"
        alt=""
        width={872}
        height={790}
        className={`${iconBox} object-contain shrink-0`}
        quality={100}
        sizes="40px"
        priority={priority}
      />
      <span className={`font-bold tracking-tight leading-none ${typeSize} ${nameColor}`}>
        Techon <span style={{ color: "#005DBA" }}>Partners</span>
      </span>
    </span>
  );
}
