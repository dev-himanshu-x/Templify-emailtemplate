import type { ItemType, BuilderItemProps } from "@/types/builder";

export const defaultPropsForType = (type: ItemType): BuilderItemProps => {
	const base: BuilderItemProps = {
		text: "",
		fontSize: 16,
		fontWeight: "normal",
		color: "#111827",
		bgColor: "transparent",
		align: "left",
		href: "",
		href2: "",
		linkText: "",
		title: "",
		emoji: "",
		borderRadius: 0,
		paddingX: 20,
		paddingY: 12,
	};

	switch (type) {
		case "Heading":
			return {
				...base,
				text: "The Future of Email Design",
				fontSize: 24,
				fontWeight: "bold",
				align: "center",
				paddingY: 40,
			};
		case "Text":
			return {
				...base,
				text: "Elevate your communication with stunning, high-fidelity email templates designed for modern audiences.",
				fontSize: 14,
				paddingY: 20,
			};
		case "Link":
			return {
				...base,
				text: "link",
				href: "https://example.com",
				color: "#2563eb",
			};
		case "ButtonFull":
			return { ...base, text: "Get started", href: "https://example.com", bgColor: "#3b82f6", color: "#ffffff", borderRadius: 8, paddingX: 25, paddingY: 12, fontSize: 16 };
		case "ButtonSplit":
			return { ...base, text: "Login", linkText: "Sign up", href: "https://example.com", href2: "https://example.com", bgColor: "#3b82f6", color: "#ffffff", bgColor2: "#ffffff", color2: "#111827", borderRadius: 8, paddingX: 25, paddingY: 12, fontSize: 16 };
		case "ButtonAppStore":
			return { ...base, text: "Try now", title: "Download our app", href: "https://example.com", color: "#111827", paddingX: 25, paddingY: 12, fontSize: 16 };
		case "Img":
			return {
				...base,
				imageUrl: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?q=80&w=1000&auto=format&fit=crop",
				imageWidth: 100,
				align: "center",
				paddingY: 16,
				borderRadius: 0,
			};
		case "Banner":
			return {
				...base,
				imageUrl: "data:image/svg+xml;charset=utf-8,%3Csvg%20width%3D'800'%20height%3D'240'%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%3E%3Crect%20width%3D'100%25'%20height%3D'100%25'%20fill%3D'%23f3f4f6'%2F%3E%3Ctext%20x%3D'50%25'%20y%3D'50%25'%20dominant-baseline%3D'middle'%20text-anchor%3D'middle'%20font-family%3D'sans-serif'%20font-size%3D'20'%20fill%3D'%239ca3af'%3EBanner%20Image%20Area%3C%2Ftext%3E%3C%2Fsvg%3E",
				imageWidth: 100,
				paddingY: 0,
				borderRadius: 0,
			};
		case "Hr":
		case "Divider":
			return { ...base, color: "#d1d5db", thickness: 1, width: 100, paddingY: 24 };
		case "LayoutSection":
			return { ...base, text: "Hello my section!", paddingY: 16 };
		case "ListFeatures":
			return {
				...base,
				text: "How Our Service Works: Simple Steps",
				titleFontSize: 22,
				descriptionFontSize: 16,
				titleColor: "#111827",
				descriptionColor: "#6b7280",
				bgColor: "#000000",
				listItems: [
					{ number: 1, title: 'Start Your Search', description: 'Search for the products you need or upload your list of requirements.', imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop' },
					{ number: 2, title: 'Compare & Save', description: 'Compare prices and offers from different suppliers to find the best deals.', imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop' },
				]
			};
		case "LayoutTwoCol":
		case "LayoutHalf":
		case "LayoutThird":
			return { ...base, paddingY: 16, paddingX: 0 };
		case "HeaderCentered":
		case "HeaderSplit":
			return {
				...base,
				imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop",
				paddingY: 48,
				align: "center",
				navLinks: [
					{ text: "About", href: "" },
					{ text: "Blog", href: "" },
					{ text: "Company", href: "" },
					{ text: "Features", href: "" },
				]
			};
		case "FeedbackSurvey":
			return { 
				...base, 
				text: "How satisfied were you overall with the initial conversation about your claim?", 
				title: "Your feedback is important to us and it will be used to better serve our customers.",
				paddingY: 24 
			};
		case "FeedbackSimple":
			return {
				...base,
				text: "Your opinion matters",
				title: "We want to hear you",
				linkText: "How would you rate your experience using our product in a scale from 1 to 5?",
				paddingY: 24
			};
		case "FeedbackReviews":
			return {
				...base,
				text: "Customer Reviews",
				title: "Share your thoughts",
				linkText: "If you’ve used this product, share your thoughts with other customers",
				paddingY: 24,
				listItems: [
					{ number: 5, title: '1019', description: '' },
					{ number: 4, title: '162', description: '' },
					{ number: 3, title: '97', description: '' },
					{ number: 2, title: '199', description: '' },
					{ number: 1, title: '147', description: '' },
				]
			};
		case "CodeInline":
			return { 
				...base, 
				text: "react-email", 
				bgColor: "#f3f4f6",
				color: "#3b82f6",
				align: "left" 
			};
		case "Avatar":
			return { 
				...base, 
				imageUrl: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=1000&auto=format&fit=crop", 
				text: "Zeh Fernandes", 
				title: "Founding Designer", 
				href: "https://example.com", 
				align: "center",
				avatarSize: 48
			};
		case "AvatarGroup":
			return { 
				...base, 
				imageUrl: "https://github.com/zenorocha.png?size=100",
				listItems: [
					{ number: 30, title: 'Zeno', description: '' },
					{ number: 42, title: 'Zeno', description: '' },
					{ number: 54, title: 'Zeno', description: '' },
					{ number: 66, title: 'Zeno', description: '' },
				],
				align: "center",
				paddingY: 20
			};
		case "FooterCentered":
		case "FooterSplit":
			return {
				...base,
				imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=1000&auto=format&fit=crop",
				paddingY: 48,
				align: "center",
				text: "Acme corporation",
				title: "Think different",
				linkText: "123 Main Street Anytown, CA 12345",
				href: "mail@example.com",
				socialLinks: [
					{ alt: "Facebook", imageUrl: "https://img.icons8.com/color/48/000000/facebook-new.png" },
					{ alt: "X", imageUrl: "https://img.icons8.com/color/48/000000/twitter--v1.png" },
					{ alt: "Instagram", imageUrl: "https://img.icons8.com/color/48/000000/instagram-new.png" },
				]
			};
		default:
			return base;
	}
};
