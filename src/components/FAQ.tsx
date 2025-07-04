import React from "react";
import { Card } from "@/components/ui/card";
import Navbar from "@/components/Navbar";

const faqs = [
  {
    q: "How do I add a new option?",
    a: "Use the form at the top of the Option Entry page to select a college and branch, then click 'Add Option'."
  },
  {
    q: "How do I save my options?",
    a: "Click the 'Save' button above your option list. Your options are saved in your browser."
  },
  {
    q: "How do I export my options?",
    a: "Use the 'Export PDF' or 'Export Excel/CSV' buttons to download your list."
  },
  {
    q: "How do I import options from Excel/CSV?",
    a: "Click the 'Import' button and select your file. The app will read your options and add them to your list."
  },
  {
    q: "What are cutoffs?",
    a: "Cutoffs are the last rank admitted to a college/branch for a given category in previous years. They help you estimate your chances."
  },
  {
    q: "How do I analyze my chances?",
    a: "Use the Analytics tab to see your chances based on previous years' cutoffs."
  },
  {
    q: "Is my data private?",
    a: "Yes, your data is stored only in your browser and is not shared with anyone."
  }
];

const FAQ = () => (
  <div className="min-h-screen royal-gradient flex flex-col">
    <Navbar />
    <main className="flex-1 w-full max-w-2xl mx-auto px-4 sm:px-6 py-8 flex flex-col gap-4">
      <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 gradient-text text-center">Frequently Asked Questions</h2>
      {faqs.map((faq, idx) => (
        <Card key={idx} className="mb-2 sm:mb-4 p-4 sm:p-6">
          <h4 className="font-semibold mb-2 text-base sm:text-lg">{faq.q}</h4>
          <p className="text-muted-foreground text-sm sm:text-base">{faq.a}</p>
        </Card>
      ))}
    </main>
  </div>
);

export default FAQ; 