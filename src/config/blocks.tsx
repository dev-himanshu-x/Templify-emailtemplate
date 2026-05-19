import { Columns, CreditCard, Image as ImageIcon, Layout, List, Minus, MousePointer, PanelsTopLeft, Star, Type } from "lucide-react";
import React from "react";
import type { BuilderItemProps, ItemType } from "@/types/builder";

export interface TemplateBlockConfig {
  type: ItemType;
  label: string;
  icon: React.ReactNode;
  defaultProps?: Partial<BuilderItemProps>;
}

export interface BlockCategory {
  id: string;
  title: string;
  icon: React.ReactNode;
  colorClass: string;
  blocks: TemplateBlockConfig[];
}

export const BLOCK_CATEGORIES: BlockCategory[] = [
  {
    id: "headers",
    title: "Headers",
    icon: <PanelsTopLeft size={14} />,
    colorClass: "text-blue-600",
    blocks: [
      { type: "HeaderCentered", label: "Centered", icon: <PanelsTopLeft size={20} /> },
      { type: "HeaderSplit", label: "Split", icon: <PanelsTopLeft size={20} /> },
    ]
  },
  {
    id: "grid",
    title: "Grid",
    icon: <Columns size={14} />,
    colorClass: "text-emerald-600",
    blocks: [
      { type: "LayoutHalf", label: "1/2 + 1/2", icon: <Columns size={20} /> },
      { type: "LayoutTwoCol", label: "1/3 + 2/3", icon: <Columns size={20} /> },
      { type: "LayoutThird", label: "1/3 x 3", icon: <Columns size={20} /> },
    ]
  },
  {
    id: "headings",
    title: "Headings",
    icon: <Type size={14} />,
    colorClass: "text-blue-600",
    blocks: [
      { type: "Heading", label: "Main Heading", icon: <Type size={20} />, defaultProps: { text: "Ray Tomlinson", align: "center", fontSize: 28 } },
    ]
  },
  {
    id: "text",
    title: "Text",
    icon: <Type size={14} />,
    colorClass: "text-blue-600",
    blocks: [
      { type: "Text", label: "Paragraph", icon: <Type size={20} />, defaultProps: { text: "A simple paragraph", fontSize: 16 } },
      { type: "CodeInline", label: "Inline Snippet", icon: <div className="w-5 h-5 rounded bg-gray-100 border border-gray-200 flex items-center justify-center text-[10px] font-mono">code</div>, defaultProps: { text: "react-email", bgColor: "#f3f4f6", color: "#3b82f6" } },
    ]
  },
  {
    id: "links",
    title: "Links",
    icon: <MousePointer size={14} />,
    colorClass: "text-cyan-600",
    blocks: [
      { type: "Link", label: "Text Link", icon: <MousePointer size={20} />, defaultProps: { text: "link", href: "https://example.com" } },
    ]
  },
  {
    id: "avatars",
    title: "Avatars",
    icon: <MousePointer size={14} />,
    colorClass: "text-orange-600",
    blocks: [
      { 
        type: "Avatar", 
        label: "Avatar", 
        icon: <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center text-white text-[10px] font-bold">ZF</div>, 
        defaultProps: { text: "Zeh Fernandes", title: "Founding Designer", imageUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&auto=format&fit=crop", paddingY: 16, align: "center", avatarShape: "circle", avatarSize: 48 } 
      },
    ]
  },
  {
    id: "images",
    title: "Images",
    icon: <ImageIcon size={14} />,
    colorClass: "text-emerald-600",
    blocks: [
      { type: "Img", label: "Standard Image", icon: <ImageIcon size={20} />, defaultProps: { imageUrl: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=1000&auto=format&fit=crop", imageWidth: 50 } },

      { type: "Banner", label: "Full Banner", icon: <div className="w-8 h-4 bg-gray-100 border border-gray-300 rounded" />, defaultProps: { imageUrl: "https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=1000&auto=format&fit=crop", imageWidth: 100, paddingY: 0 } },
    ]
  },
  {
    id: "buttons",
    title: "Buttons",
    icon: <MousePointer size={14} />,
    colorClass: "text-blue-600",
    blocks: [
      { type: "ButtonFull", label: "Primary", icon: <MousePointer size={20} />, defaultProps: { text: "Get started", href: "https://example.com" } },
      { type: "ButtonSplit", label: "Split", icon: <Columns size={20} />, defaultProps: { text: "Login", linkText: "Sign up", href: "", href2: "" } },
      { type: "ButtonAppStore", label: "App Store", icon: <ImageIcon size={20} />, defaultProps: { text: "Try now", title: "Download our app", href: "", href2: "" } },
    ]
  },
  {
    id: "feedback",
    title: "Feedback",
    icon: <Star size={14} />,
    colorClass: "text-rose-600",
    blocks: [
      { type: "FeedbackSurvey", label: "Survey", icon: <Star size={20} />, defaultProps: { text: "How satisfied were you?", title: "Your feedback matters" } },
      { type: "FeedbackSimple", label: "Rating", icon: <Star size={20} />, defaultProps: { text: "Your opinion matters", title: "We want to hear you" } },
      { type: "FeedbackReviews", label: "Reviews", icon: <Layout size={20} />, defaultProps: { text: "Customer Reviews" } },
    ]
  },
  {
    id: "lists",
    title: "Lists",
    icon: <List size={14} />,
    colorClass: "text-blue-600",
    blocks: [
      { type: "ListFeatures", label: "Steps", icon: <List size={20} />, defaultProps: { text: "How it Works" } },
    ]
  },
  {
    id: "dividers",
    title: "Dividers",
    icon: <Minus size={14} />,
    colorClass: "text-slate-600",
    blocks: [
      { type: "Hr", label: "Solid", icon: <Minus size={20} /> },
      { type: "Divider", label: "Dashed", icon: <Minus size={20} className="stroke-dasharray-4" /> },
    ]
  },

  {
    id: "footers",
    title: "Footers",
    icon: <CreditCard size={14} />,
    colorClass: "text-rose-600",
    blocks: [
      { type: "FooterCentered", label: "Centered", icon: <CreditCard size={20} /> },
      { type: "FooterSplit", label: "Split", icon: <CreditCard size={20} /> },
    ]
  }
];
