import React from "react";
import { Section, Button, Row, Column, Text, Img, Link, Tailwind } from "@react-email/components";
import type { BuilderItem } from "@/types/builder";
import { cn } from "@/lib/utils";

export function renderButton(item: BuilderItem) {
	const { props: p } = item;
	const pad = `${p.paddingY || 12}px 0`;
	const innerPadding = `${p.paddingY || 14}px ${p.paddingX || 32}px`;
	const fontSize = p.fontSize || 16;
	const align = (p.align || 'center') as any;

	const buttonStyle = (isSecond = false): React.CSSProperties => {
		const bg = isSecond ? (p.bgColor2 || '#ffffff') : (p.bgColor || '#3b82f6');
		const clr = isSecond ? (p.color2 || '#111827') : (p.color || '#ffffff');
		
		return {
			backgroundColor: bg,
			color: clr,
			border: isSecond && !p.bgColor2 ? '1px solid #e5e7eb' : 'none',
			borderRadius: p.borderRadius || 8,
			padding: innerPadding,
			fontSize: fontSize,
		};
	};
	const buttonClassName = "inline-block text-center font-bold no-underline leading-none max-w-full";

	switch (item.type) {
		case "ButtonFull":
			return (
				<Tailwind>
					<Section style={{ padding: pad }}>
						<Row>
							<Column align={align}>
								{p.href ? (
									<Button href={p.href} style={buttonStyle()} className={buttonClassName}>
										{p.text}
									</Button>
								) : (
									<span style={buttonStyle()} className={buttonClassName}>{p.text}</span>
								)}
							</Column>
						</Row>
					</Section>
				</Tailwind>
			);
		case "ButtonSplit":
			return (
				<Tailwind>
					<Section style={{ padding: pad }}>
						<Row className={cn("w-auto", align === 'center' ? 'mx-auto' : align === 'right' ? 'ml-auto' : 'mr-auto')}>
							<Column className="pr-2">
								{p.href ? (
									<Button href={p.href} style={buttonStyle()} className={buttonClassName}>
										{p.text}
									</Button>
								) : (
									<span style={buttonStyle()} className={buttonClassName}>{p.text}</span>
								)}
							</Column>
							<Column className="pl-2">
								{p.href2 ? (
									<Button href={p.href2} style={buttonStyle(true)} className={buttonClassName}>
										{p.linkText}
									</Button>
								) : (
									<span style={buttonStyle(true)} className={buttonClassName}>{p.linkText}</span>
								)}
							</Column>
						</Row>
					</Section>
				</Tailwind>
			);
		case "ButtonAppStore":
			const appStoreBadge = "https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg";
			const googlePlayBadge = "https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg";

			return (
				<Tailwind>
					<Section className="text-center py-8">
						<Section className="mb-6">
							<Text 
								className="m-0 mb-2 font-bold text-[24px] tracking-tight" 
								style={{ color: p.color || '#111827' }}
							>
								{p.text}
							</Text>
							<Text className="m-0 text-gray-500 text-[16px]">
								{p.title}
							</Text>
						</Section>
						<Row className="w-auto mx-auto">
							<Column className="pr-2.5 align-middle">
								<Link href={p.href || "#"}>
									<Img 
										src={appStoreBadge} 
										height="40" 
										className="block h-10"
										alt="Download on the App Store" 
									/>
								</Link>
							</Column>
							<Column className="pl-2.5 align-middle">
								<Link href={p.href2 || "#"}>
									<Img 
										src={googlePlayBadge} 
										height="40" 
										className="block h-10"
										alt="Get it on Google Play" 
									/>
								</Link>
							</Column>
						</Row>
					</Section>
				</Tailwind>
			);
		default:
			return null;
	}
}
