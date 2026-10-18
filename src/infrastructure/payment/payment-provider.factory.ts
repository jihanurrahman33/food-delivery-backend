import { IPaymentProvider } from './payment-provider.interface';
import { MockPaymentProvider } from './mock-payment.provider';
import { AppError } from '../../core/errors/app-error';
import { appConfig } from '../../config';

export class PaymentProviderFactory {
  private static providers: Map<string, IPaymentProvider> = new Map();

  public static getProvider(providerName?: string): IPaymentProvider {
    const name = (providerName || appConfig.PAYMENT_PROVIDER).toLowerCase();

    if (this.providers.has(name)) {
      return this.providers.get(name)!;
    }

    switch (name) {
      case 'mock': {
        const provider = new MockPaymentProvider(appConfig.PAYMENT_WEBHOOK_SECRET);
        this.providers.set(name, provider);
        return provider;
      }
      case 'stripe':
      case 'paypal':
        // Real gateways can be slotted in here by implementing IPaymentProvider
        throw AppError.badRequest(`Live gateway '${name}' is not configured in current sandbox mode. Use 'mock'.`);
      default:
        throw AppError.badRequest(`Unknown payment provider: ${name}`);
    }
  }

  public static registerCustomProvider(provider: IPaymentProvider): void {
    this.providers.set(provider.name.toLowerCase(), provider);
  }
}
