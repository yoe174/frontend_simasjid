import Link from "next/link";
import { withAdminPrefix } from "@/utils/prefixAdminUrl";
interface BreadcrumbProps {
  pageName: string;
  mapName: string;
}

const Breadcrumb = ({ pageName, mapName }: BreadcrumbProps) => {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <h2 className="text-[26px] font-bold leading-[30px] text-dark dark:text-white">
        {mapName}
      </h2>

      <nav>
        <ol className="flex items-center gap-2">
          <li className="font-medium"> {pageName} /
          </li>
          <li className="font-medium text-primary">{mapName}</li>
        </ol>
      </nav>
    </div>
  );
};

export default Breadcrumb;
