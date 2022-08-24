import clientPromise from '../../lib/mongodb'

export default async (req, res) => {
    try {
        const collectionName = req.body.collectionName

        const client = await clientPromise
        const db = await client.db(process.env.MONGODB_DB)
        const transactions = await db.collection(collectionName).find({}).toArray()

        return res.status(200).json(transactions)
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error })
    }
}