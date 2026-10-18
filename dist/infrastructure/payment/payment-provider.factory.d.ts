import { IPaymentProvider } from './payment-provider.interface';
export declare class PaymentProviderFactory {
    private static providers;
    static getProvider(providerName?: string): IPaymentProvider;
    static registerCustomProvider(provider: IPaymentProvider): void;
}
