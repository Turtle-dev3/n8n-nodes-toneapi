import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeOperationError,
} from 'n8n-workflow';

export class ToonApi implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'TOON Format',
		name: 'toonApi',
		icon: 'file:toonapi.svg',
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"]}}',
		description: 'Convert data between JSON and TOON format for token-efficient LLM usage',
		defaults: {
			name: 'TOON Format',
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
						name: 'LLM Ready',
						value: 'llmready',
						description: 'Convert JSON to the most token-efficient format (JSON compact or TOON)',
						action: 'Convert JSON to most token-efficient format',
					},
					{
						name: 'Analyze Tokens',
						value: 'analyze',
						description: 'Get token counts for all formats with a recommendation',
						action: 'Analyze token counts for all formats',
					},
					{
						name: 'Encode',
						value: 'encode',
						description: 'Convert JSON data to TOON format',
						action: 'Encode JSON to TOON',
					},
					{
						name: 'Decode',
						value: 'decode',
						description: 'Convert TOON format back to JSON',
						action: 'Decode TOON to JSON',
					},
				],
				default: 'llmready',
			},
			// JSON Data — for llmready, analyze, encode
			{
				displayName: 'JSON Data',
				name: 'jsonData',
				type: 'json',
				default: '{}',
				required: true,
				placeholder: '{"key": "value"}',
				description: 'The JSON data to process. Accepts any valid JSON.',
				displayOptions: {
					show: {
						operation: ['llmready', 'analyze', 'encode'],
					},
				},
			},
			// Nested Tables — for encode
			{
				displayName: 'Nested Tables',
				name: 'nestedTables',
				type: 'boolean',
				default: false,
				description: 'Whether to use nested table encoding for uniform nested objects (can improve compression)',
				displayOptions: {
					show: {
						operation: ['encode'],
					},
				},
			},
			// TOON Input — for decode
			{
				displayName: 'TOON Input',
				name: 'toonInput',
				type: 'string',
				typeOptions: {
					rows: 6,
				},
				default: '',
				required: true,
				placeholder: 'Paste TOON-formatted string here...',
				description: 'The TOON-encoded string to decode back to JSON',
				displayOptions: {
					show: {
						operation: ['decode'],
					},
				},
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		const operation = this.getNodeParameter('operation', 0) as string;
		const baseUrl = 'https://api.toneai.dev';

		for (let i = 0; i < items.length; i++) {
			try {
				let responseData: object;

				if (operation === 'llmready') {
					const jsonData = this.getNodeParameter('jsonData', i);
					const data = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;

					responseData = await this.helpers.httpRequestWithAuthentication.call(
						this,
						'toneApi',
						{
							method: 'POST',
							url: `${baseUrl}/toon/llmready`,
							body: data,
							json: true,
						},
					);
				} else if (operation === 'analyze') {
					const jsonData = this.getNodeParameter('jsonData', i);
					const data = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;

					responseData = await this.helpers.httpRequestWithAuthentication.call(
						this,
						'toneApi',
						{
							method: 'POST',
							url: `${baseUrl}/toon/analyze`,
							body: data,
							json: true,
						},
					);
				} else if (operation === 'encode') {
					const jsonData = this.getNodeParameter('jsonData', i);
					const data = typeof jsonData === 'string' ? JSON.parse(jsonData) : jsonData;
					const nestedTables = this.getNodeParameter('nestedTables', i) as boolean;

					responseData = await this.helpers.httpRequestWithAuthentication.call(
						this,
						'toneApi',
						{
							method: 'POST',
							url: `${baseUrl}/toon/encode`,
							body: { data, nestedTables },
							json: true,
						},
					);
				} else if (operation === 'decode') {
					const input = this.getNodeParameter('toonInput', i) as string;

					if (!input) {
						throw new NodeOperationError(
							this.getNode(),
							'TOON Input is required',
							{ itemIndex: i },
						);
					}

					responseData = await this.helpers.httpRequestWithAuthentication.call(
						this,
						'toneApi',
						{
							method: 'POST',
							url: `${baseUrl}/toon/decode`,
							body: { input },
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
