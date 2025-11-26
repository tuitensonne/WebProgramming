import { useEffect, useState, useContext } from "react";
import api from "../../api/api";
import LoadingComponent from "../components/LoadingComponent";
import { Box, Typography } from "@mui/material";

import { AboutHeroSection } from "../components/AboutUs/AboutHeroSection";
import { AboutStatsSection } from "../components/AboutUs/AboutStatsSection";
import { TestimonialsSection } from "../components/AboutUs/TestimonialsSection";
import Thumbnail from "../components/Thumbnail";

const ABOUT_US_PAGE_ID = 2;

const sectionComponents = {
    about_hero: AboutHeroSection,
    about_stats: AboutStatsSection,
    about_testimonials: TestimonialsSection,
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

export default AboutUsPage;
