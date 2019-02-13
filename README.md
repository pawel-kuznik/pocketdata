# Pocketdata

Pocketdata is a library that allows for simulating an entity based storage
system. It's a convenient concept known from the server-side technologies,
but it doesn't make much sense in the same form for client-side applications.
This application allows defining entities that can be stored in object stores
and then can be persisted with an actual storage solution.

For managing the storage it uses an idea of pull-push that allow committing
a bunch of changes at once via any implemented way. It can be simple memory
storage, a custom socket implementation, prepare and send an email with data,
or any other way.
