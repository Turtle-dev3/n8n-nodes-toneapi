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
						name: 'Compare Tone',
						value: 'compare',
						description: 'Compare the tone of two texts side by side (costs 3 credits)',
						action: 'Compare tone of two texts',
					},
					{
						name: 'Detect Emotion',
						value: 'detectEmotion',
						description: 'Detect the primary emotion and emotion scores in text',
						action: 'Detect emotion in text',
					},
					{
						name: 'Reply',
						value: 'reply',
						description: 'Generate a reply to a message with a specific role and tone (costs 3 credits)',
						action: 'Generate reply to message',
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
			// Text A — only for compare
			{
				displayName: 'Text A',
				name: 'textA',
				type: 'string',
				typeOptions: {
					rows: 4,
				},
				default: '',
				required: true,
				placeholder: 'Enter the first text to compare...',
				description: 'The first text to compare (max 10,000 characters)',
				displayOptions: {
					show: {
						operation: ['compare'],
					},
				},
			},
			// Text B — only for compare
			{
				displayName: 'Text B',
				name: 'textB',
				type: 'string',
				typeOptions: {
					rows: 4,
				},
				default: '',
				required: true,
				placeholder: 'Enter the second text to compare...',
				description: 'The second text to compare (max 10,000 characters)',
				displayOptions: {
					show: {
						operation: ['compare'],
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
			// Message — only for reply
			{
				displayName: 'Message',
				name: 'message',
				type: 'string',
				typeOptions: {
					rows: 4,
				},
				default: '',
				required: true,
				placeholder: 'Enter the message to reply to...',
				description: 'The message you want to generate a reply for (max 10,000 characters)',
				displayOptions: {
					show: {
						operation: ['reply'],
					},
				},
			},
			// Role — only for reply
			{
				displayName: 'Role',
				name: 'role',
				type: 'options',
				options: [
					{ name: 'Support', value: 'support' },
					{ name: 'Sales', value: 'sales' },
					{ name: 'HR', value: 'hr' },
					{ name: 'Executive', value: 'executive' },
					{ name: 'Community', value: 'community' },
				],
				default: 'support',
				description: 'The role/persona to use when generating the reply',
				displayOptions: {
					show: {
						operation: ['reply'],
					},
				},
			},
			// Tone — only for reply
			{
				displayName: 'Tone',
				name: 'replyTone',
				type: 'options',
				options: [
					{ name: 'Professional', value: 'professional' },
					{ name: 'Empathetic', value: 'empathetic' },
					{ name: 'Friendly', value: 'friendly' },
					{ name: 'Assertive', value: 'assertive' },
					{ name: 'Casual', value: 'casual' },
				],
				default: 'professional',
				description: 'The tone to use in the reply',
				displayOptions: {
					show: {
						operation: ['reply'],
					},
				},
			},
			// Context — only for reply (optional)
			{
				displayName: 'Context',
				name: 'context',
				type: 'string',
				typeOptions: {
					rows: 2,
				},
				default: '',
				placeholder: 'e.g. Order #12345, customer has been waiting 2 weeks',
				description: 'Optional context to help generate a more relevant reply',
				displayOptions: {
					show: {
						operation: ['reply'],
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

				if (operation === 'compare') {
					const textA = this.getNodeParameter('textA', i) as string;
					const textB = this.getNodeParameter('textB', i) as string;
					responseData = await this.helpers.httpRequestWithAuthentication.call(
						this,
						'toneApi',
						{
							method: 'POST',
							url: `${baseUrl}/compare`,
							body: { text_a: textA, text_b: textB },
							json: true,
						},
					);
				} else if (operation === 'analyze') {
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
				} else if (operation === 'reply') {
					const message = this.getNodeParameter('message', i) as string;
					const role = this.getNodeParameter('role', i) as string;
					const replyTone = this.getNodeParameter('replyTone', i) as string;
					const context = this.getNodeParameter('context', i) as string;

					const body: { message: string; role: string; tone: string; context?: string } = {
						message,
						role,
						tone: replyTone,
					};
					if (context) {
						body.context = context;
					}

					responseData = await this.helpers.httpRequestWithAuthentication.call(
						this,
						'toneApi',
						{
							method: 'POST',
							url: `${baseUrl}/reply`,
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
