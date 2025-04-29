import {socialLinks} from "@/app/data/socialLinks";

export default function SocialLinks() {
  return (
    <div className="flex justify-center space-x-4 mt-4">
              {socialLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.url}
                  className={`text-gray-600 ${link.hoverColorClass}`}
                  aria-label={link.ariaLabel}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="32"
                    height="32"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <title>{link.icon.title}</title>
                    <path d={link.icon.path} />
                  </svg>
                </a>
              ))}
            </div>
  )
}
