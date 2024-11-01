// LearnPage.tsx
"use client";

import { useEffect, useRef, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  useMediaQuery,
  useTheme,
  keyframes,
} from "@mui/material";
import ProjectPageBanner from "@/components/Project/ProjectPageBanner";
import faqData from "./faq";
import InfoSidebar from "@/components/InfoSidebar";
import FAQAccordion from "@/components/Learn/FAQAccordion";

const highlightPulse = keyframes`
  0% {
    background-color: transparent;
    transform: scale(1);
  }
  10% {
    background-color: rgba(25, 118, 210, 0.15);
    transform: scale(1.002);
  }
  40% {
    background-color: rgba(25, 118, 210, 0.12);
    transform: scale(1.001);
  }
  100% {
    background-color: transparent;
    transform: scale(1);
  }
`;

interface FAQ {
  id: number;
  question: string;
  answer: string;
}

const LearnPage = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const faqRefs = useRef<Array<HTMLDivElement | null>>([]);
  const [highlightedFaq, setHighlightedFaq] = useState<number | null>(null);
  const [orderedFaqs, setOrderedFaqs] = useState<FAQ[]>(faqData);
  const highlightTimeoutRef = useRef<NodeJS.Timeout>();

  const reorderFaqs = (targetIndex: number) => {
    if (targetIndex === -1) {
      setOrderedFaqs(faqData);
      return;
    }

    const targetFaq = faqData[targetIndex] as FAQ;
    const remainingFaqs = faqData.filter((_, index) => index !== targetIndex);
    setOrderedFaqs([targetFaq, ...remainingFaqs]);
  };

  const handleFAQHighlight = (faqIndex: number) => {
    // Clear any existing highlight timeout
    if (highlightTimeoutRef.current) {
      clearTimeout(highlightTimeoutRef.current);
    }

    setHighlightedFaq(faqIndex);

    // Remove highlight after animation
    highlightTimeoutRef.current = setTimeout(() => {
      setHighlightedFaq(null);
    }, 2000);
  };

  const processFAQHash = (hash: string) => {
    const faqIndex = parseInt(hash.slice(1)) - 1;

    if (faqIndex >= 0 && faqIndex < faqData.length) {
      reorderFaqs(faqIndex);
      handleFAQHighlight(0);

      // Auto-expand the targeted FAQ after reordering
      setTimeout(() => {
        const faqElement = faqRefs.current[0];
        if (faqElement) {
          const expandButton = faqElement.querySelector(
            ".MuiAccordionSummary-expandIconWrapper"
          );
          if (
            expandButton &&
            !expandButton.classList.contains("Mui-expanded")
          ) {
            (expandButton as HTMLElement).click();
          }
        }
      }, 100);
    }
  };

  useEffect(() => {
    // Handle initial load
    if (window.location.hash) {
      processFAQHash(window.location.hash);
    }

    // Handle hash changes
    const handleHashChange = () => {
      if (window.location.hash) {
        processFAQHash(window.location.hash);
      } else {
        reorderFaqs(-1);
      }
    };

    window.addEventListener("hashchange", handleHashChange);

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
      if (highlightTimeoutRef.current) {
        clearTimeout(highlightTimeoutRef.current);
      }
    };
  }, []);

  return (
    <Box>
      <ProjectPageBanner
        background="/learnBanner.png"
        headline="Learn"
        description="Learn about how to invest in a project, what the process is like, and what to expect as an investor."
      />
      <Grid container spacing={2} sx={{ mt: 1 }}>
        <Grid item xs={12} sm={8}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                FAQs
              </Typography>

              {orderedFaqs.map((faq, index) => (
                <Box
                  key={faq.id}
                  //@ts-expect-error - ref is not typed
                  ref={(el) => {
                    faqRefs.current[index] = el as HTMLDivElement;
                    return el;
                  }}
                  id={`faq-${faq.id}`}
                  sx={{
                    borderRadius: 1,
                    transition: "background-color 0.3s ease",
                    animation:
                      highlightedFaq === index
                        ? `${highlightPulse} 2s ease`
                        : "none",
                  }}
                >
                  <FAQAccordion
                    question={faq.question}
                    answer={faq.answer}
                    isMarkdown
                    isHighlighted={highlightedFaq === index}
                  />
                </Box>
              ))}
            </CardContent>
          </Card>
        </Grid>

        {!isMobile && <InfoSidebar />}
      </Grid>
    </Box>
  );
};

export default LearnPage;
