export class AstonError extends Error {}

const create = async (aston, constr, supplyAston, ...args) => {
  let result;

  let inject = [];

  if (constr.ASTON_CONSTRUCTOR) {
    inject = await aston.getItems(constr.ASTON_CONSTRUCTOR);
  }

  if (constr.ASTON_INJECT) {
    const injectKeys = Object.keys(constr.ASTON_INJECT);

    const promises = injectKeys.map(key =>
      aston.get(constr.ASTON_INJECT[key])
    );

    result = new constr(...inject, ...args);

    const values = await Promise.all(promises);
    for (let i = 0; i < injectKeys.length; i++) {
      // adding to prototype ensures values can be accessed in constructor
      result[injectKeys[i]] = values[i];
    }
  } else {
    try {
      if (supplyAston) result = constr(aston, ...inject, ...args);
      else result = constr(...inject, ...args);
    } catch (e) {
      if (e instanceof AstonError) throw e;
      result = new constr(...inject, ...args);
    }
  }

  return result;
};

class AstonInstance {
  #map;

  constructor(map) {
    this.#map = new Map(map);
  }

  #clone = () => new AstonInstance(this.#map);

  #injectItem = (item, aston) => {
    const { key, value, single, multi } = item;

    if (key === undefined && value !== undefined)
      throw new AstonError('can only inject a value with a key');

    const singleOrMulti = single || multi;
    if (singleOrMulti !== undefined && !(singleOrMulti instanceof Object))
      throw new AstonError('single or multi must be constructable');
    if (multi !== undefined && typeof multi === 'object')
      throw new AstonError('multi cannot be an object instance');

    let count = 0;
    if (single !== undefined) count++;
    if (multi !== undefined) count++;
    if (value !== undefined) count++;

    if (count !== 1)
      throw new AstonError(
        'injected item should specify exactly one of the value, single or multi properties'
      );

    let itemKey = key;

    if (itemKey === null || itemKey === undefined) {
      if (typeof single === 'object') {
        aston.#map.set(single.constructor, { value: single });
        return;
      }

      itemKey = single || multi;
    }

    if (aston.#map.has(itemKey)) throw new AstonError('duplicate key added');

    if (singleOrMulti) item.astonInstance = aston;
    aston.#map.set(itemKey, item);
  };

  inject = (...items) => {
    if (items.length === 0) return this;

    const newAston = this.#clone();

    items.forEach(item => {
      this.#injectItem({ ...item }, newAston);
    });

    return newAston;
  };

  get = (searchKey, ...extraArgs) => {
    if (!this.#map.has(searchKey))
      throw new AstonError(`key not defined: ${searchKey}`);

    const item = this.#map.get(searchKey);

    const { single, value, multi, args = [], supplyAston = false } = item;

    if (value !== undefined) {
      return value;
    }
    if (multi)
      return create(
        item.astonInstance,
        multi,
        supplyAston,
        ...args,
        ...extraArgs
      );

    if (extraArgs.length > 0)
      throw new AstonError('Single item should not receive extra arguments');

    item.value = create(
      item.astonInstance,
      single,
      supplyAston,
      ...args,
      ...extraArgs
    );
    item.astonInstance = null;
    return item.value;
  };

  #getItem = item => {
    if (Array.isArray(item)) {
      const [key, ...args] = item;
      return this.get(key, ...args);
    }

    return this.get(item);
  };

  getItems = (...items) => Promise.all(items.map(this.#getItem));
}

const Aston = new AstonInstance();

export default Aston;
