import axios, { AxiosInstance, AxiosResponse } from "axios"
import type { CreateInvoiceRequest } from "./types/requests/create-invoice";
import type { Response } from "./types/response";
import type { CreatedInvoice, Invoice } from "./types/invoice";
import { CryptoCloudApiException, CryptoCloudPostbackValidationException } from "./exception";
import type { ErrorBody } from "./types/requests/error-body";
import type { ListInvoicesRequest } from "./types/requests/list-invoices";
import type { Balance } from "./types/balance";
import type { Statistic } from "./types/statistic";
import type { StatisticRequest } from "./types/requests/statistic";
import { plainToInstance } from "class-transformer";
import { PostbackDto } from "./dto/postback.dto";
import { validate } from "class-validator";
import jwt from "jsonwebtoken";
import { Postback } from "./types/postback";

export class CryptoCloudApi
{
    
    private readonly api: AxiosInstance
    constructor(
        private readonly apiKey: string,
        private readonly shopId: string,
        private readonly secretKey: string,
    ) 
    {
        this.api = axios.create({
            baseURL: "https://api.cryptocloud.plus/v2",
            headers: {
                "Authorization": `Token ${this.apiKey}`
            },
            validateStatus: () => true
        });
    }

    private callException(response: AxiosResponse<Response<any>>)
    {
        const errorBody = (response.data as ErrorBody).result;
        const errorMessage = Object.values(errorBody).map(([key, value]) => `${key}: ${value}`).join("\n");
        throw new CryptoCloudApiException(`${response.status} ${response.statusText}\n${errorMessage}`);
    }


    async createInvoice(data: CreateInvoiceRequest)
    {
        const localeStr = data.locale
            ? `?locale=${data.locale}`
            : "";
        const response = await this.api.post<Response<CreatedInvoice>>(`/invoice/create${localeStr}`, {
            shop_id: this.shopId,
            amount: data.amount,
            currency: data.currency,
            order_id: data.order_id
        });
        if (response.status !== 200)
        {
            this.callException(response);
        }
        return response.data.result;
    }

    async canceledInvoice(invoiceId: string)
    {
        const response = await this.api.post<Response<["ok"]>>(`/invoice/merchant/canceled`, {
            uuid: invoiceId
        });
        if (response.status !== 200)
        {
            this.callException(response);
        }
        return;
    }

    async listInvoices(data: ListInvoicesRequest)
    {
        const response = await this.api.post<Response<Invoice[]>>(`/invoice/merchant/list`, {
            start: data.start.toLocaleString().slice(0, 10),
            end: data.end.toLocaleString().slice(0, 10),
            offset: data.offset,
            limit: data.limit
        });
        if (response.status !== 200)
        {
            this.callException(response);
        }
        return response.data.result;
    }

    async getInvoices(invoiceIds: string[])
    {
        const response = await this.api.post<Response<Invoice[]>>(`/invoice/merchant/info`, {
            uuids: invoiceIds
        });
        if (response.status !== 200)
        {
            this.callException(response);
        }
        return response.data.result;
    }

    async getBalance()
    {
        const response = await this.api.post<Response<Balance[]>>(`/merchant/wallet/balance/all`);
        if (response.status !== 200)
        {
            this.callException(response);
        }
        return response.data.result;
    }

    async getStatistic(data: StatisticRequest)
    {
        const response = await this.api.post<Response<Statistic>>(`/merchant/statistics`, {
            start: data.start.toLocaleString().slice(0, 10),
            end: data.end.toLocaleString().slice(0, 10),
        });
        if (response.status !== 200)
        {
            this.callException(response);
        }
        return response.data.result;
    }

    static async validatePostback(data: object | string, secretKey: string)
    {
        if(typeof data === "string")
            data = JSON.parse(data);

        if(Array.isArray(data) || typeof data !== "object")
            throw new CryptoCloudPostbackValidationException("Invalid postback data");


        const dto = plainToInstance(PostbackDto, data);
        const errors = await validate(dto);
        if(errors.length > 0)
            throw new CryptoCloudPostbackValidationException(errors.map((error) => error.property).join(", "));

        try
        {
            jwt.verify(dto.token, secretKey, {
                algorithms: ["HS256"]
            });
        }
        catch(e)
        {
            throw new CryptoCloudPostbackValidationException("Invalid token");
        }

        return data as Postback;
    }

    validatePostback(data: object | string)
    {
        return CryptoCloudApi.validatePostback(data, this.secretKey);
    }
}