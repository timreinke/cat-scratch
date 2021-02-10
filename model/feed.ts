import * as t from 'io-ts'

const FeedItem = t.type({
    type: t.literal('entry'),
    data: t.UnknownRecord
})

type FeedItem = t.TypeOf<typeof FeedItem>

interface FeedSink {
    postItem(item: FeedItem) : Promise<void>
}

type Timestamp = number

interface FeedReader {
    latestItems(since?: Timestamp)
}
