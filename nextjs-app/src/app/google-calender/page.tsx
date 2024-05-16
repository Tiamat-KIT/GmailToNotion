import {auth} from "@/auth";
import {google, calendar_v3} from 'googleapis'
import { env } from "../../env.d";
import Calendar = calendar_v3.Calendar


export default async function Page() {
    // サーバ・コンポーネントでセッションを取得する。
    const session = await auth()
    const user = session?.user

    // Google OAuthへの接続
    const oauth2Client = new google.auth.OAuth2({
        clientId: env.AUTH_GOOGLE_ID,
        clientSecret: env.AUTH_GOOGLE_SECRET,
	// GCPコンソールで設定したredirect URI
        redirectUri: `${process.env.NODE_ENV === "development" ? "http://localhost:3000" : process.env.NEXT_PUBLIC_VERCEL_URL}/google-calendar`
    })
    
    const accessToken = user?.accessToken // Googleが払い出したアクセストークン
    if (!accessToken) {
        return (
            <div>accessToken is null</div>
        )
    }

    // トークンを設定。refresh_tokenも渡せます。
    oauth2Client.setCredentials({access_token: accessToken})
    
    // カレンダーオブジェクト作成
    const calendar: Calendar = google.calendar({version: 'v3', auth: oauth2Client})
    
    // カレンダー一覧を取得
    const calendarResponse = await calendar.calendarList.list()

    const AwaitYotei = calendarResponse.data.items?.map((data) => {
        return calendar.calendars.get({
            calendarId: data.id!
        })
    })

    const Yotei = await Promise.all(AwaitYotei!.map(async(data) => {
        return (await data).data
    }))

    return (
        <main
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "70vh",
            }}
        >
            <div>
                {/* <div>よしなにレンダリング。calendarResponse.data</div>
                {calendarResponse.data.items?.map((data) => {
                    return <div key={data.id}>{data.summary}</div>
                })} */}
                {Yotei.map((data) => {
                    return (
                        <div key={data.id}>{data.summary}</div>
                    )
                })}
            </div>
        </main>
    );
}