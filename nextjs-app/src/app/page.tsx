
import { signIn } from "@/auth"
import SignInButton from "@/components/SigninButton"

export default function Index() {
  return (
    <>
      
        <article className="flex items-center justify-center w-100">
        <div className="border rounded-lg border-slate-200 w-96 py-5 px-3 h-48">
          <h3 className="text-xl font-bold text-center p-3">あなたは、大量に届くメールに<br/>辟易したことがありませんか？</h3>
          <p className="text-center">
            あなたは、メールを使う中で、メールが大量にくることに辟易していませんか?<br />
          </p>
        </div>
        </article>
        <div className="flex justify-center items-center w-screen mt-5">
          <SignInButton />
        </div>
    </>
  )
} 