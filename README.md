# truenest

Peer to peer screenshot sharing from your browser.

1. Give the file directly to a server, the browser opens the site where a file is living
2. You are the first viewer or the admin of the file, so you're the only user downloading the file from the server
3. Once you download the file, it's removed from the server and only continues to live in your current browser session
4. The seeding process begins, anyone who gets to the URL you're viewing will receive the file from you (with webtorrent)
5. You get the info about how much peers is viewing the file and when they stop viewing it
6. Once you close the browser, the file is completely gone
