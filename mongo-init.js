db.createUser(
    {
        user: "admin",
        pwd: "PeerPress123",
        roles: [
            {
                role: "readWrite",
                db: "peer-press"
            }
        ]
    }
);