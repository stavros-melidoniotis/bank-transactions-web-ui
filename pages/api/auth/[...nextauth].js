import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { compare } from 'bcryptjs'
import clientPromise from '../../../lib/mongodb'

export default NextAuth({
    session: {
        strategy: "jwt"
    },
    providers: [
        CredentialsProvider({
            debug: true,
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                const client = await clientPromise
                const db = await client.db(process.env.MONGODB_DB)
                const users = await db.collection('users')

                const userFound = await users.findOne({
                    username: credentials.username,
                })

                if (!userFound) {
                    throw new Error('No user found with the username')
                }

                const passwordMatches = await compare(credentials.password, userFound.password)

                if (!passwordMatches) {
                    throw new Error('Password doesnt match')
                }

                delete userFound.password

                /**
                 * Passing all user data inside "name" property
                 * since callbacks won't work as expected.
                 */ 
                return {
                    name: JSON.stringify(userFound)
                }
            },
            // callbacks: {
            //     async jwt({ token, user }) {
            //         if (user) {
            //             token.user = user
            //         }
            //         console.log(token);
            //         return token
            //     },
            //     async session({ session, token }) {
            //         session.user = token.user
            //         console.log(session);
            //         return session
            //     },
            // },
        })
    ],
})