# WeakMap but completed
Weak references are great, but nearly nothing truly uses it in javascript.

# WeakRefMap.
Why not just use WeakMap? A native WeakMap is write only, you cant do things like `.forEach` or `for (const value of map)`. The only thing it can be used for is seeing if it contains it.

# Example

```typescript
import {WeakRefMap} from "weakrefmap";


class Clients {
    constructor(private readonly server: Server) {
    }

    doSomething() {

    }
}

class Server {
    clients = new WeakRefMap<string, Client>();
}

function test() {
    const server = new Server();
    let alice = new Client(server);
    const bob = new Client(server);
    server.clients.set('alice', alice).add('bob', bob);

    server.clients.forEach(client => client.doSomething());
    
    alice = null;
    // Alice is still floating in memory
    if (server.clients.has('alice')) {
      const lostAlice = server.clients.get('alice')
    }
}

test();
```

If this code was written with a normal `new Map<string, Client>`, everything would float forever in memory and never be cleaned. As both `Client` as `Server` have recursive references to each other. The magic of a weak reference will overcome this issue.

In the past, we would have demanded the user to call some `server.close()` function, but as we (java|type)script developers are lazy and not used with dealing with the garbage collector, we often forget.

With WeakRefMap the following happen
1) End of `test()`, reference all references to the client (`clientA`, `clientB`) get marked as `deletable`. As the variables are the only ones that count. The weak ref map is not counted as a reference
2) All `Client` instances get deleted
3) All server references are gone now, as `test()`'s `server` variable is gone, and so are all `Client` objects are gone
4) All memory usage of `test()` is fully and automatically cleaned up

What happens with a typical Map?
1) End of `test()`, references to the `clientA` and `clientB` are still holden in the `Server` instance.
2) clients instances still exists
3) server reference still exists in clients
4) all memory of test() is still in memory
5) memory leaked
