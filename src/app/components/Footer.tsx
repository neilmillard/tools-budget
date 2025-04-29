import SocialLinks from "@/app/components/SocialLinks";

export function Footer() {
    return <div className="pt-4 flex h-full flex-col justify-center">
              <SocialLinks />
    <div className="flex flex-row justify-center mt-3">
      © 2017-2025 Neil Millard
    </div>
    <div className="text-xs text-gray-500 h-8 mt-2 text-center">
      <a href="https://github.com/neilmillard" target="_blank">Github</a> - <a
      href="https://twitter.com/neil_millard" target="_blank">Twitter</a> - <a
      href="https://www.facebook.com/neil.millard/" target="_blank">Facebook</a> - <a
      href="https://www.youtube.com/channel/UCAaoh3jk1qtvD3ALPp48_8w" target="_blank">YouTube channel</a> - <a
      href="https://www.techanswers.club/" target="_blank">Tech Answers Club</a>
    </div>
        <div className="text-xs text-gray-500 h-6 text-center">
            Calculators provided are a guide, your financial provider may use a different calculation
        </div>
    </div>
}