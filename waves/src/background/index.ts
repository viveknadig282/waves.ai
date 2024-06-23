import { Storage } from "@plasmohq/storage"

const storage = new Storage();

storage.watch({
    "muted": (c) => {
        console.log(c.newValue);
    }
})