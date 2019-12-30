export interface NetworkSettings {
    name: string;
    interface: string;
    ipAddress: string;
    subnet: string;
    gateway: string;
    dnsPrimary: string;
    dnsSecondary: string;
    active: boolean;
}
