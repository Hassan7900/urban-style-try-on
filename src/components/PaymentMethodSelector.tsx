import React from 'react';
import { PAYMENT_METHOD_DETAILS, PaymentGateway } from '@/config/paymentConfig';
import { Card, CardContent } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

interface PaymentMethodSelectorProps {
  selectedMethod: PaymentGateway | '';
  onMethodChange: (method: PaymentGateway) => void;
}

const PaymentMethodSelector: React.FC<PaymentMethodSelectorProps> = ({
  selectedMethod,
  onMethodChange,
}) => {
  const enabledMethods = Object.values(PAYMENT_METHOD_DETAILS).filter(
    (method) => method.enabled
  );

  return (
    <div className="space-y-4">
      <h2 className="font-display text-xl font-bold text-foreground">
        Payment Method
      </h2>
      <RadioGroup value={selectedMethod} onValueChange={(value) => onMethodChange(value as PaymentGateway)}>
        <div className="space-y-3">
          {enabledMethods.map((method) => (
            <label key={method.id} className="cursor-pointer">
              <Card className={`p-4 border-2 transition-all ${
                selectedMethod === method.id
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50'
              }`}>
                <CardContent className="flex items-center gap-4 p-0">
                  <RadioGroupItem value={method.id} id={method.id} className="mt-1" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xl">{method.icon}</span>
                      <p className="font-semibold text-foreground">{method.name}</p>
                    </div>
                    <p className="text-sm text-muted-foreground">{method.description}</p>
                  </div>
                </CardContent>
              </Card>
            </label>
          ))}
        </div>
      </RadioGroup>
    </div>
  );
};

export default PaymentMethodSelector;
