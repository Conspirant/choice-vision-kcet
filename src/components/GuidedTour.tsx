import React, { useState } from "react";
import Joyride, { CallBackProps, STATUS, Step } from "react-joyride";
import Navbar from "@/components/Navbar";

const steps: Step[] = [
  {
    target: ".add-option-form",
    content: "Start by adding your preferred college and branch here.",
  },
  {
    target: ".option-table-section",
    content: "Your added options will appear here. You can reorder, edit, or remove them.",
  },
  {
    target: ".save-options-btn",
    content: "Click here to save your options. They are stored in your browser.",
  },
  {
    target: ".export-pdf-btn",
    content: "Export your list as a PDF for offline use or sharing.",
  },
  {
    target: ".import-export-btns",
    content: "You can also import/export your list in Excel/CSV format.",
  },
  {
    target: ".analytics-tab",
    content: "Analyze your chances using the Analytics tab.",
  },
  {
    target: ".faq-help-btn",
    content: "Need help? Access the FAQ and help section here.",
  },
];

const GuidedTour = () => {
  const [run, setRun] = useState(true);

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status } = data;
    if (status === 'finished' || status === 'skipped') {
      setRun(false);
      localStorage.setItem("kcet-tour-complete", "true");
    }
  };

  // Only run if not completed before
  React.useEffect(() => {
    if (localStorage.getItem("kcet-tour-complete")) setRun(false);
  }, []);

  return (
    <div className="min-h-screen royal-gradient flex flex-col">
      <Navbar />
      <div className="flex-1 w-full max-w-3xl mx-auto px-2 sm:px-6 py-4">
        <Joyride
          steps={steps}
          run={run}
          continuous
          showSkipButton
          showProgress
          callback={handleJoyrideCallback}
          styles={{ options: { zIndex: 10000 } }}
        />
      </div>
    </div>
  );
};

export default GuidedTour; 