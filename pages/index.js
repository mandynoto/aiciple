import { useUser } from "@auth0/nextjs-auth0/client"
import Head from "next/head"
import Link from "next/link"
import { getSession } from "@auth0/nextjs-auth0"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBookOpenReader } from "@fortawesome/free-solid-svg-icons"

export default function Home() {
  const { isLoading, error, user } = useUser()
  if (isLoading) return <div>Loading...</div>
  if (error) return <div>{error.message}</div>

  return (
    <>
      <Head>
        <title>aiciple - login or signup</title>
      </Head>
      <div className="flex min-h-screen w-full flex-col items-center justify-between bg-white py-0 text-center text-white">
        <div>
          <div>
            <FontAwesomeIcon
              icon={faBookOpenReader}
              className="text-1xl fa-bounce mb-10 mt-20 text-aiciple-icon-light opacity-50"
              bounce
            />
          </div>
          <h1 className="mb-10 text-8xl font-bold text-black">aiciple</h1>
          <div>
            <div>
              {!user && (
                <>
                  <Link href="/api/auth/login" className="signin">
                    Login
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export const getServerSideProps = async (ctx) => {
  const session = await getSession(ctx.req, ctx.res)
  if (!!session) {
    return {
      redirect: {
        destination: "/chat",
      },
    }
  }

  return {
    props: {},
  }
}
