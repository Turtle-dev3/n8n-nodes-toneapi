import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';

export class ToneApi implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Tone API',
		name: 'toneApi',
		icon: 'file:toneapi.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"]}}',
		description: 'Analyze tone, detect emotions, and rewrite text using the Tone API',
		defaults: {
			name: 'Tone API',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'toneApi',
				required: true,
			},
		],
		properties: [
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Analyze Tone',
						value: 'analyze',
						description: 'Analyze tone characteristics of text (rudeness, assertiveness, confidence, urgency, vagueness)',
						action: 'Analyze tone of text',
					},
					{
						name: 'Detect Emotion',
						value: 'detectEmotion',
						description: 'Detect the primary emotion and emotion scores in text',
						action: 'Detect emotion in text',
					},
					{
						name: 'Rewrite',
						value: 'rewrite',
						description: 'Rewrite text in a professional tone or a custom target tone',
						action: 'Rewrite text',
					},
					{
						name: 'Get Key Info',
						value: 'getKeyInfo',
						description: 'Get API key info, remaining credits, and usage logs',
						action: 'Get API key info',
					},
				],
				default: 'analyze',
			},
			// Text field — shown for analyze, detectEmotion, rewrite
			{
				displayName: 'Text',
				name: 'text',
				type: 'string',
				typeOptions: {
					rows: 4,
				},
				default: '',
				required: true,
				placeholder: 'Enter the text to process...',
				description: 'The text to analyze, detect emotion in, or rewrite (max 10,000 characters)',
				displayOptions: {
					show: {
						operation: ['analyze', 'detectEmotion', 'rewrite'],
					},
				},
			},
			// Target tone — only for rewrite
			{
				displayName: 'Target Tone',
				name: 'targetTone',
				type: 'string',
				default: '',
				placeholder: 'e.g. empathetic, casual, formal, assertive',
				description: 'Optional target tone for the rewrite. Leave empty for default professional tone.',
				displayOptions: {
					show: {
						operation: ['rewrite'],
					},
				},
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		const operation = this.getNodeParameter('operation', 0) as string;
		const baseUrl = 'https://toneapi.bracherai.com';

		for (let i = 0; i < items.length; i++) {
			try {
				let responseData: object;

				if (operation === 'analyze') {
					const text = this.getNodeParameter('text', i) as string;
					responseData = await this.helpers.httpRequestWithAuthentication.call(
						this,
						'toneApi',
						{
							method: 'POST',
							url: `${baseUrl}/analyze`,
							body: { text },
							json: true,
						},
					);
				} else if (operation === 'detectEmotion') {
					const text = this.getNodeParameter('text', i) as string;
					responseData = await this.helpers.httpRequestWithAuthentication.call(
						this,
						'toneApi',
						{
							method: 'POST',
							url: `${baseUrl}/detect-emotion`,
							body: { text },
							json: true,
						},
					);
				} else if (operation === 'rewrite') {
					const text = this.getNodeParameter('text', i) as string;
					const targetTone = this.getNodeParameter('targetTone', i) as string;

					const body: { text: string; target_tone?: string } = { text };
					if (targetTone) {
						body.target_tone = targetTone;
					}

					responseData = await this.helpers.httpRequestWithAuthentication.call(
						this,
						'toneApi',
						{
							method: 'POST',
							url: `${baseUrl}/rewrite`,
							body,
							json: true,
						},
					);
				} else if (operation === 'getKeyInfo') {
					responseData = await this.helpers.httpRequestWithAuthentication.call(
						this,
						'toneApi',
						{
							method: 'GET',
							url: `${baseUrl}/keys/me`,
							json: true,
						},
					);
				} else {
					throw new Error(`Unknown operation: ${operation}`);
				}

				returnData.push({ json: responseData as INodeExecutionData['json'] });
			} catch (error: unknown) {
				if (this.continueOnFail()) {
					const errorMessage = error instanceof Error ? error.message : String(error);
					returnData.push({
						json: { error: errorMessage },
						pairedItem: { item: i },
					});
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}
