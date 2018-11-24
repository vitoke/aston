# Aston JS

A multi-purpose, immutable, asynchronous, context-safe configuration management utility.

## Installation

`yarn add aston`

## Usage

### Simple

```
import Aston from 'aston';

const config = Aston.inject({
  key: 'SecretKey', value: 1
})

const myContext = config.inject({
  key: 'Test', value: 5
})

config.get('SecretKey')
// returns 1

myContext.get('SecretKey')
// returns 1

myContext.get('Test')
// returns 5

config.get('Test')
// throws
```

### Advanced

```
import Aston from 'aston';

const productionEndPoints = {
  cakes: 'sales/cakes',
  bread: 'offers/daily/bread'
}

const testEndPoints = {
  cakes: 'test/cakes',
  bread: 'test/bread'
}

const loadSecretKey = async () => { await ... return secretKey }

const [ENDPOINTS, SECRETKEY] = [Symbol(), Symbol()];

const testConfig = Aston.inject(
  { key: ENDPOINTS, value: testEndPoints },
  { key: SECRETKEY, value: 1 }
)

const prodConfig = Aston.inject(
  { key: ENDPOINTS, value: productionEndpoints },
  { key: SECRETKEY, single: loadSecretKey }
)

class Bakery {
  // until we get decorators
  static ASTON_INJECT = { endPoints: ENDPOINTS, secretKey: SECRETKEY }
  
  endPoints;
  secretKey;
  
  getCakes = () => fetch(this.endPoints.cakes, { auth: this.secretKey });
}

const testEnv = testConfig.inject({ single: Bakery })
const prodEnv = prodConfig.inject({ single: Bakery })

const testBakery = await testEnv.get(Bakery);
testBakery.getCakes();

const prodBakery = await prodEnv.get(Bakery);
prodBakery.getCakes();
```

## Motivation

Configuring a non-trivial application is hard. Some values need to be loaded from the
environment, some need to be retrieved from a web service, classes depend on other
classes that need to initialize from asynchronous code etc etc.

### Declarative and asynchronous
Aston is intended to shift that complexity to a declarative way of specifying
dependencies, without needing to explicitly state the initialization order. It will
figure out the dependency graph while fetching instances. It will wait for any
asynchronous code to complete before continuing, basically giving you the power of
having intelligent asynchronous constructors for classes.

### Immutable
Aston instances are immutable. That means, once you have constructed a Aston
configuration, there is no way to change it. For example:

```
const config = Aston.inject({ key: 'test', value: 1 });
config.inject({ key: 'bar', value: 123 });

const bar = await config.get('bar');
// throws, since the instance assigned to config does not have knowledge of bar
```

This keeps behavior predictable. It also
means that no dependency can depend on values that are added to a later instance.
While perhaps sometimes annoying, this keeps the behavior of instances pure, free
of side-effects, and predictable, which is a Good Thing (tm).

### Powerful
In Aston world, there is no such thing as a real singleton. A single instance means
that, within THAT aston instance and all instances derived from it, the Aston will
always return the same instance.

However, nothing is holding you against creating a new Aston instance defining another
single instance relying on completely different values for its dependencies.

#### Huh? No singletons?
That's right, Aston doesn't do anything global, only local within it's own context.
So there is no such thing as a 'global' singleton, only a local singleton. This actually
allows you to, for example, have multiple active configurations at the same time!
(Of course, don't do that if your classes actually use a non-shareable resource)

## Details

### `Aston`

The main and default exported value is named `Aston` and this is the empty context.
All aston contexts start with this empty context and then inject values
to create a new instance.

### `inject(...items)`

Aston is a key-value store, so each item that is injected needs to have
some way to find it back. Keys are unique and cannot be overwritten or
removed. In such attemps, inject will throw.

#### `inject({ key, value })`

Simply returns a new context with the key set to the specified value and
performs no other magic. Get will always retrieve this exact value. Values
must always have an explicit key.

#### `inject({ single })`

Returns a new context where every time the key is queried from Aston, it will
return the same instance. The instance is created the first time it is requested.

`single` should be an object, or a creatable value, e.g. a class or function. If
the value is a function returning a promise, it will resolve this promise and
pass the resulting value when queried through `get` or `getItems`.

The following extra properties can optionally be added:

- `key`: specifies the key for which the instance can be retrieved, can be any type
- `args`: specifies an array of arguments to be passed to the creation function or
          class constructor
- `supplyAston`: when true and `single` is a function, it's owning Aston instance
                 will be passed as first parameter

If the value is an object or class, and no key is specified, Aston will assume
the class constructor is the key.

```
const config = Aston.inject(
  { single: BarClass, args: [1, 'Test'] },
  { key: 'foo', 
    single: async aston => new FooClass(await aston.get(BarClass),
    supplyAston: true
  }
);

const foo = await config.get('foo');
```

#### `inject({ multi })`

Returns a new context where every time the key is queried from Aston, it will
return a new instance.

`multi` should be a creatable value, e.g. a class or function. If
the value is a function returning a promise, it will resolve this promise and
pass the resulting value when queried through `get` or `getItems`.

The following extra properties can optionally be added:

- `key`: specifies the key for which the instance can be retrieved, can be any type
- `args`: specifies an array of arguments to be passed to the creation function or
          class constructor
- `supplyAston`: when true and `multi` is a function, it's owning Aston instance
                 will be passed as first parameter

If the value is a class, and no key is specified, Aston will assume the key
is the class constructor.

```
const config = Aston.inject(
  { multi: BarClass, args: [1, 'Test'] },
  { key: 'foo', 
    single: (aston, a, b) => new FooClass(a, b, aston.get(BarClass)),
    supplyAston: true
  }
)

const foo = await config.get('foo', 'valueA', 3.14);
```

### `get(key, ...args)` (promise)

Retrieves a dependency from the aston instance using the given key. If extra arguments
are given, these will be passed to the function or constructor of a `multi` entry.

Note that passing extra arguments to an entry that is `single` or `value` will throw.

### `getItems(...keys)` (promise)

Returns an array of the items corresponding to the provided keys. If arguments need
to be passed, the key can be replaced by an array starting with the key and then the
arguments.

```
const config = Aston.inject(....);

const [item1, item2, item3, item4] =
  await config.getItems('key1', 'key2', ['key3', 3.14, 'Test'], 'key4')
```

### Class-based injection

When using classes it is also possible, when the classes are created through Aston,
to specify dependencies using static configuration options. Unfortunately, decorators are not yet
available in most JS environments.

Note that these only work if the class is directly constructed by Aston!

#### `ASTON_CONSTRUCTOR`

Using the `ASTON_CONSTRUCTOR` static value on a class, an array of keys can be
specified corresponding to Aston instances. Aston will then supply these instances
to the class constructor upon creation.

```
class Foo {
  static ASTON_CONSTRUCTOR = [Bar, 'item']

  constructor(bar, item) {
    ...
  }
}

const config = Aston.inject(
  { single: class Bar {} },
  { key: 'item', value: 1 },
  { single: Foo }
)

const foo = await config.get(Foo);
```

#### `ASTON_INJECT`

Using the `ASTON_INJECT` static value on a class, an object can be specified that
maps class properties to Aston keys. Aston will then set the class properties to
the instances corresponding to the given keys.

Note that this happens after construction, so in the constructor no access is possible
to these values.

```
class Foo {
  static ASTON_INJECT = { bar: Bar, test: 'item' }

  bar;
  test;
  
  action = () => {
    this.bar.method(this.test.data);
  }
}

const config = Aston.inject(
  { single: class Bar { method () {} } },
  { key: 'item', value: { data: 1 } },
  { single: Foo }
)

const foo = await config.get(Foo);
```

## Related

tbd
