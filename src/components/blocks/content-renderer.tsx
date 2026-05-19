import { Text, Heading, Img, Link, Hr, Section, Row, Column, Tailwind } from "@react-email/components";
import type { BuilderItem } from "@/types/builder";
import React from "react";
import { cn } from "@/lib/utils";

export function renderContent(item: BuilderItem, onInlineClick?: (type: 'inline-link' | 'inline-snippet', value: string) => void, recipientName?: string) {
	const { props: p } = item;
	const padStyle = { padding: `${p.paddingY || 0}px ${p.paddingX || 0}px` };
	
	const commonStyles = {
		color: {
			primary: p.color || '#111827',
			secondary: '#4b5563',
			muted: '#6b7280',
			link: p.linkColor || '#3b82f6',
		},
		bg: {
			snippet: p.snippetBgColor || '#f3f4f6',
		}
	};

	const parseText = (text: string, p: any) => {
		if (!text) return "";
		
		const parts = text.split(/(`[^`]+`|\[[^\]]+\]\([^)]+\)|\{\{[^}]+\}\})/g);
		return parts.map((part, i) => {
			if (!part) return null;
			
			if (part.startsWith('{{') && part.endsWith('}}')) {
				const varName = part.slice(2, -2);
				if (recipientName && varName === 'name') return <span key={i}>{recipientName}</span>;

				return (
					<span 
						key={i}
						title={`Dynamic variable — replaced with recipient's ${varName} on send`}
						className="bg-blue-50/50 text-blue-600 px-1 rounded border border-blue-100 inline-block mx-[1px] select-none align-baseline"
						style={{ fontSize: 'inherit', fontWeight: 'inherit', fontFamily: 'inherit' }}
					>
						{`{{${varName}}}`}
					</span>
				);
			}

			if (part.startsWith('`') && part.endsWith('`')) {
				const codeContent = part.slice(1, -1);
				const codeParts = codeContent.split(/(\{\{[^}]+\}\})/g);

				return (
					<code 
						key={i} 
						onClick={(e) => {
							if (onInlineClick) {
								e.stopPropagation();
								onInlineClick('inline-snippet', part);
							}
						}}
						className={onInlineClick ? 'cursor-pointer' : ''}
						style={{ 
							backgroundColor: commonStyles.bg.snippet, 
							color: p.snippetColor || '#3b82f6',
							padding: '2px 6px',
							borderRadius: '4px',
							fontSize: '0.9em',
							fontWeight: 'bold',
							fontFamily: 'monospace',
							display: 'inline-block',
							lineHeight: '1',
							verticalAlign: 'baseline',
							margin: '0 2px'
						}}
					>
						{codeParts.map((cp, j) => {
							if (cp.startsWith('{{') && cp.endsWith('}}')) {
								const vn = cp.slice(2, -2);
								const display = (recipientName && vn === 'name') ? recipientName : vn;
								return <span key={j} className="text-[#059669] underline">{display}</span>;
							}
							return cp;
						})}
					</code>
				);
			}
			
			if (part.startsWith('[') && part.includes('](') && part.endsWith(')')) {
				const match = part.match(/\[([^\]]+)\]\(([^)]+)\)/);
				if (match) {
					const [_, linkText, href] = match;
					return (
						<Link 
							key={i} 
							href={href} 
							onClick={(e) => {
								if (onInlineClick) {
									e.preventDefault();
									e.stopPropagation();
									onInlineClick('inline-link', part);
								}
							}}
							style={{ color: commonStyles.color.link, textDecoration: 'underline' }}
						>
							{linkText}
						</Link>
					);
				}
			}
			
			return <span key={i}>{part}</span>;
		});
	};

	switch (item.type) {
		case "Heading":
			return (
				<Section style={padStyle}>
					<Heading
						as="h1"
						className={cn(
							"m-0",
							p.align === 'center' ? 'text-center' : p.align === 'right' ? 'text-right' : 'text-left'
						)}
						style={{ 
							fontSize: p.fontSize || 28,
							fontWeight: p.fontWeight || 'bold',
							color: commonStyles.color.primary
						}}
					>
						{parseText(p.text, p)}
					</Heading>
				</Section>
			);
		case "Text":
			return (
				<Section style={padStyle}>
					<Text
						className={cn(
							"m-0 leading-relaxed",
							p.align === 'center' ? 'text-center' : p.align === 'right' ? 'text-right' : 'text-left'
						)}
						style={{ 
							fontSize: p.fontSize || 16,
							color: p.color || commonStyles.color.secondary
						}}
					>
						{parseText(p.text, p)}
					</Text>
				</Section>
			);
		case "Link":
			return (
				<Section style={{ ...padStyle, textAlign: (p.align || 'left') as any }}>
					<Link
						href={p.href}
						className="underline"
						style={{ 
							fontSize: p.fontSize || 16,
							color: p.color || commonStyles.color.link
						}}
					>
						{p.text}
					</Link>
				</Section>
			);
		case "Img":
			return (
				<Section style={padStyle}>
					<Img
						src={p.imageUrl}
						alt={p.text || "Image"}
						width="100%"
						className="block h-auto"
						style={{ 
							width: `${p.imageWidth || 100}%`,
							margin: p.align === 'center' ? '0 auto' : p.align === 'right' ? '0 0 0 auto' : '0 auto 0 0',
							borderRadius: p.borderRadius || 0
						}}
					/>
				</Section>
			);
		case "Banner":
			return (
				<Section className="w-full bg-[#f3f4f6]">
					<Img
						src={p.imageUrl || "data:image/svg+xml;charset=utf-8,%3Csvg%20width%3D'800'%20height%3D'240'%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%3E%3Crect%20width%3D'100%25'%20height%3D'100%25'%20fill%3D'%23f3f4f6'%2F%3E%3Ctext%20x%3D'50%25'%20y%3D'50%25'%20dominant-baseline%3D'middle'%20text-anchor%3D'middle'%20font-family%3D'sans-serif'%20font-size%3D'20'%20fill%3D'%239ca3af'%3EBanner%20Image%20Area%3C%2Ftext%3E%3C%2Fsvg%3E"}
						width="100%"
						height="240"
						alt="Banner"
						className="block w-full h-[240px] object-cover"
					/>
				</Section>
			);
		case "Avatar": {
			const size = p.avatarSize || 48;
			const radius = p.avatarShape === 'square' ? '8px' : '9999px';
			const align = p.align || 'left';
			
			const AvatarImg = p.imageUrl ? (
				<td style={{ verticalAlign: 'middle', width: size, padding: align === 'right' ? '0 0 0 12px' : '0 12px 0 0' }}>
					<Img src={p.imageUrl} width={size} height={size} style={{ display: 'block', borderRadius: radius, objectFit: 'cover' }} />
				</td>
			) : null;

			const AvatarInfo = (
				<td style={{ verticalAlign: 'middle', textAlign: align as any }}>
					<div style={{ fontSize: `${p.nameFontSize || 15}px`, fontWeight: 'bold', color: commonStyles.color.primary, lineHeight: '1.2' }}>{p.text}</div>
					<div style={{ fontSize: '13px', color: commonStyles.color.muted, lineHeight: '1.2', marginTop: '2px' }}>{p.title}</div>
				</td>
			);

			return (
				<Section style={padStyle}>
					<Tailwind>
						<Row style={{ width: '100%' }}>
							<Column align={align as any}>
								<table cellPadding="0" cellSpacing="0" border={0} style={{ margin: align === 'center' ? '0 auto' : align === 'right' ? '0 0 0 auto' : '0 auto 0 0' }}>
									<tbody>
										<tr>
											{align === 'right' ? (
												<>{AvatarInfo}{AvatarImg}</>
											) : align === 'center' ? (
												<td style={{ textAlign: 'center' }}>
													{p.imageUrl && <Img src={p.imageUrl} width={size} height={size} style={{ display: 'block', borderRadius: radius, margin: '0 auto 8px', objectFit: 'cover' }} />}
													<div style={{ fontSize: `${p.nameFontSize || 15}px`, fontWeight: 'bold', color: commonStyles.color.primary, lineHeight: '1.2' }}>{p.text}</div>
													<div style={{ fontSize: '13px', color: commonStyles.color.muted, lineHeight: '1.2', marginTop: '2px' }}>{p.title}</div>
												</td>
											) : (
												<>{AvatarImg}{AvatarInfo}</>
											)}
										</tr>
									</tbody>
								</table>
							</Column>
						</Row>
					</Tailwind>
				</Section>
			);
		}
		case "AvatarGroup":
			return (
				<Section style={padStyle}>
					<Tailwind>
						<Row style={{ width: '100%', maxWidth: '400px', margin: '0 auto' }}>
							{(p.listItems || []).map((item, idx) => (
								<Column key={idx} align="center">
									<Img 
										src={p.imageUrl || "https://github.com/zenorocha.png?size=100"} 
										alt={item.title}
										width={item.number} 
										height={item.number} 
										style={{ 
											width: `${item.number}px`, height: `${item.number}px`,
											display: 'block', borderRadius: p.avatarShape === 'square' ? '8px' : '9999px',
											margin: '0 auto', objectFit: 'cover'
										}}
									/>
								</Column>
							))}
						</Row>
					</Tailwind>
				</Section>
			);
		case "Variable":
			return (
				<Section style={{ ...padStyle, textAlign: (p.align || 'left') as any }}>
					{parseText(p.text, p)}
				</Section>
			);
		case "CodeInline":
			return (
				<Section style={{ ...padStyle, textAlign: (p.align || 'left') as any }}>
					<div 
						className="inline-block px-2 py-1 rounded-md font-mono font-bold"
						style={{ 
							backgroundColor: p.bgColor || commonStyles.bg.snippet, 
							color: p.color || '#3b82f6',
							fontSize: p.fontSize || 14
						}}
					>
						{p.text}
					</div>
				</Section>
			);
		case "Hr":
		case "Divider":
			return (
				<Section style={padStyle}>
					<Hr 
						style={{ 
							borderTop: `${p.thickness || 1}px ${item.type === 'Divider' ? 'dashed' : 'solid'} ${p.color || '#d1d5db'}`,
							width: '100%',
							margin: '0',
						}} 
					/>
				</Section>
			);
		default:
			return null;
	}
}
