import React from "react";

import { 
  Html, 
  Head, 
  Body, 
  Container, 
  Tailwind,
  Preview,
  Row,
  Column
} from "@react-email/components";
import type { BuilderItem } from "@/types/builder";
import { renderBlock } from "@/components/blocks";

interface EmailTemplateProps {
  items: BuilderItem[];
}

export function EmailTemplate({ items }: EmailTemplateProps) {
  const rootItems = items.filter(i => !i.parentId);
  const previewText = items.find(i => i.type === 'Text')?.props.text || "New Email Template";

  const renderItem = (item: BuilderItem): React.ReactNode => {
    return renderBlock(item, (colIndex) => {
      const children = items.filter(i => i.parentId === item.id && (i.colIndex === colIndex || (colIndex === 0 && i.colIndex === undefined)));
      if (children.length === 0) return null;

      return (
        <Row>
          {children.map(child => (
            <Column key={child.id} style={{ verticalAlign: 'top' }}>
              {renderItem(child)}
            </Column>
          ))}
        </Row>
      );
    });
  };

  return (
    <Html lang="en" dir="ltr">
      <Head>
        {/* Force light mode — prevents Gmail/Apple Mail dark mode inversion */}
        <meta name="color-scheme" content="light" />
        <meta name="supported-color-schemes" content="light" />
        <style>{`
          :root { color-scheme: light only; }
          * { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
          /* Override Gmail dark mode */
          @media (prefers-color-scheme: dark) {
            .email-body { background-color: #f4f4f7 !important; }
            .email-container { background-color: #ffffff !important; }
          }
          [data-ogsc] .email-body { background-color: #f4f4f7 !important; }
          [data-ogsc] .email-container { background-color: #ffffff !important; }
        `}</style>
      </Head>
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body 
          className="email-body"
          style={{ 
            margin: 0, 
            padding: 0, 
            backgroundColor: '#f4f4f7',
            WebkitTextSizeAdjust: '100%',
            msTextSizeAdjust: '100%',
          }}
        >
          <Container 
            className="email-container"
            style={{ 
              margin: '0 auto', 
              maxWidth: '600px', 
              backgroundColor: '#ffffff',
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
