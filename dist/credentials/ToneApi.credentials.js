"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToneApi = void 0;
class ToneApi {
    constructor() {
        this.name = 'toneApi';
        this.displayName = 'Tone API';
        this.documentationUrl = 'https://dashboard.bracherai.com/docs';
        this.properties = [
            {
                displayName: 'API Key',
                name: 'apiKey',
                type: 'string',
                typeOptions: { password: true },
                default: '',
                required: true,
                placeholder: 'tone_...',
            },
        ];
        this.authenticate = {
            type: 'generic',
            properties: {
                headers: {
                    Authorization: '=Bearer {{$credentials.apiKey}}',
                },
            },
        };
    }
}
exports.ToneApi = ToneApi;
