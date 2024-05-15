
import { signIn } from "@/auth"
 
export default function SignIn() {
  return (
    <form
      action={async () => {
        "use server"
        await signIn("google",{
          redirectTo: `${process.env.NEXT_PUBLIC_VERCEL_URL}/google-calender`
        })
      }}
    >
      <button type="submit">Signin with Google</button>
    </form>
  )
} 