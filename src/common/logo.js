// Tiscord wordmarks (public/logo) paired with the icon (public/icon) in the
// same colour, picked once per page load so the whole app stays consistent
const BRANDS = [
  { logo: "/logo/tiscord-red.svg", icon: "/icon/icon1.svg" },
  { logo: "/logo/tiscord-red.svg", icon: "/icon/icon2.svg" },
  { logo: "/logo/tiscord-purple.svg", icon: "/icon/icon3.svg" },
  { logo: "/logo/tiscord-yellowwhite.svg", icon: "/icon/icon4.svg" },
  { logo: "/logo/tiscord-orange.svg", icon: "/icon/icon5.svg" },
  { logo: "/logo/tiscord-premium.svg", icon: "/icon/icon6.svg" },
];

const brand = BRANDS[Math.floor(Math.random() * BRANDS.length)];

export const randomLogo = brand.logo;
export const randomIcon = brand.icon;

// Swap the tab icon to match
export const applyFavicon = () => {
  const link = document.querySelector("link[rel~='icon']");
  if (link) {
    link.type = "image/svg+xml";
    link.href = randomIcon;
  }
};
