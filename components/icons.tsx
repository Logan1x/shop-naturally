"use client";
import React from "react";

const LogoIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    width="25"
    height="25"
    viewBox="0 0 25 25"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <rect width="25" height="25" rx="12.5" fill="black" />
    <g clipPath="url(#clip0_28_16)">
      <path
        d="M18.2743 8.02427L17.4743 7.22427C17.4039 7.15321 17.3202 7.09681 17.228 7.05831C17.1357 7.01982 17.0367 7 16.9368 7C16.8368 7 16.7378 7.01982 16.6456 7.05831C16.5533 7.09681 16.4696 7.15321 16.3993 7.22427L6.22427 17.3993C6.15321 17.4696 6.09681 17.5533 6.05831 17.6456C6.01982 17.7378 6 17.8368 6 17.9368C6 18.0367 6.01982 18.1357 6.05831 18.228C6.09681 18.3202 6.15321 18.4039 6.22427 18.4743L7.02427 19.2743C7.09415 19.3461 7.17772 19.4032 7.27004 19.4421C7.36236 19.4811 7.46156 19.5012 7.56177 19.5012C7.66197 19.5012 7.76117 19.4811 7.85349 19.4421C7.94581 19.4032 8.02938 19.3461 8.09927 19.2743L18.2743 9.09927C18.3461 9.02938 18.4032 8.94581 18.4421 8.85349C18.4811 8.76117 18.5012 8.66197 18.5012 8.56177C18.5012 8.46156 18.4811 8.36236 18.4421 8.27004C18.4032 8.17772 18.3461 8.09415 18.2743 8.02427Z"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.625 15.125L10 16.5"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M8.125 8.75V11.25"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M16.875 13.75V16.25"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11.25 6.25V7.5"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M9.375 10H6.875"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M18.125 15H15.625"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M11.875 6.875H10.625"
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
    <defs>
      <clipPath id="clip0_28_16">
        <rect width="15" height="15" fill="white" transform="translate(5 5)" />
      </clipPath>
    </defs>
  </svg>
);

const WandSparklesIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={props.width || 48}
    height={props.height || 48}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`lucide lucide-wand-sparkles-icon lucide-wand-sparkles ${
      props.className || ""
    }`}
    {...props}
  >
    <path d="m21.64 3.64-1.28-1.28a1.21 1.21 0 0 0-1.72 0L2.36 18.64a1.21 1.21 0 0 0 0 1.72l1.28 1.28a1.2 1.2 0 0 0 1.72 0L21.64 5.36a1.2 1.2 0 0 0 0-1.72" />
    <path d="m14 7 3 3" />
    <path d="M5 6v4" className="sparkle" />
    <path d="M19 14v4" className="sparkle" />
    <path d="M10 2v2" className="sparkle" />
    <path d="M7 8H3" className="sparkle" />
    <path d="M21 16h-4" className="sparkle" />
    <path d="M11 3H9" className="sparkle" />
  </svg>
);

export { LogoIcon, WandSparklesIcon };
