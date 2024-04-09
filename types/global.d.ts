export {}

declare global {
    interface UserProfile {
        userId: string,
        email: string,
        firstname?: string,
        lastname?: string,
        phone?: string
    };

    interface HubspotContactProperty {
        property: string, value: string | number | boolean
    };

    interface HubspotContact {
        email: string,
        properties: Array<HubspotContactProperty>
    };
}