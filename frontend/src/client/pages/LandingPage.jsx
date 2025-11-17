// src/pages/LandingPage/admin/guest/LandingPage.jsx
import { useEffect, useState } from "react";
import api from "../../api/api";

import { WhyChooseUsSection } from "../components/LandingPage/WhyChooseUsSection";
import { LandingPageLayoutOne } from "../components/LandingPage/LandingPageLayoutOne";
import { LandingPageLayoutTwo } from "../components/LandingPage/LandingPageLayoutTwo";
import { ItemListingLayout } from "../components/LandingPage/ItemListingLayout";
import { LandingPageLayoutThree } from "../components/LandingPage/LandingPageLayoutThree";
import Thumbnail from "../components/Thumbnail";
import LoadingComponent from "../components/LoadingComponent";

const sectionComponents = {
  why_choose_us: WhyChooseUsSection,
  content_type_one: LandingPageLayoutOne,
  content_type_two: LandingPageLayoutTwo,
  item_listing_layout: ItemListingLayout,
  content_type_three: LandingPageLayoutThree,
};

const LandingPage = () => {
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSections = async () => {
      try {
        const res = await api.get("pages/1/sections");
        console.log(res.data)
        if (res.data?.success) {
          setSections(res.data.data);
        } else {
          console.error("Failed to fetch sections:", res.data);
        }
      } catch (error) {
        console.error("Error fetching sections:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSections();
  }, []);

  if (loading) return <LoadingComponent></LoadingComponent>

  return (
    <>
      <Thumbnail />

      {sections.length > 0 ? (
        sections.map((section) => {
          const SectionComp = sectionComponents[section.type];
          return SectionComp ? (
            <SectionComp key={section.id} data={section} />
          ) : null;
        })
      ) : (
        <p>Không có nội dung nào để hiển thị.</p>
      )}

    </>
  );
};

export default LandingPage;