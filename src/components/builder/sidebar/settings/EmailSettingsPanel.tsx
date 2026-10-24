import { Mail, Moon, Palette } from "lucide-react";
import { FONT_STACKS } from "@/config/email-settings";
import { useBuilder } from "@/context/builder-context";
import { ColorInput, SettingField, SettingGroup, SettingInput, SettingRange } from "./shared/SettingComponents";

export function EmailSettingsPanel() {
	const { settings, updateSettings } = useBuilder();

	return (
		<div className="p-5 space-y-8 overflow-y-auto h-full">
			<div>
				<h3 className="text-sm font-bold text-gray-900">Email settings</h3>
				<p className="text-xs text-gray-400 mt-1 leading-relaxed">Applies to the whole email. Select a block on the canvas to edit it instead.</p>
			</div>

			<SettingGroup title="Message" icon={<Mail size={12} className="text-blue-500" />}>
				<SettingInput
					label={`Subject line (${settings.subject.length})`}
					type="text"
					placeholder="What's the email about?"
					value={settings.subject}
					onChange={(e) => updateSettings({ subject: e.target.value })}
				/>
				<SettingInput
					label={`Preheader (${settings.preheader.length})`}
					type="text"
					placeholder="Short preview shown next to the subject"
					value={settings.preheader}
					onChange={(e) => updateSettings({ preheader: e.target.value })}
				/>
			</SettingGroup>

			<SettingGroup title="Global styles" icon={<Palette size={12} className="text-purple-500" />}>
				<SettingField label="Page background">
					<ColorInput value={settings.pageBgColor} onChange={(v) => updateSettings({ pageBgColor: v })} />
				</SettingField>
				<SettingField label="Email background">
					<ColorInput value={settings.containerBgColor} onChange={(v) => updateSettings({ containerBgColor: v })} />
				</SettingField>
				<SettingRange label="Email width" value={settings.maxWidth} min={480} max={720} step={10} onChange={(v) => updateSettings({ maxWidth: Number.isNaN(v) ? 600 : v })} />
				<SettingField label="Font">
					<select
						value={settings.fontFamily}
						onChange={(e) => updateSettings({ fontFamily: e.target.value })}
						className="w-full bg-gray-50 border border-gray-100 rounded-lg p-2.5 text-xs text-gray-900 focus:outline-none shadow-inner"
					>
						{Object.entries(FONT_STACKS).map(([key, { label }]) => (
							<option key={key} value={key}>{label}</option>
						))}
					</select>
				</SettingField>
			</SettingGroup>

			<SettingGroup title="Dark mode" icon={<Moon size={12} className="text-indigo-500" />}>
				<label className="flex items-start gap-2 text-xs text-gray-700 cursor-pointer px-1">
					<input type="checkbox" checked={settings.darkMode} onChange={(e) => updateSettings({ darkMode: e.target.checked })} className="mt-0.5 accent-blue-600" />
					<span>
						Ship dark-mode colours
						<span className="block text-[11px] text-gray-400">Off keeps the email light in every client. On switches paragraphs and headings to the colour below, so check your own text and button colours too.</span>
					</span>
				</label>
				{settings.darkMode && (
					<>
						<SettingField label="Page background (dark)">
							<ColorInput value={settings.darkPageBgColor} onChange={(v) => updateSettings({ darkPageBgColor: v })} />
						</SettingField>
						<SettingField label="Email background (dark)">
							<ColorInput value={settings.darkContainerBgColor} onChange={(v) => updateSettings({ darkContainerBgColor: v })} />
						</SettingField>
						<SettingField label="Text colour (dark)">
							<ColorInput value={settings.darkTextColor} onChange={(v) => updateSettings({ darkTextColor: v })} />
						</SettingField>
						<p className="text-[11px] text-gray-400 px-1">Use the moon icon in the top bar to preview.</p>
					</>
				)}
			</SettingGroup>
		</div>
	);
}
