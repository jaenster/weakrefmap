import {WeakRefMap} from "../src";

describe('test', function () {


  const a = {}, b = {}, c = {}, d = undefined;
  const weakRefMap = new WeakRefMap<number, object>([[0, a], [1, b]]);

  it('add', function () {

    expect(weakRefMap.size).toBe(2);
    weakRefMap.set(0, a) // already in
    expect(weakRefMap.size).toBe(2);
    weakRefMap.set(1, c)
    expect(weakRefMap.size).toBe(3);
    weakRefMap.set(2, d) // doesnt work
    expect(weakRefMap.size).toBe(3);

  })

  test('for each / delete / has', function () {
    weakRefMap.forEach((value, key) => {
      expect(weakRefMap.size).toBe(3);
      expect(weakRefMap.has(key)).toBe(true);

      weakRefMap.delete(key);
      expect(weakRefMap.size).toBe(2);

      expect(weakRefMap.has(key)).toBe(false);

      weakRefMap.set(key, value);
      expect(weakRefMap.size).toBe(3);
    })
  })
});