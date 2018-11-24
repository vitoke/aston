import Aston, { AstonError } from '.';
// import Aston, { AstonError } from '../../dist/aston';

const wait = ms => new Promise(r => setTimeout(r, ms));

const expectAstonError = f => async () => {
  let succeeded = false;
  try {
    await f();
    succeeded = true;
  } catch (e) {
    if (!e instanceof AstonError) throw e;
  }

  if (succeeded) throw new Error('test succeeded but should have thrown');
};

describe('Aston', () => {
  test(
    'empty get throws',
    expectAstonError(async () => {
      await Aston.get('test');
    })
  );

  test(
    'add value without key throws',
    expectAstonError(() => {
      Aston.inject({ value: 1 });
    })
  );

  test(
    'add non-constructable single throws',
    expectAstonError(() => {
      Aston.inject({ single: 1 });
    })
  );

  test(
    'add non-constructable multi throws',
    expectAstonError(() => {
      Aston.inject({ multi: 1 });
    })
  );

  test('add and get named value succeeds', async () => {
    const context = Aston.inject({ key: 'test', value: { foo: 1 } });
    const instance1 = await context.get('test');
    const instance2 = await context.get('test');
    expect(instance1).toEqual({ foo: 1 });
    expect(instance1).toBe(instance2);
  });

  test('add and get single named reference succeeds and returns same object', async () => {
    const ref = {};

    const context = Aston.inject({ key: 'test', value: ref });
    expect(await context.get('test')).toBe(ref);
  });

  test('add and get single named object creator succeeds and returns same object', async () => {
    const context = Aston.inject({ key: 'test', single: () => ({ foo: 1 }) });
    const instance1 = await context.get('test');
    const instance2 = await context.get('test');
    expect(instance1).toEqual({ foo: 1 });
    expect(instance1).toBe(instance2);
  });

  test('add and get single class to return same class instance', async () => {
    class Test {
      value = 1;
    }

    const context = Aston.inject({ single: Test });
    const instance1 = await context.get(Test);
    const instance2 = await context.get(Test);
    expect(instance1 instanceof Test).toBe(true);
    expect(instance1.value).toBe(1);
    expect(instance1).toBe(instance2);
  });

  test('add and get single class instance to return same class instance', async () => {
    class Test {}
    const test = new Test();

    const context = Aston.inject({ single: test });
    const instance1 = await context.get(Test);
    const instance2 = await context.get(Test);
    expect(instance1 instanceof Test).toBe(true);
    expect(instance1).toBe(instance2);
  });

  test('add and get single unnamed function returns same function result', async () => {
    const f = () => ({ foo: 1 });
    const context = Aston.inject({ single: f });
    const instance1 = await context.get(f);
    const instance2 = await context.get(f);
    expect(instance1).toEqual({ foo: 1 });
    expect(instance1).toBe(instance2);
  });

  test(
    'get single instance with extra args should throw',
    expectAstonError(async () => {
      const f = a => ({ foo: a });

      const context = Aston.inject({ single: f });

      await context.get(f, 1);
    })
  );

  test('add and get single instance with specific key works', async () => {
    const f = () => {};

    const context = Aston.inject(
      { key: 1, value: 10 },
      { key: 'a', single: () => ({ foo: 1 }) },
      {
        key: f,
        single: async () => {
          await wait(100);
          return 4;
        }
      }
    );

    expect(await context.get(1)).toBe(10);
    expect(await context.get(f)).toBe(4);
    const instance1 = await context.get('a');
    const instance2 = await context.get('a');
    expect(instance1).toEqual({ foo: 1 });
    expect(instance1).toBe(instance2);
  });

  test('add structured single works as expected', async () => {
    const context = Aston.inject(
      {
        key: 'a',
        single: () => 1
      },
      {
        key: 'b',
        single: () => ({ foo: 1 })
      }
    );

    expect(await context.get('a')).toBe(1);
    const instance1 = await context.get('b');
    const instance2 = await context.get('b');
    expect(instance1).toEqual({ foo: 1 });
    expect(instance1).toBe(instance2);
  });

  test('add structured single class and instance works as expected', async () => {
    class Test {}

    const a = new Test();

    const context = Aston.inject(
      {
        key: a,
        value: a
      },
      {
        key: 'b',
        single: Test
      }
    );

    expect(await context.get(a)).toBe(a);
    const instance1 = await context.get('b');
    const instance2 = await context.get('b');
    expect(instance1 instanceof Test).toBe(true);
    expect(instance1).toBe(instance2);
  });

  test('add promise single returns resolved instance', async () => {
    const context = Aston.inject({
      key: 'a',
      single: async () => {
        await wait(100);
        return { foo: 1 };
      }
    });

    const instance1 = await context.get('a');
    const instance2 = await context.get('a');
    expect(instance1).toEqual({ foo: 1 });
    expect(instance1).toBe(instance2);
  });

  test('add single with args returns instance with arg', async () => {
    const context = Aston.inject({
      key: 'a',
      single: async value => {
        await wait(100);
        return { foo: value };
      },
      args: [1]
    });

    const instance1 = await context.get('a');
    const instance2 = await context.get('a');
    expect(instance1).toEqual({ foo: 1 });
    expect(instance1).toBe(instance2);
  });

  test(
    'add create value should throw',
    expectAstonError(() => {
      Aston.inject({ multi: 1 });
    })
  );

  test(
    'add create non-struct object throws',
    expectAstonError(async () => {
      class Test {}
      const test = new Test();

      Aston.inject({ multi: test });
    })
  );

  test(
    'add and get create named value throws',
    expectAstonError(() => {
      Aston.inject({ key: 'test', multi: { foo: 1 } });
    })
  );

  test('add and get create named object creator succeeds and returns new object', async () => {
    const context = Aston.inject({ key: 'test', multi: () => ({ foo: 1 }) });
    const instance1 = await context.get('test');
    const instance2 = await context.get('test');
    expect(instance1).toEqual({ foo: 1 });
    expect(instance2).toEqual({ foo: 1 });
    expect(instance1).not.toBe(instance2);
  });

  test('add and get create class to return new class instance', async () => {
    class Test {}

    const context = Aston.inject({ multi: Test });
    const instance1 = await context.get(Test);
    const instance2 = await context.get(Test);
    expect(instance1 instanceof Test).toBe(true);
    expect(instance2 instanceof Test).toBe(true);
    expect(instance1).not.toBe(instance2);
  });

  test('add and get create unnamed function returns newly created function result', async () => {
    const f = () => ({ foo: 1 });
    const context = Aston.inject({ multi: f });
    const instance1 = await context.get(f);
    const instance2 = await context.get(f);
    expect(instance1).toEqual({ foo: 1 });
    expect(instance1).not.toBe(instance2);
  });

  test('get create instance with extra args should succeed', async () => {
    const f = a => ({ foo: a });

    const context = Aston.inject({ multi: f });
    const instance = await context.get(f, 1);
    expect(instance).toEqual({ foo: 1 });
  });

  test('add and get create unnamed function returns different result with args', async () => {
    const f = a => ({ foo: a });

    const context = Aston.inject({ multi: f });
    const instance1 = await context.get(f, 1);
    const instance2 = await context.get(f, 2);
    expect(instance1).toEqual({ foo: 1 });
    expect(instance2).toEqual({ foo: 2 });
  });

  test('add and get create class returns different result with args', async () => {
    class Test {
      constructor(value) {
        this.value = value;
      }
    }

    const context = Aston.inject({ multi: Test });
    const instance1 = await context.get(Test, 1);
    const instance2 = await context.get(Test, 2);
    expect(instance1.value).toEqual(1);
    expect(instance2.value).toEqual(2);
  });

  test('add structured create works as expected', async () => {
    const context = Aston.inject(
      {
        key: 'a',
        multi: () => 1
      },
      {
        key: 'b',
        multi: () => ({ foo: 1 })
      }
    );

    expect(await context.get('a')).toBe(1);
    const instance1 = await context.get('b');
    const instance2 = await context.get('b');
    expect(instance1).toEqual({ foo: 1 });
    expect(instance1).not.toBe(instance2);
  });

  test('add structured create class and instance works as expected', async () => {
    class Test {}

    const context = Aston.inject({
      key: 'a',
      multi: Test
    });

    const instance1 = await context.get('a');
    const instance2 = await context.get('a');
    expect(instance1 instanceof Test).toBe(true);
    expect(instance1).not.toBe(instance2);
  });

  test('add promise create returns new resolved instance with arguments', async () => {
    const context = Aston.inject({
      key: 'a',
      multi: async v => {
        await wait(100);
        return { foo: v };
      }
    });

    const instance1 = await context.get('a', 1);
    const instance2 = await context.get('a', 2);
    expect(instance1).toEqual({ foo: 1 });
    expect(instance2).toEqual({ foo: 2 });
  });

  test('add create with args returns new instance with arg', async () => {
    const context = Aston.inject({
      key: 'a',
      multi: async (value1, value2) => {
        await wait(100);
        return { value1, value2 };
      },
      args: [1]
    });

    const instance1 = await context.get('a', 10);
    const instance2 = await context.get('a', 11);
    expect(instance1).toEqual({ value1: 1, value2: 10 });
    expect(instance2).toEqual({ value1: 1, value2: 11 });
  });

  test('add and get create instance with specific key works and passes arguments', async () => {
    const f = () => {};

    const context = Aston.inject(
      { key: 1, multi: () => 10 },
      { key: 'a', multi: v => ({ foo: v }) },
      {
        key: f,
        multi: async v => {
          await wait(100);
          return v * 2;
        }
      }
    );

    expect(await context.get(1)).toBe(10);
    expect(await context.get(f, 2)).toBe(4);
    const instance1 = await context.get('a', 1);
    const instance2 = await context.get('a', 2);
    expect(instance1).toEqual({ foo: 1 });
    expect(instance2).toEqual({ foo: 2 });
  });

  test(
    'no side effects',
    expectAstonError(async () => {
      Aston.inject({ key: 'a', value: 1 });

      await Aston.get('a');
    })
  );

  test(
    'no overwrite value',
    expectAstonError(async () => {
      const context1 = Aston.inject(
        { key: 'a', value: 1 },
        { key: 'b', value: 2 }
      );

      context1.inject({
        key: 'a',
        single: () => ({ test: 'foo' })
      });
    })
  );

  test('inject constructor single class', async () => {
    class Logic {
      static ASTON_CONSTRUCTOR = ['test'];

      value = 0;

      constructor(test) {
        this.value = test;
      }
    }

    const context = Aston.inject(
      { single: Logic },
      {
        key: 'test',
        single: async () => {
          await wait(100);
          return 1;
        }
      }
    );
    const instance1 = await context.get(Logic);
    const instance2 = await context.get(Logic);
    expect(instance1.value).toBe(1);
    expect(instance1).toBe(instance2);
  });

  test('inject constructor create class', async () => {
    class Logic {
      static ASTON_CONSTRUCTOR = 'test';

      value = 0;

      constructor(test) {
        this.value = test;
      }
    }

    const context = Aston.inject(
      { multi: Logic },
      { key: 'test', multi: async () => 1 }
    );
    const instance1 = await context.get(Logic);
    const instance2 = await context.get(Logic);
    expect(instance1.value).toBe(1);
    expect(instance1).not.toBe(instance2);
  });

  test('inject direct single class', async () => {
    class Logic {
      static ASTON_INJECT = { value: 'test' };

      value;
    }

    const context = Aston.inject(
      { single: Logic },
      {
        key: 'test',
        single: async () => {
          await wait(100);
          return 1;
        }
      }
    );
    const instance1 = await context.get(Logic);
    const instance2 = await context.get(Logic);
    expect(instance1.value).toBe(1);
    expect(instance1).toBe(instance2);
  });

  test('inject direct create class', async () => {
    class Logic {
      static ASTON_INJECT = { value: 'test' };

      value;
    }

    const context = Aston.inject(
      { multi: Logic },
      {
        key: 'test',
        multi: async () => {
          await wait(100);
          return 1;
        }
      }
    );
    const instance1 = await context.get(Logic);
    const instance2 = await context.get(Logic);
    expect(instance1.value).toBe(1);
    expect(instance1).not.toBe(instance2);
  });

  test(
    'single cannot depend on future',
    expectAstonError(async () => {
      class Test {
        static ASTON_INJECT = { test: 'value' };
      }

      const context1 = Aston.inject({ single: Test });
      const context2 = context1.inject({ key: 'value', value: 1 });

      await context2.get(Test);
    })
  );

  test(
    'multi cannot depend on future',
    expectAstonError(async () => {
      class Test {
        static ASTON_INJECT = { foo: 'thevalue' };

        foo;

        bar = this.foo;
      }

      const context1 = Aston.inject({ multi: Test });
      const context2 = context1.inject({ key: 'thevalue', value: 1 });

      const instance = await context2.get(Test);
    })
  );
});
