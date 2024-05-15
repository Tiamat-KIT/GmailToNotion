import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
    runtimeEnv: process.env,
    client: {
        AUTH_SECRET: z.string({required_error: "データの秘匿を行うための文字列が定義されていません"}),
        AUTH_GOOGLE_ID: z.string({required_error: "GOOGLE_IDが定義されていません"}),
        AUTH_GOOGLE_SECRET: z.string({required_error: "GOOGLE_SECRETが定義されていません"}) 
    }
})