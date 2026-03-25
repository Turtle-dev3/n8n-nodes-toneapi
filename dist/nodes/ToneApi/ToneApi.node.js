"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToneApi = void 0;
class ToneApi {
    constructor() {
        this.description = {
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
                            name: 'Adapt Text',
                            value: 'adapt',
                            description: 'Adapt text for a specific audience using a profile or preset (costs 2 credits)',
                            action: 'Adapt text for audience',
                        },
                        {
                            name: 'Analyze Tone',
                            value: 'analyze',
                            description: 'Analyze tone characteristics of text (rudeness, assertiveness, confidence, urgency, vagueness)',
                            action: 'Analyze tone of text',
                        },
                        {
                            name: 'Build Audience',
                            value: 'audience',
                            description: 'Build an audience profile from text and detected emotion',
                            action: 'Build audience profile',
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
                // Audience Text — for audience endpoint
                {
                    displayName: 'Text',
                    name: 'audienceText',
                    type: 'string',
                    typeOptions: {
                        rows: 4,
                    },
                    default: '',
                    required: true,
                    placeholder: 'Enter the original message to build an audience profile from...',
                    description: 'The original text to analyze for audience profiling (max 10,000 characters)',
                    displayOptions: {
                        show: {
                            operation: ['audience'],
                        },
                    },
                },
                // Emotion — for audience endpoint
                {
                    displayName: 'Emotion',
                    name: 'emotion',
                    type: 'string',
                    default: '',
                    required: true,
                    placeholder: 'e.g. frustrated, angry, anxious, joy',
                    description: 'The detected primary emotion (typically from Detect Emotion output)',
                    displayOptions: {
                        show: {
                            operation: ['audience'],
                        },
                    },
                },
                // Adapt Text — for adapt endpoint
                {
                    displayName: 'Text',
                    name: 'adaptText',
                    type: 'string',
                    typeOptions: {
                        rows: 4,
                    },
                    default: '',
                    required: true,
                    placeholder: 'Enter the text to adapt...',
                    description: 'The text to adapt for the target audience (max 10,000 characters)',
                    displayOptions: {
                        show: {
                            operation: ['adapt'],
                        },
                    },
                },
                // Audience Mode — for adapt endpoint
                {
                    displayName: 'Audience Mode',
                    name: 'audienceMode',
                    type: 'options',
                    options: [
                        { name: 'Preset', value: 'preset' },
                        { name: 'Custom String', value: 'string' },
                        { name: 'Structured Profile', value: 'structured' },
                    ],
                    default: 'preset',
                    description: 'How to specify the target audience',
                    displayOptions: {
                        show: {
                            operation: ['adapt'],
                        },
                    },
                },
                // Audience Preset — for adapt with preset mode
                {
                    displayName: 'Audience Preset',
                    name: 'audiencePreset',
                    type: 'options',
                    options: [
                        { name: 'Frustrated Customer', value: 'frustrated customer' },
                        { name: 'Angry Customer', value: 'angry customer' },
                        { name: 'Anxious Customer', value: 'anxious customer' },
                        { name: 'Happy Customer', value: 'happy customer' },
                        { name: 'C-Suite Executive', value: 'c-suite executive' },
                        { name: 'New Hire', value: 'new hire' },
                    ],
                    default: 'frustrated customer',
                    description: 'Select a built-in audience preset',
                    displayOptions: {
                        show: {
                            operation: ['adapt'],
                            audienceMode: ['preset'],
                        },
                    },
                },
                // Audience String — for adapt with string mode
                {
                    displayName: 'Audience',
                    name: 'audienceString',
                    type: 'string',
                    default: '',
                    required: true,
                    placeholder: 'e.g. senior engineer, upset parent, new subscriber',
                    description: 'Describe the target audience in plain text',
                    displayOptions: {
                        show: {
                            operation: ['adapt'],
                            audienceMode: ['string'],
                        },
                    },
                },
                // Structured audience fields — for adapt with structured mode
                {
                    displayName: 'Emotional State',
                    name: 'emotionalState',
                    type: 'string',
                    default: '',
                    required: true,
                    placeholder: 'e.g. frustrated, anxious, delighted',
                    description: 'The emotional state of the target audience',
                    displayOptions: {
                        show: {
                            operation: ['adapt'],
                            audienceMode: ['structured'],
                        },
                    },
                },
                {
                    displayName: 'Communication Needs',
                    name: 'communicationNeeds',
                    type: 'string',
                    default: '',
                    required: true,
                    placeholder: 'e.g. empathy, validation, clear next steps',
                    description: 'Comma-separated list of communication needs',
                    displayOptions: {
                        show: {
                            operation: ['adapt'],
                            audienceMode: ['structured'],
                        },
                    },
                },
                {
                    displayName: 'Tone Guidance',
                    name: 'toneGuidance',
                    type: 'string',
                    default: '',
                    required: true,
                    placeholder: 'e.g. warm but direct, acknowledge the problem before offering solutions',
                    description: 'Instructions for the ideal tone to use',
                    displayOptions: {
                        show: {
                            operation: ['adapt'],
                            audienceMode: ['structured'],
                        },
                    },
                },
                {
                    displayName: 'Avoid',
                    name: 'audienceAvoid',
                    type: 'string',
                    default: '',
                    placeholder: 'e.g. dismissive language, corporate jargon, deflection',
                    description: 'Comma-separated list of things to avoid (optional)',
                    displayOptions: {
                        show: {
                            operation: ['adapt'],
                            audienceMode: ['structured'],
                        },
                    },
                },
            ],
        };
    }
    async execute() {
        const items = this.getInputData();
        const returnData = [];
        const operation = this.getNodeParameter('operation', 0);
        const baseUrl = 'https://toneapi.bracherai.com';
        for (let i = 0; i < items.length; i++) {
            try {
                let responseData;
                if (operation === 'adapt') {
                    const text = this.getNodeParameter('adaptText', i);
                    const audienceMode = this.getNodeParameter('audienceMode', i);
                    let audience;
                    if (audienceMode === 'preset') {
                        audience = this.getNodeParameter('audiencePreset', i);
                    }
                    else if (audienceMode === 'string') {
                        audience = this.getNodeParameter('audienceString', i);
                    }
                    else {
                        const emotionalState = this.getNodeParameter('emotionalState', i);
                        const communicationNeeds = this.getNodeParameter('communicationNeeds', i)
                            .split(',').map((s) => s.trim()).filter(Boolean);
                        const toneGuidance = this.getNodeParameter('toneGuidance', i);
                        const avoidStr = this.getNodeParameter('audienceAvoid', i);
                        const avoid = avoidStr ? avoidStr.split(',').map((s) => s.trim()).filter(Boolean) : [];
                        audience = {
                            emotional_state: emotionalState,
                            communication_needs: communicationNeeds,
                            tone_guidance: toneGuidance,
                            avoid,
                        };
                    }
                    responseData = await this.helpers.httpRequestWithAuthentication.call(this, 'toneApi', {
                        method: 'POST',
                        url: `${baseUrl}/adapt`,
                        body: { text, audience },
                        json: true,
                    });
                }
                else if (operation === 'audience') {
                    const text = this.getNodeParameter('audienceText', i);
                    const emotion = this.getNodeParameter('emotion', i);
                    responseData = await this.helpers.httpRequestWithAuthentication.call(this, 'toneApi', {
                        method: 'POST',
                        url: `${baseUrl}/audience`,
                        body: { text, emotion },
                        json: true,
                    });
                }
                else if (operation === 'compare') {
                    const textA = this.getNodeParameter('textA', i);
                    const textB = this.getNodeParameter('textB', i);
                    responseData = await this.helpers.httpRequestWithAuthentication.call(this, 'toneApi', {
                        method: 'POST',
                        url: `${baseUrl}/compare`,
                        body: { text_a: textA, text_b: textB },
                        json: true,
                    });
                }
                else if (operation === 'analyze') {
                    const text = this.getNodeParameter('text', i);
                    responseData = await this.helpers.httpRequestWithAuthentication.call(this, 'toneApi', {
                        method: 'POST',
                        url: `${baseUrl}/analyze`,
                        body: { text },
                        json: true,
                    });
                }
                else if (operation === 'detectEmotion') {
                    const text = this.getNodeParameter('text', i);
                    responseData = await this.helpers.httpRequestWithAuthentication.call(this, 'toneApi', {
                        method: 'POST',
                        url: `${baseUrl}/detect-emotion`,
                        body: { text },
                        json: true,
                    });
                }
                else if (operation === 'rewrite') {
                    const text = this.getNodeParameter('text', i);
                    const targetTone = this.getNodeParameter('targetTone', i);
                    const body = { text };
                    if (targetTone) {
                        body.target_tone = targetTone;
                    }
                    responseData = await this.helpers.httpRequestWithAuthentication.call(this, 'toneApi', {
                        method: 'POST',
                        url: `${baseUrl}/rewrite`,
                        body,
                        json: true,
                    });
                }
                else if (operation === 'reply') {
                    const message = this.getNodeParameter('message', i);
                    const role = this.getNodeParameter('role', i);
                    const replyTone = this.getNodeParameter('replyTone', i);
                    const context = this.getNodeParameter('context', i);
                    const body = {
                        message,
                        role,
                        tone: replyTone,
                    };
                    if (context) {
                        body.context = context;
                    }
                    responseData = await this.helpers.httpRequestWithAuthentication.call(this, 'toneApi', {
                        method: 'POST',
                        url: `${baseUrl}/reply`,
                        body,
                        json: true,
                    });
                }
                else if (operation === 'getKeyInfo') {
                    responseData = await this.helpers.httpRequestWithAuthentication.call(this, 'toneApi', {
                        method: 'GET',
                        url: `${baseUrl}/keys/me`,
                        json: true,
                    });
                }
                else {
                    throw new Error(`Unknown operation: ${operation}`);
                }
                returnData.push({ json: responseData });
            }
            catch (error) {
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
exports.ToneApi = ToneApi;
