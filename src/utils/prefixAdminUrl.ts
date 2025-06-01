// utils/prefixAdminUrl.ts
type NavItem = {
  title: string;
  url?: string;
  icon?: any;
  items?: NavItem[];
};

type NavSection = {
  label: string;
  items: NavItem[];
};

export function addAdminPrefix(navData: NavSection[], prefix = "/admin"): NavSection[] {
  return navData.map((section) => ({
    ...section,
    items: section.items.map((item) => addPrefixToItem(item, prefix)),
  }));
}

function addPrefixToItem(item: NavItem, prefix: string): NavItem {
  const newItem: NavItem = {
    ...item,
    url: item.url ? prefix + item.url : undefined,
    items: item.items?.map((subItem) => addPrefixToItem(subItem, prefix)) || [],
  };

  return newItem;
}

export function withAdminPrefix(path: string, prefix = "/admin") {
  if (!path.startsWith("/")) path = "/" + path;
  return `${prefix}${path}`;
}
