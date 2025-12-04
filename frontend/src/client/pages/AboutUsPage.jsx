import { useEffect, useState, useContext } from "react";
import api from "../../api/api";
import LoadingComponent from "../components/LoadingComponent";

import { AboutHeroSection } from "../components/AboutUs/AboutHeroSection";
import { AboutStatsSection } from "../components/AboutUs/AboutStatsSection";
import { TestimonialsSection } from "../components/AboutUs/TestimonialsSection";

import { AboutPageHeader } from "../components/AboutUs/AboutPageHeader";
import { OurHistorySection } from "../components/AboutUs/OurHistorySection";
import { CoreValuesSection } from "../components/AboutUs/CoreValuesSection";
import { TeamSection } from "../components/AboutUs/TeamSection";

const ABOUT_US_PAGE_ID = 2;

const sectionComponents = {
    about_header: AboutPageHeader,
    about_hero: AboutHeroSection,
    about_stats: AboutStatsSection,
    about_testimonials: TestimonialsSection,
    about_history: OurHistorySection,
    about_values: CoreValuesSection,
    about_team: TeamSection,
};

const AboutUsPage = () => {
    const [sections, setSections] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSections = async () => {
            try {
                const res = await api.get(`pages/${ABOUT_US_PAGE_ID}/sections`);

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

    if (loading) return <LoadingComponent />;

    const headerSection = sections.find((s) => s.type === "about_header");
    const contentSections = sections.filter((s) => s.type !== "about_header");

    return (
        <>
            {headerSection ? (
                <AboutPageHeader data={headerSection} />
            ) : (
                <AboutPageHeader data={{}} />
            )}

            {contentSections.length > 0 ? (
                contentSections.map((section) => {
                    const SectionComp = sectionComponents[section.type];
                    return SectionComp ? (
                        <SectionComp key={section.id} data={section} />
                    ) : null;
                })
            ) : (
                <p style={{ textAlign: "center", padding: "50px" }}>
                    Không có nội dung nào để hiển thị.
                </p>
            )}
        </>
    );
};

export default AboutUsPage;
