import { Section, Row, Column, Img, Link, Text, Tailwind } from "@react-email/components";
import type { BuilderItem } from "@/types/builder";

export function renderHeaderFooter(item: BuilderItem) {
	const { props: p } = item;
	const pad = `${p.paddingY || 16}px ${p.paddingX || 32}px`;
	switch (item.type) {
		case "HeaderCentered":
			return (
				<Tailwind>
					<Section className="text-center" style={{ padding: pad }}>
						{p.imageUrl && (
							<div className="mx-auto mb-4 inline-block">
								{p.href ? (
									<Link href={p.href}>
										<Img 
											src={p.imageUrl} 
											width="100%"
											className="h-auto block w-full rounded-none"
											style={{ 
												maxWidth: p.imageWidth ? `${p.imageWidth}px` : '120px',
											}} 
										/>
									</Link>
								) : (
									<Img 
										src={p.imageUrl} 
										width="100%"
										className="h-auto block w-full rounded-none"
										style={{ 
											maxWidth: p.imageWidth ? `${p.imageWidth}px` : '120px',
										}} 
									/>
								)}
							</div>
						)}
						<Row className="w-auto mx-auto">
							{(p.navLinks || []).map((link, i) => (
								<Column key={i} className="px-2">
									<Link href={link.href} className="text-[12px] font-medium text-gray-600 no-underline">
										{link.text}
									</Link>
								</Column>
							))}
						</Row>
					</Section>
				</Tailwind>
			);
		case "HeaderSplit":
			return (
				<Tailwind>
					<Section style={{ padding: pad }}>
						<Row className="align-middle">
							<Column align="left" className="align-middle">
								{p.imageUrl && (
									<div className="inline-block">
										{p.href ? (
											<Link href={p.href} className="block">
												<Img 
													src={p.imageUrl} 
													width="100%"
													className="h-auto block w-full rounded-none"
													style={{ 
														maxWidth: p.imageWidth ? `${p.imageWidth}px` : '120px',
													}} 
												/>
											</Link>
										) : (
											<Img 
												src={p.imageUrl} 
												width="100%"
												className="h-auto block w-full rounded-none"
												style={{ 
													maxWidth: p.imageWidth ? `${p.imageWidth}px` : '120px',
												}} 
											/>
										)}
									</div>
								)}
							</Column>
							<Column align="right" className="align-middle">
								<Row className="w-auto ml-auto align-middle">
									{(p.navLinks || []).map((link, i) => (
										<Column key={i} className="pl-4 align-middle">
											<Link href={link.href} className="text-[12px] font-medium text-gray-600 no-underline block">
												{link.text}
											</Link>
										</Column>
									))}
								</Row>
							</Column>
						</Row>
					</Section>
				</Tailwind>
			);
		case "HeaderSocial":
			return (
				<Tailwind>
					<Section style={{ padding: pad }}>
						<Row>
							<Column align="left">
								{p.imageUrl && (
									<Img 
										src={p.imageUrl} 
										width={p.imageWidth || 36}
										className="h-auto block"
										style={{ width: p.imageWidth ? `${p.imageWidth}px` : '36px' }} 
									/>
								)}
							</Column>
							<Column align="right">
								<Row className="w-auto ml-auto">
									{(p.socialLinks || []).map((social, i) => (
										<Column key={i} className="pl-2">
											<Link href={social.href}>
												<Img src={social.imageUrl} width="24" height="24" alt={social.alt} className="opacity-60" />
											</Link>
										</Column>
									))}
								</Row>
							</Column>
						</Row>
					</Section>
				</Tailwind>
			);
		case "FooterCentered":
			return (
				<Tailwind>
					<Section className="text-center border-t border-[#e5e7eb] pt-8">
						<table className="w-full">
							<tbody>
								{p.imageUrl && (
									<tr className="w-full">
										<td align="center">
											<Img
												alt="Logo"
												src={p.imageUrl}
												width={p.imageWidth || 42}
												className="h-auto max-w-full"
												style={{ width: p.imageWidth ? `${p.imageWidth}px` : '42px' }}
											/>
										</td>
									</tr>
								)}
								<tr className="w-full">
									<td align="center">
											<Text className="my-[8px] font-semibold leading-[24px]" style={{ color: p.textColor || '#111827', fontSize: p.fontSize || 16 }}>
												{p.text}
											</Text>
											<Text className="mt-[4px] mb-0 leading-[24px]" style={{ color: p.taglineColor || '#6b7280', fontSize: p.titleFontSize || 14 }}>
												{p.title}
											</Text>
									</td>
								</tr>
								<tr>
									<td align="center">
										<Row className="table-cell align-bottom">
											{(p.socialLinks || []).map((s, i) => (
												<Column key={i} className="pr-[8px]">
													<Link href={s.href}>
														<Img
															alt={s.alt}
															height="36"
															src={s.imageUrl}
															width="36"
														/>
													</Link>
												</Column>
											))}
										</Row>
									</td>
								</tr>
								<tr>
									<td align="center">
											<Text className="my-[8px] font-semibold leading-[24px]" style={{ color: p.addressColor || '#6b7280', fontSize: p.addressFontSize || 12 }}>
												{p.linkText}
											</Text>
											<Text className="mt-[4px] mb-0 font-semibold leading-[24px]" style={{ color: p.contactColor || '#6b7280', fontSize: p.contactFontSize || 12 }}>
												<Link href={p.href?.includes('@') ? `mailto:${p.href}` : (p.href || '#')} className="no-underline" style={{ color: p.contactColor || '#6b7280' }}>
													{p.href}
												</Link>
											</Text>
									</td>
								</tr>
							</tbody>
						</table>
					</Section>
				</Tailwind>
			);
		case "FooterSplit":
			return (
				<Tailwind>
					<Section style={{ padding: pad }}>
						<Row>
							<Column align="left" className="align-bottom">
								{p.imageUrl && (
									<Img 
										src={p.imageUrl} 
										width={p.imageWidth || 32} 
										className="h-auto mb-3"
										style={{ width: p.imageWidth ? `${p.imageWidth}px` : '32px' }} 
									/>
								)}
								<Text className="m-0 mb-1 font-bold" style={{ color: p.textColor || '#111827', fontSize: p.fontSize || 14 }}>{p.text}</Text>
								<Text className="m-0" style={{ color: p.taglineColor || '#6b7280', fontSize: p.titleFontSize || 12 }}>{p.title}</Text>
							</Column>
							<Column align="right" className="align-bottom">
								<Row className="w-auto ml-auto mb-3">
									{(p.socialLinks || []).map((s, i) => (
										<Column key={i} className="pl-2">
											<Link href={s.href}>
												<Img src={s.imageUrl} width="36" height="36" />
											</Link>
										</Column>
									))}
								</Row>
								<Text className="m-0 mb-1" style={{ color: p.addressColor || '#9ca3af', fontSize: p.addressFontSize || 11 }}>{p.linkText}</Text>
								<Text className="m-0" style={{ color: p.contactColor || '#9ca3af', fontSize: p.contactFontSize || 11 }}>
									<Link href={p.href?.includes('@') ? `mailto:${p.href}` : (p.href || '#')} className="no-underline" style={{ color: p.contactColor || '#9ca3af' }}>
										{p.href}
									</Link>
								</Text>
							</Column>
						</Row>
					</Section>
				</Tailwind>
			);
		default:
			return null;
	}
}
