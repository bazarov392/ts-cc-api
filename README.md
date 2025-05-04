# CryptoCloud API v2

Node.js library for working with the [CryptoCloud](https://cryptocloud.plus) API v2 - a cryptocurrency payment processing service.

## Installation
```bash
yarn add cryptocloud-api
# or
npm install cryptocloud-api
```

## Usage
```typescript
import { CryptoCloudApi, CryptoCloudApiException } from "cryptocloud-api";
import { env } from "process";
import { randomUUID } from "crypto";

const api = new CryptoCloudApi(
    env.CC_API_KEY,
    env.CC_SHOP_ID,
    env.CC_SECRET_KEY    
);

try
{
    const orderId = randomUUID();
    const invoice = await api.createInvoice({
        amount: 100,
        currency: "RUB",
        order_id: orderId
    });

    await api.canceledInvoice(invoice.uuid);
}
catch(err)
{
    if(err instanceof CryptoCloudApiException)
        // ...
    else 
        // ...
}
```

This library includes all methods from the API documentation.

### Validate Postback notifications

Example with Express.js:

```typescript
import express from "express";
import { CryptoCloudApi, CryptoCloudPostbackValidationException } from "cryptocloud-api";
import { env } from "process";

const app = express();
app.use(express.json());

const api = new CryptoCloudApi(
    env.CC_API_KEY,
    env.CC_SHOP_ID,
    env.CC_SECRET_KEY
);

app.post("/cryptocloud/callback", async (req, res) => {
    try {
        // Validate the postback data
        const postbackData = await api.validatePostback(req.body);
        
        // Process the validated postback
        console.log("Validated postback:", postbackData);

        res.status(200).send("OK");
    } catch(err) {
        if(err instanceof CryptoCloudPostbackValidationException) {
            console.error("Invalid postback data:", err.message);
            return res.status(400).send("Invalid postback data");
        }
        
        console.error("Error processing postback:", err);
        res.status(500).send("Error processing postback");
    }
});

const PORT = env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
```




