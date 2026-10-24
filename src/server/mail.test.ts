import { describe, expect, it } from "vitest";
import { allowRequest, isPublicHost, parseRecipients, personalize, recipientFirstName, resolveSender } from "./mail";

describe("parseRecipients", () => {
	it("parses plain and named addresses, dedupes and reports invalid ones", () => {
		const { recipients, invalid } = parseRecipients('a@x.com, "Jane Doe" <jane@x.com>;A@X.com\nnot-an-email');
		expect(recipients).toEqual([{ email: "a@x.com", name: undefined }, { email: "jane@x.com", name: "Jane Doe" }]);
		expect(invalid).toEqual(["not-an-email"]);
	});
});

describe("personalize", () => {
	it("fills and escapes the name variable", () => {
		expect(personalize("Hi {{name}} and [name]", "<b>Al</b>")).toBe("Hi &lt;b&gt;Al&lt;/b&gt; and &lt;b&gt;Al&lt;/b&gt;");
		expect(recipientFirstName({ email: "jane.doe@x.com" })).toBe("Jane");
		expect(recipientFirstName({ email: "a@x.com", name: "Sam Lee" })).toBe("Sam");
	});
});

describe("resolveSender", () => {
	it("fills in Gmail settings from the address", () => {
		const result = resolveSender({ email: "me@gmail.com", pass: "abcd", name: "Me" });
		expect(result).toMatchObject({ account: { host: "smtp.gmail.com", port: 465, secure: true, name: "Me" } });
	});
	it("uses STARTTLS on port 587 for Outlook", () => {
		expect(resolveSender({ email: "me@outlook.com", pass: "x" })).toMatchObject({ account: { port: 587, secure: false } });
	});
	it("asks for a host on unknown providers and rejects private hosts", () => {
		expect(resolveSender({ email: "me@corp.io", pass: "x" })).toHaveProperty("error");
		expect(resolveSender({ email: "me@corp.io", pass: "x", host: "localhost" })).toHaveProperty("error");
		expect(resolveSender({ email: "me@corp.io", pass: "x", host: "mail.corp.io", port: 2525 })).toMatchObject({ account: { host: "mail.corp.io", port: 2525 } });
	});
	it("requires an address and password", () => {
		expect(resolveSender({ email: "nope", pass: "x" })).toHaveProperty("error");
		expect(resolveSender({ email: "me@gmail.com" })).toHaveProperty("error");
		expect(isPublicHost("192.168.1.5")).toBe(false);
	});
});

describe("allowRequest", () => {
	it("limits requests per key within the window", () => {
		const t = 1_000_000;
		const results = Array.from({ length: 4 }, (_, i) => allowRequest("k1", 3, 60_000, t + i));
		expect(results).toEqual([true, true, true, false]);
		expect(allowRequest("k2", 3, 60_000, t)).toBe(true);
		expect(allowRequest("k1", 3, 60_000, t + 61_000)).toBe(true);
	});
});
