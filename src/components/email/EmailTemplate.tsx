import React from "react";

import { 
  Html, 
  Head, 
  Body, 
  Container, 
  Tailwind,
  Preview
} from "@react-email/components";
import type { BuilderItem } from "@/types/builder";
import { renderBlock } from "@/components/blocks";
import { DEFAULT_EMAIL_SETTINGS, type EmailSettings, fontStack } from "@/config/email-settings";

interface EmailTemplateProps {
  items: BuilderItem[];
  settings?: EmailSettings;
}

export function EmailTemplate({ items, settings = DEFAULT_EMAIL_SETTINGS }: EmailTemplateProps) {
  const rootItems = items.filter(i => !i.parentId);
  const previewText = settings.preheader.trim() || items.find(i => i.type === 'Text')?.props.text || "New Email Template";

  // Dark mode: with it on, clients get the dark palette; with it off, the light colours are pinned so Gmail doesn't invert them.
  const dark = settings.darkMode
    ? { page: settings.darkPageBgColor, container: settings.darkContainerBgColor, text: settings.darkTextColor }
    : { page: settings.pageBgColor, container: settings.containerBgColor, text: null };
  const textSelectors = (prefix: string) => ['p', 'h1', 'h2', 'h3', 'h4', 'li'].map((t) => `${prefix}.email-container ${t}`).join(', ');
  const darkRules = `
            .email-body { background-color: ${dark.page} !important; }
            .email-container { background-color: ${dark.container} !important; }
            ${dark.text ? `${textSelectors('')} { color: ${dark.text} !important; }` : ''}`;
  const darkCss = `
          @media (prefers-color-scheme: dark) {${darkRules}
          }
          [data-ogsc] .email-body { background-color: ${dark.page} !important; }
          [data-ogsc] .email-container { background-color: ${dark.container} !important; }
          ${dark.text ? `${textSelectors('[data-ogsc] ')} { color: ${dark.text} !important; }` : ''}`;

  const renderItem = (item: BuilderItem): React.ReactNode => {
    return renderBlock(item, (colIndex) => {
      const children = items.filter(i => i.parentId === item.id && (i.colIndex === colIndex || (colIndex === 0 && i.colIndex === undefined)));
      if (children.length === 0) return null;

      // Blocks are full-width tables, so they stack on their own.
      return (
        <>
          {children.map(child => (
            <React.Fragment key={child.id}>{renderItem(child)}</React.Fragment>
          ))}
        </>
      );
    });
  };

  return (
    <Html lang="en" dir="ltr">
      <Head>
        <title>{settings.subject}</title>
        {/* Force light mode — prevents Gmail/Apple Mail dark mode inversion */}
        <meta name="color-scheme" content={settings.darkMode ? "light dark" : "light"} />
        <meta name="supported-color-schemes" content={settings.darkMode ? "light dark" : "light"} />
        <style>{`
          :root { color-scheme: ${settings.darkMode ? "light dark" : "light only"}; }
          * { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
          ${darkCss}
          @media (max-width: 480px) {
            .stack-col { display: block !important; width: 100% !important; padding-left: 0 !important; padding-right: 0 !important; padding-bottom: 12px !important; }
          }
        `}</style>
      </Head>
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body 
          className="email-body"
          style={{ 
            margin: 0, 
            padding: 0, 
            backgroundColor: settings.pageBgColor,
            fontFamily: fontStack(settings.fontFamily),
            WebkitTextSizeAdjust: '100%',
          }}
        >
          <Container 
            className="email-container"
            style={{ 
              margin: '0 auto', 
              maxWidth: `${settings.maxWidth}px`, 
              backgroundColor: settings.containerBgColor,
              width: '100%',
            }}
          >
            {rootItems.map(item => (
              <React.Fragment key={item.id}>
                {renderItem(item)}
              </React.Fragment>
            ))}
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}
