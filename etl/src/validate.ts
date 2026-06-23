import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { CountryData } from '@tax/schema';

type ValidationIssue = {
	file: string;
	path: string;
	message: string;
};

function fiscalStartYear(fiscalYear: string): number {
	return Number(fiscalYear.split('-')[0]);
}

function validateYearOrder(file: string, years: { fiscalYear: string }[]): ValidationIssue[] {
	const issues: ValidationIssue[] = [];

	for (let i = 1; i < years.length; i += 1) {
		const currentYear = years[i];
		const previousYear = years[i - 1];
		if (!currentYear || !previousYear) {
			continue;
		}

		const currentStart = fiscalStartYear(currentYear.fiscalYear);
		const prevStart = fiscalStartYear(previousYear.fiscalYear);

		if (currentStart >= prevStart) {
			issues.push({
				file,
				path: `years[${i}].fiscalYear`,
				message: 'years[] must be ordered newest-first',
			});
		}
	}

	return issues;
}

function validateDefaultRegimes(
	file: string,
	years: { defaultRegime: string; regimes: { id: string }[] }[],
): ValidationIssue[] {
	const issues: ValidationIssue[] = [];

	years.forEach((year, index) => {
		const hasMatch = year.regimes.some((regime) => regime.id === year.defaultRegime);
		if (!hasMatch) {
			issues.push({
				file,
				path: `years[${index}].defaultRegime`,
				message: 'defaultRegime must match a regime id in regimes[]',
			});
		}
	});

	return issues;
}

function formatZodPath(pathParts: PropertyKey[]): string {
	if (pathParts.length === 0) {
		return '$';
	}

	return pathParts
		.map((part) => {
			if (typeof part === 'number') {
				return `[${part}]`;
			}
			if (typeof part === 'symbol') {
				return part.toString();
			}
			return part;
		})
		.join('.');
}

export async function validateFile(filePath: string): Promise<ValidationIssue[]> {
	const file = path.basename(filePath);
	const text = await readFile(filePath, 'utf8');
	const json = JSON.parse(text) as unknown;

	const parsed = CountryData.safeParse(json);
	if (!parsed.success) {
		return parsed.error.issues.map((issue) => ({
			file,
			path: formatZodPath(issue.path),
			message: issue.message,
		}));
	}

	const data = parsed.data;
	return [...validateDefaultRegimes(file, data.years), ...validateYearOrder(file, data.years)];
}

export async function runValidation(dataDir: string): Promise<ValidationIssue[]> {
	const files = ['pakistan.json', 'india.json'];
	const issueLists = await Promise.all(files.map((name) => validateFile(path.join(dataDir, name))));
	return issueLists.flat();
}

async function main(): Promise<void> {
	const cwd = process.cwd();
	const dataDir = path.resolve(cwd, '..', 'data');
	const issues = await runValidation(dataDir);

	if (issues.length > 0) {
		issues.forEach((issue) => {
			console.error(`${issue.file}:${issue.path} - ${issue.message}`);
		});
		process.exit(1);
	}

	console.log('Validation passed for pakistan.json and india.json');
}

const currentFile = fileURLToPath(import.meta.url);
const entryFile = process.argv[1] ? path.resolve(process.argv[1]) : '';
if (currentFile === entryFile) {
	main().catch((error: unknown) => {
		const message = error instanceof Error ? error.message : String(error);
		console.error(message);
		process.exit(1);
	});
}
