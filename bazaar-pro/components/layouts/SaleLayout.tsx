import { Divider } from "@mui/material";
import Topbar from '../Topbar';
import { Footer1 } from "../footer";
import Header from '../header/Header';
import { MobileNavigationBar } from "../mobile-navigation";
import Navbar from '../navbar/Navbar';
import SearchInputWithCategory from "../search-box/SearchInputWithCategory";
import { FC, Fragment, ReactNode } from "react";

/**
 *  Used:
 *  1. sale-page-1 page
 *  2. sale-page-2 page
 */

// =============================================================

type NoOne = { type?: "one"; categoryNav?: never; children: ReactNode };
type NoTwo = { type?: "two"; children: ReactNode; categoryNav: ReactNode };

type SaleLayoutProps = NoOne | NoTwo;
// =============================================================

const SaleLayout: FC<SaleLayoutProps> = ({
  children,
  type = "one",
  categoryNav,
}) => {
  return (
    <Fragment>
      {/* TOPBAR AREA */}
      <Topbar />

      {/* HEADER AREA */}
      <Header searchInput={<SearchInputWithCategory />} />

      {type === "one" && (
        <Fragment>
          <Navbar />
          {children}
        </Fragment>
      )}

      {type === "two" && (
        <Fragment>
          <Divider />
          {categoryNav}
          <div className="section-after-sticky">{children}</div>
        </Fragment>
      )}

      {/* FOOTER AREA */}
      <Footer1 />

      {/* SMALLER DEVICE NAVIGATION */}
      <MobileNavigationBar />
    </Fragment>
  );
};

export default SaleLayout;
