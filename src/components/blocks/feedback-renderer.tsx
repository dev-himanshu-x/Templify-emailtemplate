import { paddingCss } from "@/lib/padding";
import { Row, Column, Text, Heading, Button, Hr } from "@react-email/components";
import { PaddedSection as Section } from "./padded-section";
import type { BuilderItem } from "@/types/builder";

export function renderFeedback(item: BuilderItem) {
	const { props: p } = item;
	const pad = paddingCss(p, { y: 0, x: 0 }, { inheritX: false });
	
	switch (item.type) {
		case "FeedbackSurvey":
			return (
				<Section style={{ padding: pad }}>
					<Heading className="m-0 mb-4 text-[24px] leading-[32px] text-[#111827]">
						{p.text}
					</Heading>
					<Text className="m-0 mb-10 text-[14px] leading-[24px] text-[#6b7280]">
						{p.title}
					</Text>
					<Section className="max-w-[300px]">
						<Row>
							<Column align="left">
								<Text className="m-0 text-[12px] text-[#444444]">Dissatisfied</Text>
							</Column>
							<Column align="right">
								<Text className="m-0 text-[12px] text-[#444444]">Satisfied</Text>
							</Column>
						</Row>
					</Section>
					<Section className="mt-3 mb-6">
						<Row>
							{[1, 2, 3, 4, 5].map((num) => (
								<Column key={num} width="51" align="center" className="px-1">
									<Button
										href={`#rating=${num}`}
										className="w-[43px] h-[43px] bg-[#3b82f6] rounded-md text-white text-[16px] font-bold text-center leading-[43px] block"
									>
										{num}
									</Button>
								</Column>
							))}
						</Row>
					</Section>
					<Hr className="border-[#e5e7eb] my-6" />
					<Text className="text-center text-[#6b7280] text-[12px]">
						Customer Experience Research Team
					</Text>
				</Section>
			);
		case "FeedbackSimple":
			return (
				<Section className="text-center" style={{ padding: pad }}>
					<Text className="m-0 mb-2 font-semibold text-[18px] text-[#3b82f6] leading-[28px]">
						{p.text}
					</Text>
					<Heading className="m-0 mb-2 font-semibold text-[30px] text-[#111827] leading-[36px]">
						{p.title}
					</Heading>
					<Text className="m-0 mb-6 text-[16px] text-[#374151] leading-[24px]">
						{p.linkText}
					</Text>
					<Row className="w-auto mx-auto">
						{[1, 2, 3, 4, 5].map((num) => (
							<Column key={num} className="px-1">
								<Button
									href={`#rating=${num}`}
									className="w-[36px] h-[36px] border border-[#3b82f6] rounded-lg text-[#3b82f6] text-[14px] font-bold text-center leading-[36px] block"
								>
									{num}
								</Button>
							</Column>
						))}
					</Row>
				</Section>
			);
		case "FeedbackReviews":
			const total = 1624;
			return (
				<Section style={{ padding: pad }}>
					<Heading className="m-0 mb-3 text-[24px] leading-[32px] text-[#111827]">
						{p.text}
					</Heading>
					<Section className="my-6">
						{(p.listItems || []).map((li, i) => {
							const count = parseInt(li.title);
							const percent = Math.round((count / total) * 100);
							const barWidth = (count / total) * 264;
							return (
								<Row key={i} className="mb-3">
									<Column width="20">
										<Text className="m-0 text-[14px] text-[#6b7280] font-medium">{li.number}</Text>
									</Column>
									<Column className="pl-3" width="264">
										<Section className="w-[264px] h-3 bg-[#f3f4f6] rounded-md border border-[#e5e7eb] overflow-hidden">
											<Row>
												<Column width={barWidth} className="h-3 bg-[#3b82f6] rounded-md" style={{ width: barWidth }} />
												<Column />
											</Row>
										</Section>
									</Column>
									<Column className="pl-3" align="right">
										<Text className="m-0 text-[12px] text-[#6b7280] font-medium">{percent}%</Text>
									</Column>
								</Row>
							);
						})}
					</Section>
					<Text className="text-center text-[#6b7280] text-[12px] mb-6">
						Based on <Text className="font-bold inline">{total}</Text> Reviews
					</Text>
					<Hr className="border-[#e5e7eb] my-6" />
					<Heading className="m-0 mb-3 text-[18px] text-[#111827]">
						{p.title}
					</Heading>
					<Text className="m-0 mb-6 text-[14px] text-[#6b7280]">
						{p.linkText}
					</Text>
					<Button
						href="#"
						className="bg-[#3b82f6] rounded-lg text-white py-3 px-6 block text-center font-bold no-underline"
					>
						Write a review
					</Button>
				</Section>
			);
		default:
			return null;
	}
}
